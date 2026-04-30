class GameApp {
  constructor(config) {
    this.config = config;
    if (!this.config.scenes) this.config.scenes = {};
    if (!this.config.scenes.scene0) {
      this.config.scenes.scene0 = {
        id: 'scene0',
        type: 'signal-challenge',
        promptText: '가져왔나? 그러면 신호를 보내주게나',
        correctAnswer: 'FIGHT',
        nextSceneId: 'scene1',
        image: '',
        bgm: ''
      };
    }
    const s4 = this.config.scenes.scene4;
    if (s4 && s4.type === 'dialogue' && s4.nextSceneId === 'scene1') {
      s4.nextSceneId = 'scene0';
    }
    this.currentSceneId = 'scene0';
    this.bgm = null;
    this.screens = {
      'signal-challenge': document.getElementById('screen-signal'),
      'whack-a-rat': document.getElementById('screen-game'),
      'dialogue': document.getElementById('screen-dialogue')
    };

    this.ratHp = 100;
    this.ratMaxHp = 100;
    this.timeLeft = 0;
    this.timer = null;
    this.timeUp = true;
    this.currentCombo = 0;
    this.lastHole = null;

    this.init();
  }

  init() {
    this.setupEventListeners();
    this.showScene(this.currentSceneId);
  }

  playBGM(src) {
    if (!src) return;

    if (this.bgm && this.bgm.src.includes(src) && !this.bgm.paused) return;

    if (this.bgm) {
      this.bgm.pause();
      this.bgm = null;
    }

    this.bgm = new Audio(src);
    this.bgm.loop = true;
    this.bgm.volume = (this.config.audio && this.config.audio.bgmVolume) || 0.5;

    const startAudio = () => {
      this.bgm.play().then(() => {
        window.removeEventListener('click', startAudio);
        window.removeEventListener('touchstart', startAudio);
      }).catch(() => { });
    };

    startAudio();
    window.addEventListener('click', startAudio);
    window.addEventListener('touchstart', startAudio);
  }

  playHitSfx() {
    const scene = this.config.scenes[this.currentSceneId];
    const fromScene = scene && scene.hitSfx;
    const fromAudio = this.config.audio && this.config.audio.hitSfx;
    const src = (fromScene && String(fromScene).trim()) || (fromAudio && String(fromAudio).trim()) || 'assets/sfx.wav';
    if (!src) return;
    const volRaw = this.config.audio && this.config.audio.sfxVolume;
    const vol = Number.isFinite(Number(volRaw)) ? Math.max(0, Math.min(1, Number(volRaw))) : 0.85;
    const a = new Audio(src);
    a.volume = vol;
    a.play().catch(() => { });
  }

  applyRatVisual(scene) {
    const url = (scene.ratImage && String(scene.ratImage).trim()) || '';
    document.querySelectorAll('.hole .rat').forEach((ratEl) => {
      ratEl.classList.remove('rat-hit-flash');
      ratEl.innerHTML = '';
      if (url) {
        const img = document.createElement('img');
        img.className = 'rat-img';
        img.src = url;
        img.alt = '';
        ratEl.appendChild(img);
      } else {
        const span = document.createElement('span');
        span.className = 'rat-emoji';
        span.textContent = '🐭';
        ratEl.appendChild(span);
      }
    });
  }

  showScene(sceneId) {
    this.currentSceneId = sceneId;
    this._onSignalKey = null;
    const scene = this.config.scenes[sceneId];
    if (!scene) {
      console.warn('Unknown scene:', sceneId);
      return;
    }

    Object.values(this.screens).forEach(s => {
      s.classList.add('hidden');
      s.classList.remove('shaky');
      s.style.removeProperty('--shake-intensity');
    });

    this.playBGM(scene.bgm);

    if (scene.type === 'whack-a-rat') {
      this.initWhackARat(scene);
    } else if (scene.type === 'dialogue') {
      this.initDialogue(scene);
    } else if (scene.type === 'signal-challenge') {
      this.initSignalChallenge(scene);
    }
  }

  setupEventListeners() {
    window.addEventListener('keydown', (e) => {
      if (this.timeUp) return;
      let key = e.key;
      if (key.startsWith('Numpad')) key = key.replace('Numpad', '');
      const targetHole = document.querySelector(`#hole-${key}`);
      if (targetHole) this.whack(targetHole);
    });

    document.querySelectorAll('.hole').forEach(hole => {
      hole.addEventListener('click', () => this.whack(hole));
    });

    document.getElementById('start-btn').addEventListener('click', () => this.startGame());

    window.addEventListener('keydown', (e) => {
      if (typeof this._onSignalKey !== 'function') return;
      let k = e.key;
      if (k.startsWith('Numpad')) k = k.replace('Numpad', '');
      if (!/^[1-9]$/.test(k)) return;
      e.preventDefault();
      this._onSignalKey(k);
    });
  }

  applyUIPositions(scene, overrides) {
    const merged = Object.assign(
      {},
      this.config.uiPositions || {},
      (scene && scene.uiPositions) || {},
      overrides || {}
    );

    const applyOne = (id, pos) => {
      if (id === 'dialogue-next-btn') return;
      const el = document.getElementById(id);
      if (!el || !pos) return;

      el.style.position = el.style.position || 'absolute';

      const setPct = (prop, value) => {
        if (value === undefined || value === null || Number.isNaN(Number(value))) return;
        el.style[prop] = `${Number(value)}%`;
      };

      setPct('top', pos.topPct);
      setPct('left', pos.leftPct);
      setPct('right', pos.rightPct);
      setPct('bottom', pos.bottomPct);
      setPct('width', pos.widthPct);
      setPct('height', pos.heightPct);

      if (pos.centerX) el.style.transform = 'translateX(-50%)';
      if (pos.centerXY) el.style.transform = 'translate(-50%, -50%)';
      if (pos.leftPct === 50 && !pos.rightPct) el.style.transform = 'translateX(-50%)';
    };

    Object.entries(merged).forEach(([id, pos]) => applyOne(id, pos));
  }

  buildSignalLetterBoard(answerRaw) {
    let word = String(answerRaw || 'FIGHT').toUpperCase().replace(/[^A-Z]/g, '');
    if (!word) word = 'FIGHT';
    if (word.length > 9) word = word.slice(0, 9);

    const cells = new Array(9).fill('');
    const positions = [0, 1, 2, 3, 4, 5, 6, 7, 8];
    for (let i = positions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [positions[i], positions[j]] = [positions[j], positions[i]];
    }

    const placedAt = [];
    for (let i = 0; i < word.length; i++) {
      const pos = positions[i];
      cells[pos] = word[i];
      placedAt.push(pos);
    }

    const inAnswer = {};
    for (let c = 0; c < word.length; c++) {
      inAnswer[word[c]] = (inAnswer[word[c]] || 0) + 1;
    }

    for (let j = word.length; j < 9; j++) {
      const pos = positions[j];
      let ch;
      let guard = 0;
      do {
        ch = String.fromCharCode(65 + Math.floor(Math.random() * 26));
        guard++;
      } while (inAnswer[ch] && guard < 60);
      cells[pos] = ch;
    }

    return { word, cells, placedAt };
  }

  initSignalChallenge(scene) {
    const screen = this.screens['signal-challenge'];
    screen.classList.remove('hidden');

    const bgEl = document.getElementById('signal-bg');
    if (bgEl) {
      if (scene.image) {
        bgEl.style.backgroundImage = `url(${scene.image})`;
        bgEl.classList.remove('hidden');
      } else {
        bgEl.style.backgroundImage = 'none';
        bgEl.classList.add('hidden');
      }
    }

    const promptEl = document.getElementById('signal-prompt');
    const errEl = document.getElementById('signal-error');
    const gridEl = document.getElementById('signal-grid');
    const progressEl = document.getElementById('signal-progress');
    promptEl.textContent = scene.promptText || '';
    errEl.classList.add('hidden');

    const { word, cells, placedAt } = this.buildSignalLetterBoard(scene.correctAnswer);
    let picks = [];

    const keypadToIndex = { '7': 0, '8': 1, '9': 2, '4': 3, '5': 4, '6': 5, '1': 6, '2': 7, '3': 8 };

    const renderProgress = () => {
      progressEl.innerHTML = '';
      for (let i = 0; i < word.length; i++) {
        const slot = document.createElement('div');
        slot.className = 'signal-progress-slot';
        if (i < picks.length) {
          slot.classList.add('filled');
          slot.textContent = cells[picks[i]];
        } else if (i === picks.length) {
          slot.classList.add('next');
          slot.textContent = '·';
        } else {
          slot.textContent = '·';
        }
        progressEl.appendChild(slot);
      }
    };

    gridEl.innerHTML = '';
    const cellEls = [];
    for (let i = 0; i < 9; i++) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'signal-cell';
      btn.dataset.signalIndex = String(i);
      btn.textContent = cells[i];
      btn.setAttribute('aria-label', `글자 ${cells[i]}`);
      gridEl.appendChild(btn);
      cellEls.push(btn);
    }

    const clearCellAnim = (btn, cls) => {
      setTimeout(() => btn.classList.remove(cls), 280);
    };

    const failSequence = (idx) => {
      picks = [];
      renderProgress();
      errEl.classList.remove('hidden');
      const btn = cellEls[idx];
      if (btn) {
        btn.classList.add('signal-cell-wrong');
        clearCellAnim(btn, 'signal-cell-wrong');
      }
    };

    const picksMatchPlacedAt = () => {
      if (picks.length !== placedAt.length) return false;
      for (let j = 0; j < picks.length; j++) {
        if (picks[j] !== placedAt[j]) return false;
      }
      return true;
    };

    const tryIndex = (idx) => {
      if (idx < 0 || idx > 8) return;
      if (picks.length >= word.length) return;

      picks.push(idx);
      renderProgress();

      if (picks.length < word.length) {
        errEl.classList.add('hidden');
        return;
      }

      if (picksMatchPlacedAt()) {
        errEl.classList.add('hidden');
        const btn = cellEls[idx];
        if (btn) {
          btn.classList.add('signal-cell-ok');
          clearCellAnim(btn, 'signal-cell-ok');
        }
        this._onSignalKey = null;
        this.showScene(scene.nextSceneId || 'scene1');
      } else {
        failSequence(idx);
      }
    };

    gridEl.onclick = (e) => {
      const btn = e.target.closest('.signal-cell');
      if (!btn) return;
      const idx = parseInt(btn.dataset.signalIndex, 10);
      if (Number.isNaN(idx)) return;
      tryIndex(idx);
    };

    this._onSignalKey = (k) => {
      const idx = keypadToIndex[k];
      if (idx === undefined) return;
      tryIndex(idx);
    };

    renderProgress();
  }

  initWhackARat(scene) {
    const screen = this.screens['whack-a-rat'];
    screen.classList.remove('hidden');

    const bgEl = document.getElementById('screen-game-bg');
    if (bgEl) {
      if (scene.image) {
        bgEl.style.backgroundImage = `url(${scene.image})`;
        bgEl.classList.remove('hidden');
      } else {
        bgEl.style.backgroundImage = 'none';
        bgEl.classList.add('hidden');
      }
    }

    document.getElementById('game-title').textContent = scene.title || 'RAT SWEEP';
    document.getElementById('game-desc').textContent = scene.desc || '';
    document.getElementById('time').textContent = scene.gameTime;

    this.applyRatVisual(scene);

    this.resetGameState(scene);
    document.getElementById('overlay').classList.add('visible');
    document.getElementById('msg-title').textContent = 'READY?';
    document.getElementById('final-score-container').classList.add('hidden');
    document.getElementById('start-btn').textContent = '미션 시작';
  }

  getRatMaxHp(scene) {
    const raw = scene.ratMaxHp ?? scene.targetScore;
    const n = parseInt(raw ?? 100, 10);
    return Number.isFinite(n) && n > 0 ? n : 100;
  }

  resetGameState(scene) {
    this.ratMaxHp = this.getRatMaxHp(scene);
    this.ratHp = this.ratMaxHp;
    this.timeLeft = scene.gameTime;
    this.currentCombo = 0;
    this.timeUp = true;
    this.updateHUD();
  }

  startGame() {
    const scene = this.config.scenes[this.currentSceneId];
    this.resetGameState(scene);
    this.timeUp = false;
    document.getElementById('time').textContent = this.timeLeft;
    document.getElementById('overlay').classList.remove('visible');
    this.peep();

    this.timer = setInterval(() => {
      this.timeLeft--;
      document.getElementById('time').textContent = this.timeLeft;
      if (this.timeLeft <= 0) {
        this.endGame();
      }
    }, 1000);
  }

  winGame() {
    this.timeUp = true;
    clearInterval(this.timer);
    const scene = this.config.scenes[this.currentSceneId];
    setTimeout(() => this.showScene(scene.nextSceneId), 1500);
  }

  endGame() {
    this.timeUp = true;
    clearInterval(this.timer);

    const scene = this.config.scenes[this.currentSceneId];
    if (this.ratHp <= 0) {
      this.winGame();
      return;
    }
    document.getElementById('msg-title').textContent = 'TIME OVER!';
    const cap = document.getElementById('final-result-caption');
    if (cap) cap.textContent = '남은 체력';
    document.getElementById('final-score-container').classList.remove('hidden');
    document.getElementById('final-score').textContent = this.ratHp;
    document.getElementById('start-btn').textContent = '다시 시도';
    document.getElementById('overlay').classList.add('visible');
  }

  peep() {
    if (this.timeUp) return;
    const time = Math.random() * (1000 - 400) + 400;
    const hole = this.randomHole();
    const rat = hole.querySelector('.rat');

    rat.classList.add('up');

    setTimeout(() => {
      rat.classList.remove('up');
      if (!this.timeUp) this.peep();
    }, time);
  }

  randomHole() {
    const holes = document.querySelectorAll('.hole');
    const idx = Math.floor(Math.random() * holes.length);
    const hole = holes[idx];
    if (hole === this.lastHole) return this.randomHole();
    this.lastHole = hole;
    return hole;
  }

  whack(holeElement) {
    if (this.timeUp) return;
    const rat = holeElement.querySelector('.rat');
    if (!rat.classList.contains('up')) {
      this.currentCombo = 0;
      this.updateHUD();
      return;
    }

    rat.classList.remove('up');
    const dmg = Math.min(5 + Math.min(this.currentCombo, 5), 10);
    this.currentCombo++;
    this.ratHp = Math.max(0, this.ratHp - dmg);
    this.updateHUD();

    this.playHitSfx();
    this.createHammerEffect(holeElement);
    rat.classList.remove('rat-hit-flash');
    void rat.offsetWidth;
    rat.classList.add('rat-hit-flash');
    setTimeout(() => rat.classList.remove('rat-hit-flash'), 500);

    if (this.ratHp <= 0) {
      this.winGame();
    }
  }

  updateHUD() {
    const fill = document.getElementById('hp-bar-fill');
    const hpText = document.getElementById('hp-text');
    const comboEl = document.getElementById('combo');
    const pct = this.ratMaxHp > 0 ? (this.ratHp / this.ratMaxHp) * 100 : 0;
    if (fill) fill.style.width = `${pct}%`;
    if (hpText) hpText.textContent = `${this.ratHp} / ${this.ratMaxHp}`;
    if (comboEl) comboEl.textContent = `콤보 ${this.currentCombo}`;
  }

  createHammerEffect(hole) {
    const hammer = document.createElement('div');
    hammer.className = 'hammer-effect';
    hammer.textContent = '🔨';
    hammer.style.left = '50%';
    hammer.style.top = '50%';
    hole.appendChild(hammer);
    setTimeout(() => hammer.remove(), 300);
  }

  initDialogue(scene) {
    const screen = this.screens['dialogue'];
    screen.classList.remove('hidden');
    if (scene.image) screen.style.backgroundImage = `url(${scene.image})`;
    else screen.style.backgroundImage = 'none';

    this.applyUIPositions(scene);
    const shakeIntensityPx = Number(scene.shakeIntensityPx ?? 0);
    if (shakeIntensityPx > 0) {
      screen.classList.add('shaky');
      screen.style.setProperty('--shake-intensity', `${shakeIntensityPx}px`);
    }

    const speakerEl = document.getElementById('dialogue-speaker');
    const textEl = document.getElementById('dialogue-text');
    const nextBtn = document.getElementById('dialogue-next-btn');

    let currentLine = 0;
    let isTyping = false;
    let typingTimeout = null;
    let autoAdvanceTimeout = null;

    const shouldAutoAdvance = scene.autoAdvance !== false;

    const parseColorMarkup = (raw) => {
      let text = raw || '';
      text = text.replace(/<\/o>(.*?)<\/>/g, '<span style="color: var(--accent);">$1</span>');
      text = text.replace(/<\/w>(.*?)<\/>/g, '<span style="color: #ffffff;">$1</span>');
      return text;
    };

    const br = (s) => String(s ?? '').replaceAll('\n', '<br>');

    const getTypeSpeedMs = (line) => {
      const v = line?.typeSpeedMs ?? scene.typeSpeedMs ?? (this.config.text && this.config.text.typeSpeedMs);
      return Math.max(1, parseInt(v ?? 40, 10));
    };

    const getAutoGapMs = (line) => {
      const v = line?.autoAdvanceGapMs ?? scene.autoAdvanceGapMs ?? (this.config.text && this.config.text.autoAdvanceGapMs);
      return Math.max(0, parseInt(v ?? 1500, 10));
    };

    const getAutoLastGapMs = (line) => {
      const v = line?.autoAdvanceLastGapMs ?? scene.autoAdvanceLastGapMs ?? (this.config.text && this.config.text.autoAdvanceLastGapMs);
      return Math.max(0, parseInt(v ?? 2000, 10));
    };

    const parseFontRem = (v) => {
      if (v === undefined || v === null || v === '') return null;
      const n = parseFloat(v);
      return Number.isFinite(n) && n > 0 ? n : null;
    };

    const applyDialogueFontSizes = (dialogue) => {
      const bodyRem = parseFontRem(dialogue.fontSizeRem ?? scene.dialogueFontRem ?? (this.config.text && this.config.text.dialogueFontRem));
      const speakerRem = parseFontRem(dialogue.speakerFontSizeRem ?? scene.speakerFontRem ?? (this.config.text && this.config.text.speakerFontRem));
      if (speakerRem != null) speakerEl.style.fontSize = `${speakerRem}rem`;
      else speakerEl.style.removeProperty('font-size');
      if (bodyRem != null) textEl.style.fontSize = `${bodyRem}rem`;
      else textEl.style.removeProperty('font-size');
    };

    const clearTimers = () => {
      if (typingTimeout) {
        clearTimeout(typingTimeout);
        typingTimeout = null;
      }
      if (autoAdvanceTimeout) {
        clearTimeout(autoAdvanceTimeout);
        autoAdvanceTimeout = null;
      }
    };

    const showFinalButton = () => {
      nextBtn.classList.remove('hidden');
      nextBtn.textContent = scene.buttonText || '다음';
      nextBtn.onclick = () => {
        clearTimers();
        this.showScene(scene.nextSceneId);
      };
    };

    const showLine = () => {
      clearTimers();

      if (currentLine >= scene.dialogues.length) {
        showFinalButton();
        return;
      }

      const dialogue = scene.dialogues[currentLine];
      const sp = String(dialogue.speaker ?? '').trim();
      speakerEl.textContent = dialogue.speaker || '';
      speakerEl.style.display = sp ? 'block' : 'none';
      applyDialogueFontSizes(dialogue);
      textEl.innerHTML = '';
      nextBtn.classList.add('hidden');

      const fullText = dialogue.text || '';
      const revealMode = dialogue.revealMode || (this.config.text && this.config.text.revealMode) || 'typewriter';
      const isInstant = revealMode === 'instant' || getTypeSpeedMs(dialogue) === 0;
      const isLastLine = currentLine === scene.dialogues.length - 1;
      const holdLastForButton = isLastLine && !!dialogue.isFinal;

      const afterLineRevealed = (line) => {
        if (isLastLine) {
          if (shouldAutoAdvance && !holdLastForButton) {
            autoAdvanceTimeout = setTimeout(() => {
              if (this.currentSceneId !== scene.id) return;
              this.showScene(scene.nextSceneId);
            }, getAutoLastGapMs(line));
          } else {
            showFinalButton();
          }
          return;
        }

        if (shouldAutoAdvance) {
          autoAdvanceTimeout = setTimeout(() => {
            if (this.currentSceneId !== scene.id) return;
            currentLine++;
            showLine();
          }, getAutoGapMs(line));
        }
      };

      if (isInstant) {
        isTyping = false;
        const html = dialogue.isInstruction
          ? `<span class="instruction">${parseColorMarkup(br(fullText))}</span>`
          : parseColorMarkup(br(fullText));
        textEl.innerHTML = html;
        afterLineRevealed(dialogue);
        return;
      }

      isTyping = true;
      let charIndex = 0;
      const typeSpeed = getTypeSpeedMs(dialogue);

      const type = () => {
        if (this.currentSceneId !== scene.id) return;
        if (charIndex < fullText.length) {
          charIndex++;
          const visibleText = fullText.slice(0, charIndex);
          const inner = dialogue.isInstruction
            ? `<span class="instruction">${parseColorMarkup(br(visibleText))}</span>`
            : parseColorMarkup(br(visibleText));
          textEl.innerHTML = inner;
          typingTimeout = setTimeout(type, typeSpeed);
        } else {
          isTyping = false;
          if (!shouldAutoAdvance) {
            showFinalButton();
            return;
          }
          afterLineRevealed(dialogue);
        }
      };

      type();
    };

    nextBtn.onclick = null;
    showLine();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.app = new GameApp(window.gameConfig);
});
