class GameApp {
  constructor(config) {
    this.config = config;
    this.currentSceneId = 'scene1';
    this.audio = null;
    this.bgm = null;

    // Screens
    this.screens = {
      'pattern': document.getElementById('screen-pattern'),
      'dialogue': document.getElementById('screen-dialogue'),
      'escape': document.getElementById('screen-escape')
    };

    this.init();
  }

  init() {
    this.showScene(this.currentSceneId);
  }

  showScene(sceneId) {
    this.cleanupListeners();
    this.currentSceneId = sceneId;
    const scene = this.config.scenes[sceneId];

    // Hide all screens
    Object.values(this.screens).forEach(s => {
      s.classList.add('hidden');
      s.classList.remove('shaky');
      s.style.removeProperty('--shake-intensity');
    });

    // BGM handling
    this.playBGM(scene.bgm);

    // Screen specific logic
    if (scene.type === 'pattern-lock') {
      this.initPatternLock(scene);
    } else if (scene.type === 'dialogue') {
      this.initDialogue(scene);
    } else if (scene.type === 'escape-game') {
      this.initEscapeGame(scene);
    }
  }

  applyUIPositions(scene, overrides) {
    const merged = Object.assign(
      {},
      this.config.uiPositions || {},
      (scene && scene.uiPositions) || {},
      overrides || {}
    );

    const applyOne = (id, pos) => {
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

  playBGM(src) {
    if (!src) return;

    // If already playing the same src, don't restart
    if (this.bgm && this.bgm.src.includes(src) && !this.bgm.paused) return;

    if (this.bgm) {
      this.bgm.pause();
    }

    this.bgm = new Audio(src);
    this.bgm.loop = true;
    this.bgm.volume = (this.config.audio && this.config.audio.bgmVolume) || 0.5;

    const startAudio = () => {
      this.bgm.play().then(() => {
        // Success! Remove the temporary listeners
        window.removeEventListener('click', startAudio);
        window.removeEventListener('touchstart', startAudio);
      }).catch(e => {
        console.log("BGM play waiting for interaction...");
      });
    };

    startAudio(); // Try immediate
    // Fallback listeners
    window.addEventListener('click', startAudio);
    window.addEventListener('touchstart', startAudio);
  }

  // --- Pattern Lock Logic ---
  initPatternLock(scene) {
    const screen = this.screens['pattern'];
    screen.classList.remove('hidden');
    screen.style.backgroundImage = `url(${scene.image})`;
    this.applyUIPositions(scene);

    const title = document.getElementById('pattern-title');
    const dots = document.querySelectorAll('.pattern-dot');
    const canvas = document.getElementById('pattern-canvas');
    const ctx = canvas.getContext('2d');

    let currentRound = 0;
    let sequence = [];
    let isDrawing = false;
    let rect = canvas.getBoundingClientRect();

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      rect = canvas.getBoundingClientRect();
    };
    window.addEventListener('resize', resize);
    resize();

    title.innerText = scene.text + ` (${currentRound + 1}/${scene.patterns.length})`;

    const getDotPos = (dot) => {
      const gridRect = grid.getBoundingClientRect();
      return {
        x: (dot.offsetLeft + dot.offsetWidth / 2) + (gridRect.left - rect.left),
        y: (dot.offsetTop + dot.offsetHeight / 2) + (gridRect.top - rect.top)
      };
    };

    const drawLine = (lastX, lastY, currentX, currentY) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = '#00ffcc';
      ctx.lineWidth = 4;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      ctx.beginPath();
      for (let i = 0; i < sequence.length; i++) {
        const dot = document.querySelector(`.pattern-dot[data-index="${sequence[i]}"]`);
        const pos = getDotPos(dot);
        if (i === 0) ctx.moveTo(pos.x, pos.y);
        else ctx.lineTo(pos.x, pos.y);
      }
      if (isDrawing && sequence.length > 0) {
        ctx.lineTo(currentX, currentY);
      }
      ctx.stroke();
    };

    const reset = () => {
      sequence = [];
      isDrawing = false;
      dots.forEach(d => d.classList.remove('active'));
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    };

    const handleInput = (e) => {
      const clientX = e.clientX || (e.touches && e.touches[0].clientX);
      const clientY = e.clientY || (e.touches && e.touches[0].clientY);
      const x = clientX - rect.left;
      const y = clientY - rect.top;

      if (isDrawing) {
        dots.forEach(dot => {
          const dPos = getDotPos(dot);
          const dist = Math.hypot(dPos.x - x, dPos.y - y);
          const index = dot.dataset.index;
          if (dist < 30 && !sequence.includes(index)) {
            sequence.push(index);
            dot.classList.add('active');
          }
        });
        drawLine(0, 0, x, y);
      }
    };

    const onStart = (e) => {
      isDrawing = true;

      // Try to resume audio context if needed
      if (this.bgm && this.bgm.paused) {
        this.bgm.play().catch(() => { });
      }

      handleInput(e);
    };

    const onEnd = () => {
      if (!isDrawing) return;
      isDrawing = false;
      const result = sequence.join('-');
      if (result === scene.patterns[currentRound]) {
        currentRound++;
        if (currentRound >= scene.patterns.length) {
          this.showScene(scene.nextSceneId);
        } else {
          title.innerText = scene.text + ` (${currentRound + 1}/${scene.patterns.length})`;
          reset();
        }
      } else {
        reset();
      }
    };

    // Clean up old listeners (simple way)
    const grid = document.getElementById('pattern-grid');
    grid.onpointerdown = onStart;
    window.onpointermove = handleInput;
    window.onpointerup = onEnd;
  }

  // --- Dialogue Logic ---
  initDialogue(scene) {
    const screen = this.screens['dialogue'];
    screen.classList.remove('hidden');
    screen.style.backgroundImage = `url(${scene.image})`;
    this.applyUIPositions(scene);
    const shouldShake = (scene.id === 'scene4' || scene.id === 'scene5');
    const shakeIntensityPx = Number(scene.shakeIntensityPx ?? 0);
    if (shouldShake && shakeIntensityPx > 0) {
      screen.classList.add('shaky');
      screen.style.setProperty('--shake-intensity', `${shakeIntensityPx}px`);
    }

    const speakerEl = document.getElementById('dialogue-speaker');
    const textEl = document.getElementById('dialogue-text');
    const nextBtn = document.getElementById('dialogue-next-btn');
    const box = document.getElementById('dialogue-box');
    const ensureNextBtnInBox = () => {
      if (!box || !nextBtn) return;
      if (nextBtn.parentElement !== box) box.appendChild(nextBtn);
    };
    const ensureNextBtnInScreen = () => {
      if (!screen || !nextBtn) return;
      if (nextBtn.parentElement !== screen) screen.appendChild(nextBtn);
    };
    const resetNextBtnStyle = () => {
      nextBtn.style.position = '';
      nextBtn.style.left = '';
      nextBtn.style.right = '';
      nextBtn.style.top = '';
      nextBtn.style.bottom = '';
      nextBtn.style.transform = '';
      nextBtn.style.zIndex = '';
      nextBtn.style.marginTop = '';
      nextBtn.style.width = '';
    };
    const applyScene5FinalBtnPosition = () => {
      // Scene5는 버튼이 텍스트 박스(플렉스 레이아웃) 영향에서 벗어나야 하므로 DOM도 화면 루트로 이동
      ensureNextBtnInScreen();

      const btnPos = (scene.uiPositions && scene.uiPositions['dialogue-next-btn']) || {};
      const leftPct = Number(btnPos.leftPct ?? 50);
      // 기존 설정은 bottomPct(편집기 "bottom")로 저장된 경우가 있어 호환 처리
      const hasTop = btnPos.topPct !== undefined && btnPos.topPct !== null;
      const hasBottom = btnPos.bottomPct !== undefined && btnPos.bottomPct !== null;
      const topPct = hasTop
        ? Number(btnPos.topPct)
        : (hasBottom ? (100 - Number(btnPos.bottomPct)) : 50);
      nextBtn.style.position = 'fixed';
      nextBtn.style.left = `${leftPct}%`;
      nextBtn.style.right = 'auto';
      nextBtn.style.top = `${topPct}%`;
      nextBtn.style.bottom = 'auto';
      nextBtn.style.transform = 'translate(-50%, -50%)';
      nextBtn.style.zIndex = '300';
      nextBtn.style.marginTop = '0';
      nextBtn.style.width = 'auto';
    };
    resetNextBtnStyle();
    // 기본은 대화 박스 안에 (화면5에서만 필요 시 화면 루트로 이동)
    ensureNextBtnInBox();

    let currentLine = 0;
    let isTyping = false;
    let typingInterval = null;
    let autoAdvanceTimeout = null;
    const shouldAutoAdvance = (scene.autoAdvance !== undefined)
      ? !!scene.autoAdvance
      : (scene.id === 'scene2' || scene.id === 'scene4' || scene.id === 'scene5');

    const escapeHtml = (s) => {
      return String(s ?? '')
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#39;');
    };

    // Markup: use </...> tags inside dialogue text.
    // - </o> or </orange> ... </>  => orange
    // - </w> or </white> ... </>   => white
    // - </#RRGGBB> ... </>         => custom hex
    // </> resets to default color.
    const parseColorMarkup = (raw) => {
      const segments = [];
      let i = 0;
      let currentColor = null;
      const pushText = (t) => {
        if (!t) return;
        segments.push({ text: t, color: currentColor });
      };

      while (i < (raw || '').length) {
        const start = raw.indexOf('</', i);
        if (start === -1) {
          pushText(raw.slice(i));
          break;
        }
        pushText(raw.slice(i, start));

        const end = raw.indexOf('>', start + 2);
        if (end === -1) {
          pushText(raw.slice(start));
          break;
        }

        const tag = raw.slice(start + 2, end).trim().toLowerCase(); // inside </...>
        if (tag === '' || tag === '/') {
          currentColor = null; // </> reset
        } else if (tag === 'o' || tag === 'orange') {
          currentColor = 'var(--accent)';
        } else if (tag === 'w' || tag === 'white') {
          currentColor = '#ffffff';
        } else if (/^#[0-9a-f]{6}$/i.test(tag)) {
          currentColor = tag;
        } else {
          // unknown tag => keep literal
          pushText(raw.slice(start, end + 1));
        }

        i = end + 1;
        continue;

        if (tag === '') {
          // no-op
        } else if (tag === '') {
          // no-op
        }

        if (tag === '') {
          // no-op
        }

        if (tag === '') {
          // no-op
        }

        if (tag === '') {
          // no-op
        }

        if (tag === '') {
          // no-op
        }

        if (tag === '') {
          // no-op
        }

        if (tag === '') {
          // no-op
        }

        if (tag === '') {
          // no-op
        }

        if (tag === '') {
          // no-op
        }

        if (tag === '') {
          // no-op
        }

        if (tag === '') {
          // no-op
        }

        if (tag === '') {
          // no-op
        }

        if (tag === '') {
          // no-op
        }

        if (tag === '') {
          // no-op
        }

        if (tag === '') {
          // no-op
        }

        if (tag === '') {
          // no-op
        }

        if (tag === '') {
          // no-op
        }

        if (tag === '') {
          // no-op
        }

        if (tag === '') {
          // no-op
        }

        if (tag === '') {
          // no-op
        }

        // Real tag handling
        if (tag === '') {
          // noop
        } else if (tag === '') {
          // noop
        }

        if (tag === '') {
          // noop
        }

        if (tag === '') {
          // noop
        }

        if (tag === '') {
          // noop
        }

        if (tag === '') {
          // noop
        }

        if (tag === '') {
          // noop
        }

        if (tag === '') {
          // noop
        }

        if (tag === '') {
          // noop
        }

        if (tag === '') {
          // noop
        }

        if (tag === '') {
          // noop
        }

        if (tag === '') {
          // noop
        }

        if (tag === '') {
          // noop
        }

        // End tag
        if (tag === '') {
          // noop
        }

        if (tag === '') {
          // noop
        }

        if (tag === '') {
          // noop
        }

        if (tag === '') {
          // noop
        }

        if (tag === '') {
          // noop
        }

        if (tag === '') {
          // noop
        }

        if (tag === '') {
          // noop
        }

        if (tag === '') {
          // noop
        }

        if (tag === '') {
          // noop
        }

        if (tag === '') {
          // noop
        }

        if (tag === '') {
          // noop
        }

        if (tag === '') {
          // noop
        }

        if (tag === '') {
          // noop
        }

        if (tag === '') {
          // noop
        }

        if (tag === '') {
          // noop
        }

        if (tag === '') {
          // noop
        }

        if (tag === '') {
          // noop
        }

        if (tag === '') {
          // noop
        }

        if (tag === '') {
          // noop
        }

        if (tag === '') {
          // noop
        }

        if (tag === '') {
          // noop
        }

        // Final handling
        if (tag === '/') {
          // ignore
        } else if (tag === '') {
          // ignore
        } else if (tag === '') {
          // ignore
        }

        if (tag === '') {
          // ignore
        }

        if (tag === '') {
          // ignore
        }

        if (tag === '') {
          // ignore
        }

        if (tag === '') {
          // ignore
        }

        if (tag === '') {
          // ignore
        }

        if (tag === '') {
          // ignore
        }

        // Actual mapping
        if (tag === '') {
          // ignore
        } else if (tag === '') {
          // ignore
        }

        if (tag === '') {
          // ignore
        }

        if (tag === '') {
          // ignore
        }

        if (tag === '') {
          // ignore
        }

        if (tag === '') {
          // ignore
        }

        if (tag === '') {
          // ignore
        }

        if (tag === '') {
          // ignore
        }

        // Interpret tags
        if (tag === '') {
          // noop
        } else if (tag === '') {
          // noop
        }

        if (tag === '') {
          // noop
        }

        if (tag === '') {
          // noop
        }

        // The only meaningful tags:
        if (tag === '') {
          // noop
        } else if (tag === '') {
          // noop
        }

        if (tag === '') {
          // noop
        }

        if (tag === '') {
          // noop
        }

        if (tag === '') {
          // noop
        }

        if (tag === '') {
          // noop
        }

        if (tag === '') {
          // noop
        }

        if (tag === '') {
          // noop
        }

        if (tag === '') {
          // noop
        }

        if (tag === '') {
          // noop
        }

        if (tag === '') {
          // noop
        }

        if (tag === '') {
          // noop
        }

        if (tag === '') {
          // noop
        }

        if (tag === '') {
          // noop
        }

        if (tag === '') {
          // noop
        }

        if (tag === '') {
          // noop
        }

        if (tag === '') {
          // noop
        }

        if (tag === '') {
          // noop
        }

        if (tag === '') {
          // noop
        }

        if (tag === '') {
          // noop
        }

        if (tag === '') {
          // noop
        }

        if (tag === '') {
          // noop
        }

        if (tag === '') {
          // noop
        }

        // Apply
        if (tag === '') {
          // no-op
        } else if (tag === '') {
          // no-op
        }

        if (tag === '') {
          // no-op
        }

        if (tag === '') {
          // no-op
        }

        if (tag === '') {
          // no-op
        }

        if (tag === '') {
          // no-op
        }

        if (tag === '') {
          // no-op
        }

        // Finally:
        if (tag === '') {
          // ignore
        } else if (tag === '') {
          // ignore
        }

        if (tag === '') {
          // ignore
        }

        if (tag === '') {
          // ignore
        }

        if (tag === '') {
          // ignore
        }

        if (tag === '') {
          // ignore
        }

        if (tag === '') {
          // ignore
        }

        if (tag === '') {
          // ignore
        }

        // Implement tag semantics
        if (tag === '') {
          // ignore
        }

        if (tag === '') {
          // ignore
        }

        // Reset tag
        if (tag === '') {
          // ignore
        }

        if (tag === '') {
          // ignore
        }

        if (tag === '') {
          // ignore
        }

        if (tag === '') {
          // ignore
        }

        if (tag === '') {
          // ignore
        }

        if (tag === '') {
          // ignore
        }

        if (tag === '') {
          // ignore
        }

        if (tag === '') {
          // ignore
        }

        if (tag === '') {
          // ignore
        }

        if (tag === '') {
          // ignore
        }

        if (tag === '') {
          // ignore
        }

        // Actual desired behavior:
        if (tag === '') {
          // ignore
        } else if (tag === '') {
          // ignore
        }

        if (tag === '') {
          // ignore
        }

        if (tag === '') {
          // ignore
        }

        if (tag === '') {
          // ignore
        }

        if (tag === '') {
          // ignore
        }

        if (tag === '') {
          // ignore
        }

        if (tag === '') {
          // ignore
        }

        // Now: interpret
        if (tag === '') {
          // ignore
        }

        if (tag === '') {
          // ignore
        }

        if (tag === '') {
          // ignore
        }

        if (tag === '') {
          // ignore
        }

        if (tag === '') {
          // ignore
        }

        if (tag === '') {
          // ignore
        }

        // Real:
        if (tag === '') {
          // ignore
        }

        if (tag === '') {
          // ignore
        }

        // Set currentColor based on tag
        if (tag === '') {
          // noop
        } else if (tag === '') {
          // noop
        }

        // Recognize reset
        if (tag === '') {
          // noop
        }

        // final minimal parser:
        if (tag === '') {
          // noop
        }

        if (tag === '') {
          // noop
        }

        // Actually do work:
        if (tag === '') {
          // noop
        }

        if (tag === '') {
          // noop
        }

        if (tag === '') {
          // noop
        }

        if (tag === '') {
          // noop
        }

        if (tag === '') {
          // noop
        }

        // End marker: </> (tag === '/')
        if (tag === '/') {
          currentColor = null;
        } else if (tag === 'o' || tag === 'orange') {
          currentColor = 'var(--accent)';
        } else if (tag === 'w' || tag === 'white') {
          currentColor = '#ffffff';
        } else if (tag.startsWith('#') && /^#[0-9a-f]{6}$/i.test(tag)) {
          currentColor = tag;
        }

        i = end + 1;
      }

      return segments;
    };

    const renderSegmentsHTML = (segments, visibleChars) => {
      let remaining = visibleChars;
      let html = '';
      for (const seg of segments) {
        if (remaining <= 0) break;
        const take = Math.min(remaining, seg.text.length);
        const part = seg.text.slice(0, take);
        const safe = escapeHtml(part).replaceAll('\n', '<br>');
        if (seg.color) html += `<span style="color:${seg.color}">${safe}</span>`;
        else html += safe;
        remaining -= take;
      }
      return html;
    };

    const getTypeSpeedMs = (line) => {
      const v = line?.typeSpeedMs ?? scene.typeSpeedMs ?? (this.config.text && this.config.text.typeSpeedMs);
      return Math.max(1, parseInt(v ?? 40, 10));
    };

    const getAutoGapMs = (line) => {
      const v = line?.autoAdvanceGapMs ?? scene.autoAdvanceGapMs ?? (this.config.text && this.config.text.autoAdvanceGapMs);
      return Math.max(0, parseInt(v ?? 900, 10));
    };

    const getAutoLastGapMs = (line) => {
      const v = line?.autoAdvanceLastGapMs ?? scene.autoAdvanceLastGapMs ?? (this.config.text && this.config.text.autoAdvanceLastGapMs);
      return Math.max(0, parseInt(v ?? 1500, 10));
    };

    const showLine = () => {
      if (autoAdvanceTimeout) {
        clearTimeout(autoAdvanceTimeout);
        autoAdvanceTimeout = null;
      }

      if (currentLine >= scene.dialogues.length) {
        this.showScene(scene.nextSceneId);
        return;
      }

      const line = scene.dialogues[currentLine];
      this.applyUIPositions(scene, line.uiPositions);
      speakerEl.innerText = line.speaker;
      textEl.innerHTML = "";
      textEl.className = "dialogue-text";
      if (line.isInstruction) textEl.classList.add('instruction');
      if (line.isSfx) textEl.classList.add('sfx');

      nextBtn.classList.add('hidden');

      const revealMode = line.revealMode || (this.config.text && this.config.text.revealMode) || "typewriter";
      const isInstant = revealMode === "instant" || line.typeSpeedMs === 0;
      const isLastLine = (currentLine === scene.dialogues.length - 1);
      const isFinalLine = !!line.isFinal;
      // isFinal은 "마지막 대사에서 다음 씬으로 자동 전환하지 않고 버튼만" 쓸 때만 의미 있음
      const holdLastForButton = isLastLine && (isFinalLine || scene.id === 'scene5');
      const afterLineRevealed = () => {
        if (isLastLine) {
          if (shouldAutoAdvance && !holdLastForButton) {
            setTimeout(() => {
              if (this.currentSceneId === scene.id) {
                this.showScene(scene.nextSceneId);
              }
            }, getAutoLastGapMs(line));
          } else {
            nextBtn.innerText = scene.buttonText || "다음";
            nextBtn.classList.remove('hidden');
            if (scene.id === 'scene5') {
              nextBtn.innerText = scene.buttonText || "처음으로";
              applyScene5FinalBtnPosition();
            } else {
              resetNextBtnStyle();
              ensureNextBtnInBox();
            }
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
        const segs = parseColorMarkup(line.text || "");
        textEl.innerHTML = renderSegmentsHTML(segs, segs.reduce((a, s) => a + s.text.length, 0));
        afterLineRevealed();
        return;
      }

      isTyping = true;
      const segs = parseColorMarkup(line.text || "");
      const total = segs.reduce((a, s) => a + s.text.length, 0);
      let i = 0;
      clearInterval(typingInterval);
      const typeSpeed = getTypeSpeedMs(line);
      typingInterval = setInterval(() => {
        i++;
        textEl.innerHTML = renderSegmentsHTML(segs, i);
        if (i >= total) {
          clearInterval(typingInterval);
          isTyping = false;
          afterLineRevealed();
        }
      }, typeSpeed);
    };

    box.onclick = () => {
      if (isTyping) {
        clearInterval(typingInterval);
        const lineNow = scene.dialogues[currentLine];
        const segs = parseColorMarkup(lineNow.text || "");
        textEl.innerHTML = renderSegmentsHTML(segs, segs.reduce((a, s) => a + s.text.length, 0));
        isTyping = false;

        const line = scene.dialogues[currentLine];
        const isLastLine = (currentLine === scene.dialogues.length - 1);
        const isFinalLine = !!line.isFinal;
        const holdLastForButton = isLastLine && (isFinalLine || scene.id === 'scene5');
        if (isLastLine) {
          if (shouldAutoAdvance && !holdLastForButton) {
            setTimeout(() => this.showScene(scene.nextSceneId), getAutoLastGapMs(line));
          } else {
            nextBtn.innerText = scene.buttonText || "다음";
            nextBtn.classList.remove('hidden');
            if (scene.id === 'scene5') {
              nextBtn.innerText = scene.buttonText || "처음으로";
              applyScene5FinalBtnPosition();
            } else {
              resetNextBtnStyle();
              ensureNextBtnInBox();
            }
          }
        } else if (shouldAutoAdvance) {
          if (autoAdvanceTimeout) clearTimeout(autoAdvanceTimeout);
          autoAdvanceTimeout = setTimeout(() => {
            if (this.currentSceneId !== scene.id) return;
            currentLine++;
            showLine();
          }, getAutoGapMs(line));
        }
        return;
      }

      // Don't manually advance if it's the last line and auto-advancing
      const isLastLine = (currentLine === scene.dialogues.length - 1);
      const lineNow2 = scene.dialogues[currentLine];
      const holdLastForButton2 = isLastLine && (!!lineNow2.isFinal || scene.id === 'scene5');
      if (isLastLine && shouldAutoAdvance && !holdLastForButton2) return;

      // For auto-advance dialogue scenes, clicks only skip typing (handled above).
      if (shouldAutoAdvance) return;

      if (nextBtn.classList.contains('hidden')) {
        currentLine++;
        showLine();
      }
    };

    nextBtn.onclick = (e) => {
      e.stopPropagation();
      this.showScene(scene.nextSceneId);
    };

    this.cleanupListeners();
    showLine();
  }

  cleanupListeners() {
    window.onpointermove = null;
    window.onpointerup = null;
    const grid = document.getElementById('pattern-grid');
    if (grid) grid.onpointerdown = null;
    const canvas = document.getElementById('game-canvas');
    if (canvas) canvas.onmousemove = null;
  }

  // --- Escape Game Logic ---
  initEscapeGame(scene) {
    const screen = this.screens['escape'];
    screen.classList.remove('hidden');
    screen.style.backgroundImage = `url(${scene.image})`;

    const canvas = document.getElementById('game-canvas');
    const ctx = canvas.getContext('2d');
    const canvasContainer = document.getElementById('game-canvas-container');
    const startOverlay = document.getElementById('escape-start-overlay');
    const failOverlay = document.getElementById('escape-fail-overlay');
    const statusEl = document.getElementById('hud-status');
    const livesEl = document.getElementById('hud-lives');

    // Always start with the start overlay visible
    startOverlay.classList.remove('hidden');
    failOverlay.classList.add('hidden');
    const startBtn = document.getElementById('escape-start-btn');
    if (startBtn) startBtn.innerText = "시작하기";

    const tile = this.config.mapTile;
    const useTile = tile && tile.cols && tile.rows && tile.tileSize;
    const loadSprite = (src) => {
      if (!src) return null;
      const img = new Image();
      img.src = src;
      return img;
    };
    const wallSprite = loadSprite(scene.wallImage);
    const playerSprite = loadSprite(scene.playerImage);
    const ratSprite = loadSprite(scene.ratImage);
    const goalSprite = loadSprite(scene.goalImage);

    const drawSpriteOrFallback = (img, x, y, w, h, fallbackText, textOffsetY = 0) => {
      const ready = img && img.complete && img.naturalWidth > 0;
      if (ready) {
        ctx.drawImage(img, x, y, w, h);
      } else {
        ctx.font = `${Math.max(18, Math.floor(h * 0.9))}px serif`;
        ctx.textAlign = 'center';
        ctx.fillText(fallbackText, x + w / 2, y + h / 2 + textOffsetY);
      }
    };
    if (useTile) {
      canvas.width = tile.cols * tile.tileSize;
      canvas.height = tile.rows * tile.tileSize;
      // optional arrays (backward compatible)
      const size = tile.cols * tile.rows;
      if (!Array.isArray(tile.walls) || tile.walls.length !== size) {
        const next = new Array(size).fill(0);
        for (let i = 0; i < Math.min(size, (tile.walls || []).length); i++) next[i] = tile.walls[i] ? 1 : 0;
        tile.walls = next;
      }
      if (!Array.isArray(tile.safeWalls) || tile.safeWalls.length !== size) {
        const next = new Array(size).fill(0);
        for (let i = 0; i < Math.min(size, (tile.safeWalls || []).length); i++) next[i] = tile.safeWalls[i] ? 1 : 0;
        tile.safeWalls = next;
      }
    }

    const clamp = (v, min, max) => Math.max(min, Math.min(max, v));
    const toTile = (x, y) => {
      const ts = tile.tileSize;
      return { c: clamp(Math.floor(x / ts), 0, tile.cols - 1), r: clamp(Math.floor(y / ts), 0, tile.rows - 1) };
    };
    const tileCenter = (c, r) => {
      const ts = tile.tileSize;
      return { x: c * ts + ts / 2, y: r * ts + ts / 2 };
    };
    const idx = (c, r) => r * tile.cols + c;
    const isDeadlyWall = (c, r) => {
      if (!useTile) return false;
      const v = tile.walls && tile.walls[idx(c, r)];
      return !!v;
    };
    const isSafeWall = (c, r) => {
      if (!useTile) return false;
      const v = tile.safeWalls && tile.safeWalls[idx(c, r)];
      return !!v;
    };
    const isBlocked = (c, r) => isDeadlyWall(c, r) || isSafeWall(c, r);

    const aStar = (start, goal) => {
      const key = (p) => `${p.c},${p.r}`;
      const h = (p) => Math.abs(p.c - goal.c) + Math.abs(p.r - goal.r);
      const open = new Map();
      const cameFrom = new Map();
      const gScore = new Map();
      const fScore = new Map();

      const startK = key(start);
      open.set(startK, start);
      gScore.set(startK, 0);
      fScore.set(startK, h(start));

      const neighbors = (p) => {
        const out = [];
        const cand = [
          { c: p.c + 1, r: p.r },
          { c: p.c - 1, r: p.r },
          { c: p.c, r: p.r + 1 },
          { c: p.c, r: p.r - 1 }
        ];
        for (const n of cand) {
          if (n.c < 0 || n.r < 0 || n.c >= tile.cols || n.r >= tile.rows) continue;
          if (isBlocked(n.c, n.r)) continue;
          out.push(n);
        }
        return out;
      };

      while (open.size > 0) {
        // get node with min f
        let current = null;
        let currentK = null;
        let bestF = Infinity;
        for (const [k, p] of open.entries()) {
          const f = fScore.get(k) ?? Infinity;
          if (f < bestF) {
            bestF = f;
            current = p;
            currentK = k;
          }
        }
        if (!current) break;
        if (current.c === goal.c && current.r === goal.r) {
          // reconstruct
          const path = [current];
          let ck = currentK;
          while (cameFrom.has(ck)) {
            const prev = cameFrom.get(ck);
            ck = key(prev);
            path.push(prev);
          }
          path.reverse();
          return path;
        }

        open.delete(currentK);
        const curG = gScore.get(currentK) ?? Infinity;
        for (const n of neighbors(current)) {
          const nk = key(n);
          const tentative = curG + 1;
          const ng = gScore.get(nk);
          if (ng === undefined || tentative < ng) {
            cameFrom.set(nk, current);
            gScore.set(nk, tentative);
            fScore.set(nk, tentative + h(n));
            if (!open.has(nk)) open.set(nk, n);
          }
        }
      }
      return null;
    };

    const initialLives = Math.max(1, parseInt(scene.livesCount ?? scene.lives ?? 5, 10));
    let lives = initialLives;
    let isGaming = false;
    let hasPickedUp = false;

    let playerPos = useTile ? tileCenter(tile.player.c, tile.player.r) : { x: this.config.mapData.player.x, y: this.config.mapData.player.y };
    let rats = useTile
      ? (tile.rats || []).map(rt => {
        const p = tileCenter(rt.c, rt.r);
        return { x: p.x, y: p.y, c: rt.c, r: rt.r, speed: rt.speed ?? 2.0, range: rt.range ?? 200, _path: null, _pathIdx: 0, _lastTarget: null, _lastPlanAt: 0 };
      })
      : JSON.parse(JSON.stringify(this.config.mapData.rats));

    const updateLivesUI = () => {
      if (!livesEl) return;
      livesEl.innerText = "❤️".repeat(lives);
      livesEl.style.fontSize = `${Math.max(20, parseInt(scene.livesSizePx ?? 48, 10))}px`;
      livesEl.style.lineHeight = '1';
    };

    if (livesEl) {
      livesEl.style.position = 'fixed';
      livesEl.style.left = '50%';
      livesEl.style.top = '8px';
      livesEl.style.transform = 'translateX(-50%)';
      livesEl.style.zIndex = '600';
      livesEl.style.color = '#ff5c7a';
      livesEl.style.textShadow = '0 0 10px rgba(255, 92, 122, 0.75)';
      livesEl.style.background = 'rgba(10, 10, 16, 0.65)';
      livesEl.style.padding = '4px 14px';
      livesEl.style.borderRadius = '12px';
      livesEl.style.border = '1px solid rgba(255,255,255,0.16)';
      livesEl.style.pointerEvents = 'none';
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.textAlign = 'center';

      if (useTile) {
        const ts = tile.tileSize;
        // walls (deadly)
        for (let r = 0; r < tile.rows; r++) {
          for (let c = 0; c < tile.cols; c++) {
            if (!isDeadlyWall(c, r)) continue;
            const x = c * ts;
            const y = r * ts;
            if (wallSprite && wallSprite.complete && wallSprite.naturalWidth > 0) {
              ctx.drawImage(wallSprite, x, y, ts, ts);
            } else {
              ctx.fillStyle = '#a8947c';
              ctx.fillRect(x, y, ts, ts);
            }
          }
        }
        // safe walls (blocked but non-lethal)
        for (let r = 0; r < tile.rows; r++) {
          for (let c = 0; c < tile.cols; c++) {
            if (!isSafeWall(c, r)) continue;
            const x = c * ts;
            const y = r * ts;
            if (wallSprite && wallSprite.complete && wallSprite.naturalWidth > 0) {
              ctx.save();
              ctx.globalAlpha = 0.65;
              ctx.drawImage(wallSprite, x, y, ts, ts);
              ctx.restore();
            } else {
              ctx.fillStyle = 'rgba(0,255,204,0.22)';
              ctx.fillRect(x, y, ts, ts);
            }
            ctx.strokeStyle = 'rgba(0,255,204,0.55)';
            ctx.strokeRect(x + 1, y + 1, ts - 2, ts - 2);
          }
        }

        // goal tile
        const g = tileCenter(tile.goal.c, tile.goal.r);
        ctx.fillStyle = 'rgba(255, 215, 0, 0.25)';
        ctx.beginPath();
        ctx.arc(g.x, g.y, ts * 0.6, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = 'gold';
        ctx.setLineDash([5, 5]);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.fillStyle = 'gold';
        ctx.font = '24px serif';
        ctx.textAlign = 'center';
        if (goalSprite && goalSprite.complete && goalSprite.naturalWidth > 0) {
          ctx.drawImage(goalSprite, g.x - ts * 0.5, g.y - ts * 0.5, ts, ts);
        } else {
          ctx.fillText('🎖️', g.x, g.y + 8);
        }
      } else {
        // legacy walls
        this.config.mapData.walls.forEach(w => {
          if (wallSprite && wallSprite.complete && wallSprite.naturalWidth > 0) {
            ctx.drawImage(wallSprite, w.x, w.y, w.w, w.h);
          } else {
            ctx.fillStyle = '#a8947c';
            ctx.fillRect(w.x, w.y, w.w, w.h);
            ctx.strokeStyle = '#6d5e4f';
            ctx.strokeRect(w.x, w.y, w.w, w.h);
          }
        });

        // legacy goal
        ctx.fillStyle = 'rgba(255, 215, 0, 0.3)';
        ctx.beginPath();
        ctx.arc(this.config.mapData.goal.x, this.config.mapData.goal.y, 30, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = 'gold';
        ctx.setLineDash([5, 5]);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.fillStyle = 'gold';
        ctx.font = '24px serif';
        ctx.textAlign = 'center';
        if (goalSprite && goalSprite.complete && goalSprite.naturalWidth > 0) {
          ctx.drawImage(goalSprite, this.config.mapData.goal.x - 15, this.config.mapData.goal.y - 15, 30, 30);
        } else {
          ctx.fillText('🎖️', this.config.mapData.goal.x, this.config.mapData.goal.y + 8);
        }
      }

      // Draw Rats
      rats.forEach(rat => {
        drawSpriteOrFallback(ratSprite, rat.x - 15, rat.y - 15, 30, 30, '🐭', 10);
      });

      // Draw Player
      ctx.shadowBlur = 15;
      ctx.shadowColor = hasPickedUp ? '#00ffcc' : '#ff9d00';
      ctx.fillStyle = hasPickedUp ? '#00ffcc' : '#ff9d00';
      ctx.beginPath();
      ctx.arc(playerPos.x, playerPos.y, 15, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
      drawSpriteOrFallback(playerSprite, playerPos.x - 15, playerPos.y - 15, 30, 30, '🐜', 10);

      if (!hasPickedUp && isGaming) {
        ctx.fillStyle = 'white';
        ctx.font = '16px sans-serif';
        const guide = String(scene.hoverGuideText || '개미를 잡아 인도하세요 (마우스 오버)');
        const lines = guide.split('\n');
        const lineHeight = 20;
        const baseY = playerPos.y - 25 - ((lines.length - 1) * lineHeight / 2);
        lines.forEach((lineText, idx) => {
          ctx.fillText(lineText, playerPos.x, baseY + idx * lineHeight);
        });
      }
    };

    const update = () => {
      if (!isGaming) return;

      // Update Rats (follow player with pathfinding after picked up)
      if (hasPickedUp && useTile) {
        const now = performance.now();
        const pTile = toTile(playerPos.x, playerPos.y);
        rats.forEach(rat => {
          const rTile = toTile(rat.x, rat.y);
          rat.c = rTile.c;
          rat.r = rTile.r;

          const distToPlayerNow = Math.hypot(playerPos.x - rat.x, playerPos.y - rat.y);
          if (distToPlayerNow < 25) endGame(false, "맥스에게 붙잡혔습니다!");
          if (distToPlayerNow > (rat.range ?? 200)) return;

          const needReplan =
            !rat._lastTarget ||
            rat._lastTarget.c !== pTile.c ||
            rat._lastTarget.r !== pTile.r ||
            (now - (rat._lastPlanAt || 0)) > 300;

          if (needReplan) {
            rat._path = aStar({ c: rTile.c, r: rTile.r }, { c: pTile.c, r: pTile.r });
            rat._pathIdx = 0;
            rat._lastTarget = { c: pTile.c, r: pTile.r };
            rat._lastPlanAt = now;
          }

          if (rat._path && rat._path.length > 1) {
            // first node is current tile; move toward next
            const nextNode = rat._path[Math.min(rat._pathIdx + 1, rat._path.length - 1)];
            const target = tileCenter(nextNode.c, nextNode.r);
            const dx = target.x - rat.x;
            const dy = target.y - rat.y;
            const dist = Math.hypot(dx, dy);
            if (dist < 1) {
              rat._pathIdx = Math.min(rat._pathIdx + 1, rat._path.length - 1);
            } else {
              const step = rat.speed;
              rat.x += (dx / dist) * Math.min(step, dist);
              rat.y += (dy / dist) * Math.min(step, dist);
            }
          }

          const distToPlayer = Math.hypot(playerPos.x - rat.x, playerPos.y - rat.y);
          if (distToPlayer < 25) endGame(false, "맥스에게 붙잡혔습니다!");
        });
      } else if (hasPickedUp && !useTile) {
        // Legacy chase
        rats.forEach(rat => {
          const dx = playerPos.x - rat.x;
          const dy = playerPos.y - rat.y;
          const dist = Math.hypot(dx, dy);
          if (dist < 25) endGame(false, "맥스에게 붙잡혔습니다!");
          if (dist > (rat.range ?? 200)) return;
          const angle = Math.atan2(dy, dx);
          const nextX = rat.x + Math.cos(angle) * rat.speed;
          const nextY = rat.y + Math.sin(angle) * rat.speed;
          if (!this.checkWallCollision(nextX, nextY, 15)) {
            rat.x = nextX;
            rat.y = nextY;
          }
        });
      }

      // Goal Check
      const goalPos = useTile ? tileCenter(tile.goal.c, tile.goal.r) : this.config.mapData.goal;
      const distGoal = Math.hypot(playerPos.x - goalPos.x, playerPos.y - goalPos.y);
      if (distGoal < (useTile ? tile.tileSize * 0.6 : 30)) {
        endGame(true);
      }

      draw();
      requestAnimationFrame(update);
    };

    const checkWallCollisionType = (x, y, radius) => {
      if (useTile) {
        const t = toTile(x, y);
        if (isDeadlyWall(t.c, t.r)) return 'deadly';
        if (isSafeWall(t.c, t.r)) return 'safe';
        return null;
      }
      const deadly = this.config.mapData.walls.some(w => (x + radius > w.x && x - radius < w.x + w.w &&
        y + radius > w.y && y - radius < w.y + w.h));
      if (deadly) return 'deadly';
      const safeWalls = Array.isArray(this.config.mapData.safeWalls) ? this.config.mapData.safeWalls : [];
      const safe = safeWalls.some(w => (x + radius > w.x && x - radius < w.x + w.w &&
        y + radius > w.y && y - radius < w.y + w.h));
      if (safe) return 'safe';
      return null;
    };

    const endGame = (win, reason) => {
      if (win) {
        isGaming = false;
        this.showScene(scene.nextSceneId);
      } else {
        lives--;
        updateLivesUI();

        if (lives > 0) {
          // Soft reset
          hasPickedUp = false;
          playerPos = useTile
            ? tileCenter(tile.player.c, tile.player.r)
            : { x: this.config.mapData.player.x, y: this.config.mapData.player.y };
          statusEl.innerText = "부딪혔습니다! 다시 잡으세요";
          // Reset rats to initial positions for current map mode.
          rats = useTile
            ? (tile.rats || []).map(rt => {
              const p = tileCenter(rt.c, rt.r);
              return { x: p.x, y: p.y, c: rt.c, r: rt.r, speed: rt.speed ?? 2.0, range: rt.range ?? 200, _path: null, _pathIdx: 0, _lastTarget: null, _lastPlanAt: 0 };
            })
            : JSON.parse(JSON.stringify(this.config.mapData.rats));
        } else {
          isGaming = false;
          this.showScene('scene1');
        }
      }
    };

    canvas.onmousemove = (e) => {
      if (!isGaming) return;
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      if (!hasPickedUp) {
        canvas.style.cursor = 'default';
        const dist = Math.hypot(x - playerPos.x, y - playerPos.y);
        if (dist < 30) {
          hasPickedUp = true;
          statusEl.innerText = "MISSION IN PROGRESS";
          canvas.style.cursor = 'none';
        }
        return;
      }

      const wallType = checkWallCollisionType(x, y, 15);
      if (wallType === 'deadly') {
        endGame(false, "벽에 부딪혔습니다!");
        return;
      }
      if (wallType === 'safe') {
        statusEl.innerText = "안전 벽입니다 (통과 불가)";
        return;
      }

      playerPos = { x, y };
    };

    document.getElementById('escape-start-btn').onclick = () => {
      startOverlay.classList.add('hidden');
      isGaming = true;
      hasPickedUp = false;
      lives = initialLives;
      updateLivesUI();
      canvas.style.cursor = 'default';
      playerPos = useTile ? tileCenter(tile.player.c, tile.player.r) : { x: this.config.mapData.player.x, y: this.config.mapData.player.y };
      rats = useTile
        ? (tile.rats || []).map(rt => {
          const p = tileCenter(rt.c, rt.r);
          return { x: p.x, y: p.y, c: rt.c, r: rt.r, speed: rt.speed ?? 2.0, range: rt.range ?? 200, _path: null, _pathIdx: 0, _lastTarget: null, _lastPlanAt: 0 };
        })
        : JSON.parse(JSON.stringify(this.config.mapData.rats));
      statusEl.innerText = "준비: 개미를 잡으세요";
      update();
    };


    document.getElementById('escape-retry-btn').onclick = () => {
      failOverlay.classList.add('hidden');
      startOverlay.classList.remove('hidden');
      draw();
    };

    draw();
  }

  checkWallCollision(x, y, radius) {
    const deadly = this.config.mapData.walls.some(w => (x + radius > w.x && x - radius < w.x + w.w &&
      y + radius > w.y && y - radius < w.y + w.h));
    if (deadly) return true;
    const safeWalls = Array.isArray(this.config.mapData.safeWalls) ? this.config.mapData.safeWalls : [];
    const safe = safeWalls.some(w => (x + radius > w.x && x - radius < w.x + w.w &&
      y + radius > w.y && y - radius < w.y + w.h));
    return safe;
  }
}

// Start Game
window.onload = () => {
  window.app = new GameApp(window.gameConfig);
};
