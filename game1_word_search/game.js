document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  // game-config.js가 `window.wordGameConfig = {...}` 또는 `const wordGameConfig = {...}` 형태여도 동작하게 호환
  const cfg =
    (typeof window.wordGameConfig === 'object' && window.wordGameConfig)
      ? window.wordGameConfig
      : (typeof window.wordGameConfig === 'undefined' && typeof wordGameConfig === 'object' ? wordGameConfig : null);

  function failFast(message) {
    // 콘솔이 없어도 원인을 볼 수 있게 화면에 띄움
    // eslint-disable-next-line no-alert
    alert(message);
    throw new Error(message);
  }

  if (!cfg) {
    failFast('설정(wordGameConfig)을 불러오지 못했습니다. game-config.js가 같은 폴더에 있는지 확인하세요.');
  }

  const elGame = document.getElementById('screen-game');
  const elFail = document.getElementById('screen-fail');
  const elGameBg = document.getElementById('game-bg');
  const elPhaseText = document.getElementById('phase-text');
  const btnRetry = document.getElementById('btn-retry');
  const btnBack = document.getElementById('btn-back');
  const btnFailRetry = document.getElementById('btn-fail-retry');
  const btnFailBack = document.getElementById('btn-fail-back');
  const elOverlay = document.getElementById('overlay');
  const elOverlayTitle = document.getElementById('overlay-title');
  const elOverlaySub = document.getElementById('overlay-sub');

  const elArena = document.getElementById('arena');
  const elHearts = document.getElementById('hearts');
  const elAnswerPanel = document.getElementById('answer-panel');
  const elProgress = document.getElementById('progress');
  const elTime = document.getElementById('time');
  const toggleSfx = document.getElementById('toggle-sfx');
  const elCursorEmoji = document.getElementById('cursor-emoji');
  const elFailText1 = document.getElementById('fail-text1');
  const elFailText2 = document.getElementById('fail-text2');

  // Scenes (1~5)
  const elScene1 = document.getElementById('scene1');
  const elScene2 = document.getElementById('scene2');
  const elScene3 = document.getElementById('scene3');
  const elScene5 = document.getElementById('scene5');

  const elScene1Stage = document.getElementById('scene1-stage');
  const elScene1Zoom = document.getElementById('scene1-zoom');
  const elScene1L1 = document.getElementById('scene1-layer1');
  const elScene1L2 = document.getElementById('scene1-layer2');
  const elScene1L3 = document.getElementById('scene1-layer3');
  const elScene1L4 = document.getElementById('scene1-layer4');
  const elScene1Text1 = document.getElementById('scene1-text1');
  const elScene1Text2 = document.getElementById('scene1-text2');
  const elScene1Hearts = document.getElementById('scene1-hearts');
  const elScene1Quiz = document.getElementById('scene1-quizbox');
  const elScene1Prompt = document.getElementById('scene1-quizprompt');
  const elScene1JamoProgress = document.getElementById('scene1-jamo-progress');
  const elScene1JamoLeft = document.getElementById('scene1-jamo-left');
  const elScene1JamoRight = document.getElementById('scene1-jamo-right');
  const elScene1QuizErr = document.getElementById('scene1-quiz-err');

  const elScene2Bg = document.getElementById('scene2-bg');
  const elScene2Text = document.getElementById('scene2-text');

  const elScene3Bg = document.getElementById('scene3-bg');
  const elScene3Text = document.getElementById('scene3-text');
  const elScene3Start = document.getElementById('scene3-start');

  const elScene5Bg = document.getElementById('scene5-bg');
  const elScene5Text = document.getElementById('scene5-text');
  const elScene5StartOver = document.getElementById('scene5-startover');

  const elScene1Textbox1 = document.getElementById('scene1-textbox1');
  const elScene1Textbox2 = document.getElementById('scene1-textbox2');
  const elScene2Textbox = document.getElementById('scene2-textbox');
  const elScene3Textbox = document.getElementById('scene3-textbox');
  const elScene5Textbox = document.getElementById('scene5-textbox');

  const required = [
    ['screen-game', elGame],
    ['screen-fail', elFail],
    ['game-bg', elGameBg],
    ['phase-text', elPhaseText],
    ['btn-retry', btnRetry],
    ['btn-back', btnBack],
    ['btn-fail-retry', btnFailRetry],
    ['btn-fail-back', btnFailBack],
    ['overlay', elOverlay],
    ['overlay-title', elOverlayTitle],
    ['overlay-sub', elOverlaySub],
    ['arena', elArena],
    ['hearts', elHearts],
    ['answer-panel', elAnswerPanel],
    ['progress', elProgress],
    ['time', elTime],
    ['toggle-sfx', toggleSfx],
    ['cursor-emoji', elCursorEmoji],
    ['fail-text1', elFailText1],
    ['fail-text2', elFailText2],

    ['scene1', elScene1],
    ['scene2', elScene2],
    ['scene3', elScene3],
    ['scene5', elScene5],
    ['scene1-stage', elScene1Stage],
    ['scene1-zoom', elScene1Zoom],
    ['scene1-layer1', elScene1L1],
    ['scene1-layer2', elScene1L2],
    ['scene1-layer3', elScene1L3],
    ['scene1-layer4', elScene1L4],
    ['scene1-text1', elScene1Text1],
    ['scene1-text2', elScene1Text2],
    ['scene1-textbox1', elScene1Textbox1],
    ['scene1-textbox2', elScene1Textbox2],
    ['scene1-hearts', elScene1Hearts],
    ['scene1-quizbox', elScene1Quiz],
    ['scene1-quizprompt', elScene1Prompt],
    ['scene1-jamo-progress', elScene1JamoProgress],
    ['scene1-jamo-left', elScene1JamoLeft],
    ['scene1-jamo-right', elScene1JamoRight],
    ['scene1-quiz-err', elScene1QuizErr],
    ['scene2-bg', elScene2Bg],
    ['scene2-textbox', elScene2Textbox],
    ['scene2-text', elScene2Text],
    ['scene3-bg', elScene3Bg],
    ['scene3-textbox', elScene3Textbox],
    ['scene3-text', elScene3Text],
    ['scene3-start', elScene3Start],
    ['scene5-bg', elScene5Bg],
    ['scene5-textbox', elScene5Textbox],
    ['scene5-text', elScene5Text],
    ['scene5-startover', elScene5StartOver],
  ];
  const missing = required.filter(([, el]) => !el).map(([id]) => id);
  if (missing.length) {
    failFast(`필수 UI 요소를 찾지 못했습니다: ${missing.join(', ')}\nindex.html이 최신인지 확인하세요.`);
  }

  const SCENE1_BOARD_DEFAULT = Array.from('ㄱㅕㅇㅂㅣㅐㅁㅈㄷㅅㄴㅍㅊㅏㅜㅡㅔㅛㅗ←');
  const SCENE1_JAMO_DEFAULT = Array.from('ㄱㅕㅇㅂㅣㄱㅐㅁㅣ');

  function parseScene1QuizJamos(qs) {
    const q = qs || {};
    if (Array.isArray(q.quizJamos) && q.quizJamos.length) {
      const out = [];
      q.quizJamos.forEach((x) => {
        const s = String(x ?? '').trim();
        if (!s) return;
        Array.from(s).forEach((ch) => {
          if (ch.trim()) out.push(ch);
        });
      });
      if (out.length) return out;
    }
    if (typeof q.quizSequence === 'string' && q.quizSequence.trim()) {
      return Array.from(q.quizSequence.trim()).filter((ch) => ch.trim());
    }
    const ans = Array.isArray(q.answers) ? q.answers : [];
    if (ans.length >= 1) {
      const one = String(ans[0] || '').trim();
      if (one) return Array.from(one).filter((ch) => ch.trim());
    }
    return SCENE1_JAMO_DEFAULT.slice();
  }

  function parseScene1BoardJamos(qs) {
    const q = qs || {};
    if (Array.isArray(q.boardJamos) && q.boardJamos.length) {
      const out = [];
      q.boardJamos.forEach((x) => {
        const s = String(x ?? '').trim();
        if (!s) return;
        Array.from(s).forEach((ch) => {
          if (ch.trim()) out.push(ch);
        });
      });
      if (out.length) {
        const slots = out.slice(0, 20);
        for (let i = slots.length; i < 20; i += 1) {
          slots.push(SCENE1_BOARD_DEFAULT[i]);
        }
        return slots;
      }
    }
    if (typeof q.boardSequence === 'string' && q.boardSequence.trim()) {
      const out = [];
      const raw = q.boardSequence.trim();
      if (raw.includes(',')) {
        raw.split(',').forEach((part) => {
          const t = String(part).trim();
          if (!t) return;
          Array.from(t).forEach((ch) => { if (ch.trim()) out.push(ch); });
        });
      } else {
        Array.from(raw).forEach((ch) => { if (ch.trim()) out.push(ch); });
      }
      if (out.length) {
        const slots = out.slice(0, 20);
        for (let i = slots.length; i < 20; i += 1) {
          slots.push(SCENE1_BOARD_DEFAULT[i]);
        }
        return slots;
      }
    }
    return SCENE1_BOARD_DEFAULT.slice();
  }

  function buildPlacedAtFromAnswerAndBoard(answerSeq, slots20) {
    const occurrenceWanted = {};
    const lastSlot = {};
    const placedAt = [];
    for (let t = 0; t < answerSeq.length; t += 1) {
      const ch = answerSeq[t];
      occurrenceWanted[ch] = (occurrenceWanted[ch] || 0) + 1;
      const nth = occurrenceWanted[ch];
      let occ = 0;
      let slot = -1;
      for (let i = 0; i < slots20.length; i += 1) {
        if (slots20[i] === ch) {
          occ += 1;
          if (occ === nth) {
            slot = i;
            break;
          }
        }
      }
      if (slot < 0) {
        slot = lastSlot[ch];
        if (slot === undefined) slot = 0;
      }
      placedAt.push(slot);
      lastSlot[ch] = slot;
    }
    return placedAt;
  }

  function buildScene1JamoState(qs) {
    const ordered = parseScene1BoardJamos(qs);
    const slots = shuffle(ordered);
    const seqFull = parseScene1QuizJamos(qs);
    const len = Math.min(20, Math.max(1, seqFull.length));
    const seq = seqFull.slice(0, len);
    const placedAt = buildPlacedAtFromAnswerAndBoard(seq, slots);
    return { seq, slots, placedAt, len: seq.length };
  }

  function resetScene1QuizChrome() {
    elScene1.classList.remove('is-quiz-phase');
    elScene1Quiz.classList.remove('scene-quizbox--spread');
    elScene1Quiz.style.left = '';
    elScene1Quiz.style.top = '';
    elScene1Quiz.style.transform = '';
    elScene1Quiz.style.width = '';
    elScene1Quiz.style.padding = '';
    elScene1Quiz.style.borderRadius = '';
  }

  function applyScene1QuizSpreadLayout() {
    elScene1.classList.add('is-quiz-phase');
    elScene1Quiz.classList.add('scene-quizbox--spread');
    elScene1Quiz.style.left = '';
    elScene1Quiz.style.top = '';
    elScene1Quiz.style.transform = '';
    elScene1Quiz.style.width = '';
    elScene1Quiz.style.padding = '';
    elScene1Quiz.style.borderRadius = '';
  }

  function renderScene1JamoColumns(st) {
    if (!elScene1JamoLeft || !elScene1JamoRight) return;
    elScene1JamoLeft.innerHTML = '';
    elScene1JamoRight.innerHTML = '';
    for (let r = 0; r < 10; r += 1) {
      const btnL = document.createElement('button');
      btnL.type = 'button';
      btnL.className = 'scene-jamo-tile';
      btnL.dataset.slot = String(r);
      btnL.textContent = st.slots[r];
      btnL.setAttribute('aria-label', `왼쪽 ${r + 1}번 ${st.slots[r]}`);
      elScene1JamoLeft.appendChild(btnL);
    }
    for (let r = 0; r < 10; r += 1) {
      const btnR = document.createElement('button');
      btnR.type = 'button';
      btnR.className = 'scene-jamo-tile';
      btnR.dataset.slot = String(10 + r);
      btnR.textContent = st.slots[10 + r];
      btnR.setAttribute('aria-label', `오른쪽 ${r + 1}번 ${st.slots[10 + r]}`);
      elScene1JamoRight.appendChild(btnR);
    }
  }

  function renderScene1JamoProgressBar() {
    if (!elScene1JamoProgress) return;
    if (!scene1 || !scene1.jamoState) return;
    const st = scene1.jamoState;
    const picks = scene1.jamoPicks || [];
    elScene1JamoProgress.innerHTML = '';
    for (let i = 0; i < st.len; i += 1) {
      const div = document.createElement('div');
      div.className = 'scene-jamo-slot';
      if (i < picks.length) {
        div.classList.add('filled');
        div.textContent = st.slots[picks[i]];
      } else if (i === picks.length) {
        div.classList.add('next');
        div.textContent = '·';
      } else {
        div.textContent = '·';
      }
      elScene1JamoProgress.appendChild(div);
    }
  }

  function scene1JamoPicksMatchPlacedAt(picks, placedAt) {
    if (!picks || !placedAt || picks.length !== placedAt.length) return false;
    for (let i = 0; i < picks.length; i += 1) {
      if (picks[i] !== placedAt[i]) return false;
    }
    return true;
  }

  elScene1Quiz.addEventListener('pointerdown', (e) => {
    if (sceneId !== 'scene1' || !scene1 || scene1.phase !== 2 || scene1.ended || !scene1.jamoState) return;
    const btn = e.target && e.target.closest && e.target.closest('.scene-jamo-tile');
    if (!btn) return;
    const slot = parseInt(btn.dataset.slot, 10);
    if (!Number.isFinite(slot)) return;
    const st = scene1.jamoState;
    const qs = (scenesCfg.scene1 && scenesCfg.scene1.quizBox) || {};
    const lose = Math.max(1, Number(qs.wrongConsumesHeart ?? 1));

    if (!scene1.jamoPicks) scene1.jamoPicks = [];

    if (st.slots[slot] === '←') {
      if (scene1.jamoPicks.length > 0) {
        scene1.jamoPicks.pop();
        renderScene1JamoProgressBar();
      }
      ensureAudio();
      beep('beep2');
      return;
    }

    if (scene1.jamoPicks.length >= st.len) return;

    scene1.jamoPicks.push(slot);
    renderScene1JamoProgressBar();

    if (scene1.jamoPicks.length < st.len) return;

    if (scene1JamoPicksMatchPlacedAt(scene1.jamoPicks, st.placedAt)) {
      if (elScene1QuizErr) elScene1QuizErr.classList.add('hidden');
      ensureAudio();
      beep('ok');
      btn.classList.remove('is-ok');
      void btn.offsetWidth;
      btn.classList.add('is-ok');
      setTimeout(() => btn.classList.remove('is-ok'), 220);
      scene1.ended = true;
      elScene1Textbox1.style.display = 'none';
      elScene1Textbox2.style.display = 'none';
      elScene1Quiz.style.display = 'none';
      resetScene1QuizChrome();
      scene1.jamoState = null;
      scene1.jamoPicks = [];
      startScene1ExitAnim();
      return;
    }

    scene1.jamoPicks = [];
    renderScene1JamoProgressBar();
    if (elScene1QuizErr) elScene1QuizErr.classList.remove('hidden');
    btn.classList.remove('is-wrong');
    void btn.offsetWidth;
    btn.classList.add('is-wrong');
    setTimeout(() => btn.classList.remove('is-wrong'), 320);
    ensureAudio();
    beep('beep1');
  }, { passive: true });

  let state = null;
  let rafId = 0; // timer
  let audioCtx = null;
  let animId = 0;
  let lastTs = 0;
  let timerEndAt = 0;
  let scene2Timer = 0;
  let typeTimer = 0;
  let typeToken = 0;
  let maskTimers = [];

  function stopMaskTimers() {
    maskTimers.forEach((t) => clearTimeout(t));
    maskTimers = [];
    // 남아있는 마스크 클래스 제거
    if (state && Array.isArray(state.bubbles)) {
      state.bubbles.forEach((b) => b.el && b.el.classList.remove('is-masked'));
    }
  }

  function normEmoji(v) {
    const s = String(v ?? '').trim();
    return s || '🔍';
  }

  function encodeAssetPath(path) {
    const p = String(path || '').trim();
    if (!p) return '';
    return p.split('/').map(encodeURIComponent).join('/');
  }

  function setCursorEmojiVisible(visible) {
    if (!elCursorEmoji) return;
    elCursorEmoji.classList.toggle('hidden', !visible);
    document.body.classList.toggle('is-emoji-cursor', !!visible);
  }

  function setCursorEmojiText(emoji) {
    if (!elCursorEmoji) return;
    elCursorEmoji.textContent = normEmoji(emoji ?? cfg.ingame?.cursorEmoji ?? '🔍');
  }

  function updateCursorEmojiPosition(e) {
    if (!elCursorEmoji || elCursorEmoji.classList.contains('hidden')) return;
    // fixed 포지션이므로 viewport 기준으로 바로 배치
    elCursorEmoji.style.left = `${e.clientX}px`;
    elCursorEmoji.style.top = `${e.clientY}px`;
  }

  window.addEventListener('pointermove', updateCursorEmojiPosition, { passive: true });

  // 런 전체에서 공유되는 하트(화면1~5 + 게임)
  const run = {
    maxHearts: 0,
    hearts: 0,
  };

  // BGM (씬별)
  const bgm = new Audio();
  bgm.loop = true;
  bgm.preload = 'auto';
  bgm.volume = Math.max(0, Math.min(1, Number(cfg.audio?.bgmVolume ?? 0.7)));
  let bgmUnlocked = false;
  let lastSceneBgmKey = 'scene1';
  let bgmRawPath = '';

  function unlockBgm() {
    if (bgmUnlocked) return;
    bgmUnlocked = true;
    // 모바일(iOS/안드로이드)에서 "첫 제스처 안에서 src 설정 + play"가 함께 일어나야
    // 성공률이 높은 케이스가 있어 현재 씬 BGM을 여기서 강제로 트리거한다.
    playSceneBgm(lastSceneBgmKey || 'scene1');
    if (bgm.src) bgm.play().catch(() => {});
  }

  function nowMs() {
    return performance.now();
  }

  function resetRun() {
    run.maxHearts = Math.max(1, Number(cfg.gameplay?.hearts ?? 5));
    run.hearts = run.maxHearts;
  }

  function consumeHearts(n) {
    const lose = Math.max(1, Number(n || 1));
    run.hearts = Math.max(0, run.hearts - lose);
    return run.hearts;
  }

  function normalizePath(p) {
    return String(p || '').trim();
  }

  function applyBackground(el, path) {
    const p = normalizePath(path);
    if (!p) {
      el.style.backgroundImage = '';
      return;
    }
    el.style.backgroundImage = `url('${p.split('/').map(encodeURIComponent).join('/')}')`;
  }

  function applyAbsStyle(el, style, { useCenterTransform = true, setWidthPx = false } = {}) {
    if (!el) return;
    const s = style || {};
    if (typeof s.x === 'number') el.style.left = `${s.x}%`;
    if (typeof s.y === 'number') {
      el.style.top = `${s.y}%`;
      // 기본 CSS에 bottom이 있을 수 있어서(텍스트 박스) top을 쓰는 경우엔 bottom을 반드시 해제
      el.style.bottom = '';
    }
    if (useCenterTransform) el.style.transform = 'translate(-50%, -50%)';
    if (setWidthPx && typeof s.w === 'number') el.style.width = `${Math.max(1, s.w)}px`;
    if (typeof s.fontSize === 'number') el.style.fontSize = `${Math.max(8, s.fontSize)}px`;
    if (s.align) el.style.textAlign = String(s.align);
    if (s.color) el.style.color = String(s.color);
  }

  function setBoxEnabled(boxEl, enabled) {
    if (!boxEl) return;
    boxEl.classList.toggle('is-box-off', enabled === false);
  }

  function applyBoxStyle(boxEl, textEl, boxStyle) {
    if (!boxEl || !textEl) return;
    const bs = boxStyle || {};

    // width/height: 화면 기준 % (부모가 screen이므로 %로 충분)
    if (typeof bs.wPct === 'number' && Number.isFinite(bs.wPct) && bs.wPct > 0) {
      const w = Math.min(100, Math.max(1, bs.wPct));
      boxEl.style.width = `${w}%`;
    } else {
      boxEl.style.width = '';
    }

    if (typeof bs.hPct === 'number' && Number.isFinite(bs.hPct) && bs.hPct > 0) {
      const h = Math.min(100, Math.max(1, bs.hPct));
      boxEl.style.height = `${h}%`;
    } else {
      boxEl.style.height = '';
    }

    // padding
    if (typeof bs.padY === 'number' && Number.isFinite(bs.padY) && bs.padY >= 0) {
      const py = Math.min(60, Math.max(0, bs.padY));
      const px = (typeof bs.padX === 'number' && Number.isFinite(bs.padX) && bs.padX >= 0)
        ? Math.min(80, Math.max(0, bs.padX))
        : 18;
      boxEl.style.padding = `${py}px ${px}px`;
    } else {
      boxEl.style.padding = '';
    }

    // radius
    if (typeof bs.radius === 'number' && Number.isFinite(bs.radius) && bs.radius >= 0) {
      boxEl.style.borderRadius = `${Math.min(80, Math.max(0, bs.radius))}px`;
    } else {
      boxEl.style.borderRadius = '';
    }

    // inner min-height (vh%)
    if (typeof bs.minHeightPct === 'number' && Number.isFinite(bs.minHeightPct) && bs.minHeightPct >= 0) {
      const mh = Math.min(100, Math.max(0, bs.minHeightPct));
      textEl.style.minHeight = `${mh}vh`;
    } else {
      textEl.style.minHeight = '';
    }
  }

  function applyTextbox(boxEl, textEl, textCfg) {
    if (!boxEl || !textEl) return;
    setBoxEnabled(boxEl, textCfg?.boxEnabled !== false);
    textEl.textContent = String(textCfg?.text ?? '');
    applyAbsStyle(boxEl, textCfg?.style, { useCenterTransform: true });
    applyBoxStyle(boxEl, textEl, textCfg?.boxStyle);
    const s = textCfg?.style || {};
    if (typeof s.fontSize === 'number') textEl.style.fontSize = `${Math.max(8, s.fontSize)}px`;
    if (s.align) textEl.style.textAlign = String(s.align);
    if (s.color) textEl.style.color = String(s.color);
  }

  function applyIngameLayout() {
    applyAbsStyle(elPhaseText, cfg.ingame.phaseTextStyle, { useCenterTransform: true });

    const ps = cfg.ingame.progressStyle || {};
    elAnswerPanel.style.left = `${Number(ps.x ?? 50)}%`;
    elAnswerPanel.style.top = `${Number(ps.y ?? 86)}%`;
    elAnswerPanel.style.bottom = '';
    elAnswerPanel.style.transform = 'translate(-50%, -50%)';
    elProgress.style.fontSize = `${Math.max(8, Number(ps.fontSize ?? 22))}px`;
    elProgress.style.textAlign = String(ps.align || 'center');
  }

  function applyFailureLayout() {
    elFailText1.textContent = String(cfg.failureScreen?.text1?.text ?? '');
    elFailText2.textContent = String(cfg.failureScreen?.text2?.text ?? '');
    applyAbsStyle(elFailText1, cfg.failureScreen?.text1?.style, { useCenterTransform: true });
    applyAbsStyle(elFailText2, cfg.failureScreen?.text2?.style, { useCenterTransform: true });
  }

  // ------------------------
  // SceneManager (screen1~5)
  // ------------------------
  const scenesCfg = (cfg && typeof cfg.scenes === 'object') ? cfg.scenes : {};
  let sceneId = 'scene1';
  let scene1 = null;
  let scene2 = null;
  let scene3 = null;
  let scene5 = null;

  function hideAllScreens() {
    [elScene1, elScene2, elScene3, elScene5, elGame, elFail].forEach((el) => el.classList.add('hidden'));
    hideOverlay();
    setCursorEmojiVisible(false);
  }

  function setVisible(el) {
    hideAllScreens();
    el.classList.remove('hidden');
  }

  function normAnswer(s) {
    return String(s || '').replace(/\s+/g, '').trim();
  }

  function stopScene2Timer() {
    if (scene2Timer) clearTimeout(scene2Timer);
    scene2Timer = 0;
  }

  function stopTyping() {
    if (typeTimer) clearTimeout(typeTimer);
    typeTimer = 0;
    typeToken += 1; // invalidate
  }

  function splitLinesToTexts(v) {
    return String(v || '')
      .split('\n')
      .map((s) => s.replace(/\r/g, '').trim())
      .filter(Boolean);
  }

  function getTypeSpeedMs(sceneCfg) {
    const ms = Number(sceneCfg?.typeSpeedMs ?? cfg.text?.typeSpeedMs ?? 45);
    return Math.max(0, Math.min(200, ms));
  }

  function typewrite(el, fullText, speedMs, done) {
    stopTyping();
    const token = typeToken;
    const text = String(fullText ?? '');
    if (!el) return;
    if (speedMs <= 0 || text.length === 0) {
      el.textContent = text;
      if (done) done();
      return;
    }
    let i = 0;
    el.textContent = '';
    const step = () => {
      if (token !== typeToken) return;
      i += 1;
      el.textContent = text.slice(0, i);
      if (i >= text.length) {
        typeTimer = 0;
        if (done) done();
        return;
      }
      typeTimer = setTimeout(step, speedMs);
    };
    typeTimer = setTimeout(step, speedMs);
  }

  function playSceneBgm(sceneKey) {
    lastSceneBgmKey = String(sceneKey || '').trim() || lastSceneBgmKey || 'scene1';
    const p = normalizePath(scenesCfg?.[sceneKey]?.bgm);
    if (!p) {
      bgm.pause();
      bgm.src = '';
      bgmRawPath = '';
      return;
    }
    if (bgmRawPath && bgmRawPath === p) {
      if (bgmUnlocked) bgm.play().catch(() => {});
      return;
    }
    bgm.pause();
    bgm.currentTime = 0;
    bgmRawPath = p;
    bgm.src = encodeAssetPath(p);
    bgm.load();
    if (bgmUnlocked) bgm.play().catch(() => {});
  }

  function renderScene1Hearts() {
    const c = scenesCfg.scene1;
    const hearts = run.hearts;
    const max = run.maxHearts;
    const size = Number(c?.hearts?.style?.size ?? 18);
    const gap = Number(c?.hearts?.style?.gap ?? 8);
    elScene1Hearts.innerHTML = '';
    elScene1Hearts.style.gap = `${Math.max(0, gap)}px`;
    if (c?.hearts?.style) {
      elScene1Hearts.style.left = `${Number(c.hearts.style.x ?? 50)}%`;
      elScene1Hearts.style.top = `${Number(c.hearts.style.y ?? 34)}%`;
      elScene1Hearts.style.transform = 'translate(-50%, -50%)';
      elScene1Hearts.style.justifyContent = (c.hearts.style.align === 'left') ? 'flex-start' : (c.hearts.style.align === 'right' ? 'flex-end' : 'center');
    }
    for (let i = 0; i < max; i += 1) {
      const h = document.createElement('span');
      h.className = 'scene-heart' + (i < hearts ? '' : ' is-empty');
      h.textContent = '♥';
      h.style.fontSize = `${Math.max(8, Number(size) || 18)}px`;
      elScene1Hearts.appendChild(h);
    }
  }

  function applySceneText(el, textCfg) {
    // legacy helper (scene 텍스트가 직접 absolute 배치되던 시절)
    // 지금은 textbox+inner 구조를 주로 사용함.
    el.textContent = String(textCfg?.text ?? '');
    applyAbsStyle(el, textCfg?.style, { useCenterTransform: true });
  }

  function enterScene1() {
    sceneId = 'scene1';
    stopScene2Timer();
    stopTyping();
    playSceneBgm('scene1');
    const c = scenesCfg.scene1 || {};
    resetScene1QuizChrome();
    setVisible(elScene1);
    setCursorEmojiText(c.cursorEmoji ?? '🐜');
    setCursorEmojiVisible(true);

    // layers
    const layers = Array.isArray(c.layers) ? c.layers : [];
    elScene1L1.src = normalizePath(layers[0]);
    elScene1L2.src = normalizePath(layers[1]);
    elScene1L3.src = normalizePath(layers[2]);
    elScene1L4.src = normalizePath(layers[3]);

    // reset transforms
    elScene1Zoom.style.transform = 'scale(1)';
    elScene1Stage.classList.remove('scene-fadeout');
    elScene1L2.style.transform = 'translateX(0)';
    elScene1L3.style.transform = 'translateX(0)';

    // 화면1 텍스트는 (박스 + 텍스트)로 구성
    applyTextbox(elScene1Textbox1, elScene1Text1, c.text1);
    applyTextbox(elScene1Textbox2, elScene1Text2, c.text2);

    // initial visibility
    elScene1Textbox1.style.display = 'none';
    elScene1Textbox2.style.display = 'none';
    elScene1Hearts.style.display = 'none';
    elScene1Quiz.style.display = 'none';

    // Image Effects
    const stage = elScene1Stage;
    stage.classList.remove('img-fade-in', 'img-shake');
    stage.style.setProperty('--imgFadeInMs', `${c.imgFadeInMs ?? 1000}ms`);
    void stage.offsetWidth; // reflow
    if (c.imgFadeInMs !== 0) stage.classList.add('img-fade-in');
    if (c.imgShake) stage.classList.add('img-shake');

    setTimeout(() => {
      if (sceneId !== 'scene1') return;
      elScene1Textbox1.style.display = '';
    }, c.imgFadeInMs ?? 1000);

    const qs = c.quizBox || {};
    elScene1Prompt.textContent = String(qs.prompt || '');
    if (elScene1QuizErr) elScene1QuizErr.classList.add('hidden');

    scene1 = { knocks: 0, phase: 1, ended: false, jamoState: null, jamoPicks: [] };

    const need = Math.max(1, Number(c.knockRequired ?? 3));
    const onAnyInput = (e) => {
      if (sceneId !== 'scene1' || !scene1 || scene1.ended) return;
      if (scene1.phase !== 1) return;
      if (e && e.target && e.target.closest && e.target.closest('.scene-jamo-tile')) return;
      ensureAudio();
      beep('beep2');
      scene1.knocks += 1;
      if (scene1.knocks >= need) {
        scene1.phase = 2;
        elScene1Textbox1.style.display = 'none';
        elScene1Textbox2.style.display = '';
        elScene1Quiz.style.display = '';
        applyScene1QuizSpreadLayout();
        scene1.jamoState = buildScene1JamoState(qs);
        scene1.jamoPicks = [];
        renderScene1JamoColumns(scene1.jamoState);
        renderScene1JamoProgressBar();
        if (elScene1QuizErr) elScene1QuizErr.classList.add('hidden');
      }
    };
    window.removeEventListener('keydown', onAnyInput);
    window.removeEventListener('pointerdown', onAnyInput);
    window.addEventListener('keydown', onAnyInput);
    window.addEventListener('pointerdown', onAnyInput, { passive: true });
  }

  function startScene1ExitAnim() {
    const c = scenesCfg.scene1 || {};
    const mv = c.layerMove || {};
    const zf = c.zoomFade || {};
    const moveMs = Math.max(0, Number(mv.moveDurationMs ?? 700));
    const zoomMs = Math.max(0, Number(zf.zoomMs ?? 1000));
    const fadeMs = Math.max(0, Number(zf.fadeMs ?? 350));
    const to = Math.max(1, Number(zf.zoomTo ?? 2));

    // layer move
    elScene1L2.style.transition = `transform ${moveMs}ms ease`;
    elScene1L3.style.transition = `transform ${moveMs}ms ease`;
    elScene1L2.style.transform = `translateX(${Number(mv.layer2MoveXvw ?? -18)}vw)`;
    elScene1L3.style.transform = `translateX(${Number(mv.layer3MoveXvw ?? 18)}vw)`;

    // zoom after move
    setTimeout(() => {
      elScene1Zoom.style.transition = `transform ${zoomMs}ms ease`;
      elScene1Zoom.style.transform = `scale(${to})`;

      // fade out near end
      setTimeout(() => {
        elScene1Stage.style.setProperty('--sceneFadeMs', `${fadeMs}ms`);
        elScene1Stage.classList.add('scene-fadeout');
        setTimeout(() => {
          const next = c.nextSceneId || 'scene2';
          gotoScene(next);
        }, fadeMs + 30);
      }, Math.max(0, zoomMs - 80));
    }, moveMs);
  }

  function enterScene2() {
    sceneId = 'scene2';
    stopScene2Timer();
    stopTyping();
    playSceneBgm('scene2');
    const c = scenesCfg.scene2 || {};
    setVisible(elScene2);
    applyBackground(elScene2Bg, c.image);
    elScene2Text.textContent = '';
    elScene2Textbox.style.display = 'none';

    // Image Effects
    elScene2Bg.classList.remove('img-fade-in', 'img-shake');
    elScene2Bg.style.setProperty('--imgFadeInMs', `${c.imgFadeInMs ?? 500}ms`);
    void elScene2Bg.offsetWidth;
    if (c.imgFadeInMs !== 0) elScene2Bg.classList.add('img-fade-in');
    if (c.imgShake) elScene2Bg.classList.add('img-shake');

    scene2 = {
      idx: 0,
      subtitles: Array.isArray(c.subtitles) ? c.subtitles : [],
    };
    const playAt = (idx) => {
      if (sceneId !== 'scene2') return;
      if (idx >= scene2.subtitles.length) {
        gotoScene(c.nextSceneId || 'scene3');
        return;
      }
      elScene2Textbox.style.display = '';
      const sub = scene2.subtitles[idx];
      applyAbsStyle(elScene2Textbox, sub, { useCenterTransform: true });
      setBoxEnabled(elScene2Textbox, sub?.boxEnabled !== false);
      applyBoxStyle(elScene2Textbox, elScene2Text, sub?.boxStyle);
      if (typeof sub?.fontSize === 'number') elScene2Text.style.fontSize = `${Math.max(8, sub.fontSize)}px`;
      if (sub?.align) elScene2Text.style.textAlign = String(sub.align);
      if (sub?.color) elScene2Text.style.color = String(sub.color);
      const speedMs = Math.max(0, Math.min(200, Number(sub.typeSpeedMs ?? c.typeSpeedMs ?? cfg.text?.typeSpeedMs ?? 45)));
      const delayMs = Math.max(0, Number(sub.delayMs ?? sub.pauseMs ?? 1800));

      typewrite(elScene2Text, sub.text, speedMs, () => {
        scene2Timer = setTimeout(() => playAt(idx + 1), delayMs);
      });
    };
    setTimeout(() => playAt(0), c.imgFadeInMs ?? 500);
  }

  function enterScene3() {
    sceneId = 'scene3';
    stopScene2Timer();
    stopTyping();
    playSceneBgm('scene3');
    const c = scenesCfg.scene3 || {};
    setVisible(elScene3);
    applyBackground(elScene3Bg, c.image);
    elScene3Text.textContent = '';
    elScene3Textbox.style.display = 'none';
    elScene3Start.style.display = 'none';

    // Image Effects
    elScene3Bg.classList.remove('img-fade-in', 'img-shake');
    elScene3Bg.style.setProperty('--imgFadeInMs', `${c.imgFadeInMs ?? 500}ms`);
    void elScene3Bg.offsetWidth;
    if (c.imgFadeInMs !== 0) elScene3Bg.classList.add('img-fade-in');
    if (c.imgShake) elScene3Bg.classList.add('img-shake');

    scene3 = {
      idx: 0,
      subtitles: Array.isArray(c.subtitles) ? c.subtitles : [],
    };
    
    const playAt = (idx) => {
      if (sceneId !== 'scene3') return;
      if (idx >= scene3.subtitles.length) {
        elScene3Start.style.display = '';
        return;
      }
      elScene3Textbox.style.display = '';
      const sub = scene3.subtitles[idx];
      applyAbsStyle(elScene3Textbox, sub, { useCenterTransform: true });
      setBoxEnabled(elScene3Textbox, sub?.boxEnabled !== false);
      applyBoxStyle(elScene3Textbox, elScene3Text, sub?.boxStyle);
      if (typeof sub?.fontSize === 'number') elScene3Text.style.fontSize = `${Math.max(8, sub.fontSize)}px`;
      if (sub?.align) elScene3Text.style.textAlign = String(sub.align);
      if (sub?.color) elScene3Text.style.color = String(sub.color);
      const speedMs = Math.max(0, Math.min(200, Number(sub.typeSpeedMs ?? c.typeSpeedMs ?? cfg.text?.typeSpeedMs ?? 45)));
      const delayMs = Math.max(0, Number(sub.delayMs ?? sub.pauseMs ?? 1800));

      typewrite(elScene3Text, sub.text, speedMs, () => {
        scene2Timer = setTimeout(() => playAt(idx + 1), delayMs);
      });
    };
    setTimeout(() => playAt(0), c.imgFadeInMs ?? 500);

    // button layout
    elScene3Start.textContent = String(c.startButton?.text || '시작');
    const bs = c.startButton?.style || {};
    elScene3Start.style.position = 'absolute';
    elScene3Start.style.animation = 'none';
    elScene3Start.style.left = `${Number(bs.x ?? 50)}%`;
    elScene3Start.style.top = `${Number(bs.y ?? 82)}%`;
    elScene3Start.style.transform = 'translate(-50%, -50%)';
    elScene3Start.style.fontSize = `${Math.max(8, Number(bs.fontSize ?? 22))}px`;
    elScene3Start.style.padding = `${Math.max(0, Number(bs.paddingY ?? 18))}px ${Math.max(0, Number(bs.paddingX ?? 52))}px`;
    elScene3Start.onclick = () => gotoScene(c.nextSceneId || 'scene4');
  }

  function enterScene5() {
    sceneId = 'scene5';
    stopScene2Timer();
    stopTyping();
    playSceneBgm('scene5');
    const c = scenesCfg.scene5 || {};
    setVisible(elScene5);
    applyBackground(elScene5Bg, c.image);
    elScene5Text.textContent = '';
    elScene5Textbox.style.display = 'none';

    // Image Effects
    elScene5Bg.classList.remove('img-fade-in', 'img-shake');
    elScene5Bg.style.setProperty('--imgFadeInMs', `${c.imgFadeInMs ?? 500}ms`);
    void elScene5Bg.offsetWidth;
    if (c.imgFadeInMs !== 0) elScene5Bg.classList.add('img-fade-in');
    if (c.imgShake) elScene5Bg.classList.add('img-shake');
    
    scene5 = { idx: 0, subtitles: Array.isArray(c.subtitles) ? c.subtitles : [] };

    elScene5StartOver.textContent = String(c.startOverButton?.text || '처음부터');
    const bs = c.startOverButton?.style || {};
    elScene5StartOver.style.position = 'absolute';
    elScene5StartOver.style.animation = 'none';
    elScene5StartOver.style.left = `${Number(bs.x ?? 50)}%`;
    elScene5StartOver.style.top = `${Number(bs.y ?? 86)}%`;
    elScene5StartOver.style.transform = 'translate(-50%, -50%)';
    elScene5StartOver.style.fontSize = `${Math.max(8, Number(bs.fontSize ?? 22))}px`;
    elScene5StartOver.style.padding = `${Math.max(0, Number(bs.paddingY ?? 18))}px ${Math.max(0, Number(bs.paddingX ?? 52))}px`;
    elScene5StartOver.style.display = 'none';

    elScene5StartOver.onclick = () => {
      resetRun();
      gotoScene(c.nextSceneId || 'scene1');
    };

    const playAt = (idx) => {
      if (sceneId !== 'scene5') return;
      if (idx >= scene5.subtitles.length) {
        setTimeout(() => {
          elScene5StartOver.style.display = '';
          elScene5StartOver.style.opacity = '0';
          elScene5StartOver.style.transition = 'opacity 0.5s ease';
          setTimeout(() => elScene5StartOver.style.opacity = '1', 50);
        }, 500);
        return;
      }
      elScene5Textbox.style.display = '';
      const sub = scene5.subtitles[idx];
      applyAbsStyle(elScene5Textbox, sub, { useCenterTransform: true });
      setBoxEnabled(elScene5Textbox, sub?.boxEnabled !== false);
      applyBoxStyle(elScene5Textbox, elScene5Text, sub?.boxStyle);
      if (typeof sub?.fontSize === 'number') elScene5Text.style.fontSize = `${Math.max(8, sub.fontSize)}px`;
      if (sub?.align) elScene5Text.style.textAlign = String(sub.align);
      if (sub?.color) elScene5Text.style.color = String(sub.color);
      const speedMs = Math.max(0, Math.min(200, Number(sub.typeSpeedMs ?? c.typeSpeedMs ?? cfg.text?.typeSpeedMs ?? 45)));
      const delayMs = Math.max(0, Number(sub.delayMs ?? sub.pauseMs ?? 1800));

      typewrite(elScene5Text, sub.text, speedMs, () => {
        scene2Timer = setTimeout(() => playAt(idx + 1), delayMs);
      });
    };
    setTimeout(() => playAt(0), c.imgFadeInMs ?? 500);
  }

  function enterScene4Game() {
    // 기존 showGame()이 인게임 초기화 포함이므로 그대로 사용
    sceneId = 'scene4';
    elFail.classList.add('hidden');
    elScene1.classList.add('hidden');
    elScene2.classList.add('hidden');
    elScene3.classList.add('hidden');
    elScene5.classList.add('hidden');
    elGame.classList.remove('hidden');
    stopScene2Timer();
    setCursorEmojiText(cfg.ingame?.cursorEmoji ?? '🔍');
    setCursorEmojiVisible(true);
    playSceneBgm('scene4');
    resetGame();
  }

  function gotoScene(next) {
    const id = String(next || '').trim();
    if (id === 'scene1') return enterScene1();
    if (id === 'scene2') return enterScene2();
    if (id === 'scene3') return enterScene3();
    if (id === 'scene4') return enterScene4Game();
    if (id === 'scene5') return enterScene5();
    if (id === 'fail') return showFailScreen();
    // fallback
    return enterScene1();
  }

  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function formatTime(ms) {
    return `${(ms / 1000).toFixed(1)}s`;
  }

  function getBestKey() {
    return 'antfestival_game1_best_ms';
  }

  function loadBest() {
    const v = Number(localStorage.getItem(getBestKey()));
    return Number.isFinite(v) && v > 0 ? v : null;
  }

  function saveBest(ms) {
    localStorage.setItem(getBestKey(), String(ms));
  }

  function renderBest() {
    // UI에 best 패널이 없을 수 있으므로, 저장만 유지
    // (필요하면 overlay에 함께 표시)
    return loadBest();
  }

  function buildDeck(targetLetters) {
    const target = (Array.isArray(targetLetters) ? targetLetters : String(targetLetters || cfg.gameplay.targetWord || 'ALEX').toUpperCase().split(''));
    const count = Math.max(target.length, Number(cfg.gameplay.bubbleCount) || 14);
    const extrasCount = Math.max(0, count - target.length);
    const extras = shuffle(ALPHABET.filter((c) => !target.includes(c))).slice(0, extrasCount);
    const deck = shuffle([...target, ...extras]);
    return deck;
  }

  function showOverlay(title, sub) {
    elOverlayTitle.textContent = title || '';
    elOverlaySub.textContent = sub || '';
    elOverlay.classList.remove('hidden');
  }

  function getScene4Overlay(phaseIndex, isLast) {
    const list = scenesCfg.scene4?.phaseClearOverlays;
    if (Array.isArray(list) && list[phaseIndex]) return list[phaseIndex];
    if (isLast) return { title: '성공!', subtitle: '모든 Phase 완료' };
    return { title: '다음 Phase!', subtitle: `Phase ${Math.max(1, phaseIndex + 1)} 완료` };
  }

  function hideOverlay() {
    elOverlay.classList.add('hidden');
  }

  function ensureAudio() {
    if (!toggleSfx.checked) return null;
    if (!audioCtx) {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      if (!Ctx) return null;
      audioCtx = new Ctx();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume().catch(() => {});
    }
    return audioCtx;
  }

  function beep(type) {
    const ctx = ensureAudio();
    if (!ctx) return;

    const t0 = ctx.currentTime;
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.connect(g);
    g.connect(ctx.destination);

    const cfg = type === 'ok'
      ? { f1: 660, f2: 880, dur: 0.08 }
      : type === 'win'
        ? { f1: 523, f2: 1046, dur: 0.18 }
        : type === 'beep1' // 하트 감소
          ? { f1: 260, f2: 130, dur: 0.14 }
          : type === 'beep2' // 문 두드림
            ? { f1: 740, f2: 520, dur: 0.06 }
            : { f1: 220, f2: 140, dur: 0.12 };

    o.type = 'sine';
    o.frequency.setValueAtTime(cfg.f1, t0);
    o.frequency.exponentialRampToValueAtTime(cfg.f2, t0 + cfg.dur);
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(0.18, t0 + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + cfg.dur);

    o.start(t0);
    o.stop(t0 + cfg.dur + 0.02);
  }

  function vibrate(pattern) {
    if (navigator.vibrate) navigator.vibrate(pattern);
  }

  function renderProgress() {
    const out = state.target.map((c, i) => (i < state.progress ? c : '-')).join(' ');
    elProgress.textContent = out;
  }

  function renderHearts() {
    const max = state.maxHearts;
    const left = state.hearts;
    elHearts.innerHTML = '';
    const wrap = document.createElement('div');
    wrap.className = 'hearts';
    for (let i = 0; i < max; i += 1) {
      const h = document.createElement('span');
      h.className = 'heart' + (i < left ? '' : ' is-empty');
      h.textContent = '♥';
      wrap.appendChild(h);
    }
    elHearts.appendChild(wrap);
  }

  function renderStats() {
    renderProgress();
    renderHearts();
  }

  function setTimeText(ms) {
    // UI 표시는 남은 시간
    elTime.textContent = (ms / 1000).toFixed(1);
  }

  function tick() {
    rafId = requestAnimationFrame(tick);
    if (!state || state.endedAt) return;
    if (!state.startedAt) return;

    const left = Math.max(0, timerEndAt - nowMs());
    setTimeText(left);
    if (left <= 0) {
      failByTime();
    }
  }

  function stopTick() {
    if (rafId) cancelAnimationFrame(rafId);
    rafId = 0;
  }

  function stopAnim() {
    if (animId) cancelAnimationFrame(animId);
    animId = 0;
  }

  function getArenaRect() {
    const r = elArena.getBoundingClientRect();
    return { w: Math.max(1, r.width), h: Math.max(1, r.height) };
  }

  function randomUnitVector() {
    const a = Math.random() * Math.PI * 2;
    return { x: Math.cos(a), y: Math.sin(a) };
  }

  function clamp(v, lo, hi) {
    return Math.min(hi, Math.max(lo, v));
  }

  function spawnBubbles() {
    elArena.innerHTML = '';
    const { w, h } = getArenaRect();

    const baseSize = Number(cfg.gameplay.bubbleSize) || 74;
    const bubbleSize = window.matchMedia('(max-width: 540px)').matches ? Math.max(56, baseSize - 6) : baseSize;
    const r = bubbleSize / 2;
    const baseSpeed = Number(cfg.gameplay.bubbleSpeed) || 185;
    const speed = window.matchMedia('(max-width: 540px)').matches ? Math.max(120, baseSpeed - 20) : baseSpeed; // px/s
    const bubbleImage = normalizePath(cfg.ingame.bubbleImage);

    state.bubbles = state.deck.map((letter, idx) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'bubble';
      btn.textContent = letter;
      btn.dataset.letter = letter;
      btn.dataset.idx = String(idx);
      btn.setAttribute('aria-label', `글자 ${letter}`);
      btn.addEventListener('pointerdown', onBubblePress, { passive: true });
      if (bubbleImage) {
        btn.style.backgroundImage = `url('${bubbleImage.split('/').map(encodeURIComponent).join('/')}')`;
        btn.style.backgroundSize = 'cover';
        btn.style.backgroundPosition = 'center';
      }
      elArena.appendChild(btn);

      const v = randomUnitVector();
      const x = r + Math.random() * (w - r * 2);
      const y = r + Math.random() * (h - r * 2);
      return {
        idx,
        letter,
        el: btn,
        found: false,
        size: bubbleSize,
        r,
        x,
        y,
        vx: v.x * speed,
        vy: v.y * speed,
      };
    });

    // 스폰 직후에도 겹칠 수 있어서 한 번 분리(이후 프레임에서도 계속 해소됨)
    resolveBubbleCollisions();
  }

  function applyBubbleMaskForCurrentPhase() {
    stopMaskTimers();
    if (!state) return;
    const phase = state.phases[state.phaseIndex] || {};
    const mask = phase.bubbleMask;
    if (!mask || mask.enabled === false) return;

    const delayMs = Math.max(0, Number(mask.delayMs ?? 0));
    const fadeInMs = Math.max(0, Number(mask.fadeInMs ?? 650));
    const holdMs = Math.max(0, Number(mask.holdMs ?? 900));
    const fadeOutMs = Math.max(0, Number(mask.fadeOutMs ?? 650));
    const repeatEnabled = !!(mask.repeatEnabled ?? false);
    const repeatIntervalMs = Math.max(0, Number(mask.repeatIntervalMs ?? 0));
    const repeatCount = Math.max(0, Number(mask.repeatCount ?? 0)); // 0 = infinite

    // CSS transition에 페이드 시간 반영(개별 버블에 변수로 넣기)
    const setFadeMs = (ms) => {
      state.bubbles.forEach((b) => {
        if (b && b.el) b.el.style.setProperty('--maskFadeMs', `${Math.max(0, ms)}ms`);
      });
    };

    const cycleMs = fadeInMs + holdMs + fadeOutMs;
    const runOnce = () => {
      if (!state) return;

      // fade-in 시작
      setFadeMs(fadeInMs);
      state.bubbles.forEach((b) => { if (b && b.el && !b.found) b.el.classList.add('is-masked'); });

      // fade-out 시작(클래스 제거)
      maskTimers.push(setTimeout(() => {
        if (!state) return;
        setFadeMs(fadeOutMs);
        state.bubbles.forEach((b) => { if (b && b.el) b.el.classList.remove('is-masked'); });
      }, fadeInMs + holdMs));
    };

    const scheduleNext = (doneCount) => {
      if (!repeatEnabled) return;
      if (repeatCount > 0 && doneCount >= repeatCount) return;
      const nextDelay = Math.max(0, repeatIntervalMs);
      maskTimers.push(setTimeout(() => {
        if (!state) return;
        runOnce();
        scheduleNext(doneCount + 1);
      }, nextDelay));
    };

    // 최초 1회 실행
    maskTimers.push(setTimeout(() => {
      runOnce();
      // 반복은 "한 사이클이 끝난 후" interval 만큼 대기하고 다음 실행
      const firstDoneAt = cycleMs;
      maskTimers.push(setTimeout(() => scheduleNext(1), firstDoneAt + Math.max(0, repeatIntervalMs)));
    }, delayMs));
  }

  function layoutBubbles() {
    state.bubbles.forEach((b) => {
      b.el.style.transform = `translate(${b.x - b.r}px, ${b.y - b.r}px)`;
    });
  }

  function stepBubbles(dt) {
    const { w, h } = getArenaRect();

    for (const b of state.bubbles) {
      if (b.found) continue;
      b.x += b.vx * dt;
      b.y += b.vy * dt;

      if (b.x <= b.r) {
        b.x = b.r;
        b.vx = Math.abs(b.vx);
      } else if (b.x >= w - b.r) {
        b.x = w - b.r;
        b.vx = -Math.abs(b.vx);
      }

      if (b.y <= b.r) {
        b.y = b.r;
        b.vy = Math.abs(b.vy);
      } else if (b.y >= h - b.r) {
        b.y = h - b.r;
        b.vy = -Math.abs(b.vy);
      }
    }

    resolveBubbleCollisions();
  }

  function resolveBubbleCollisions() {
    const bubbles = state.bubbles.filter((b) => !b.found);
    if (bubbles.length < 2) return;

    const iterations = 6;
    for (let it = 0; it < iterations; it += 1) {
      let adjusted = false;

      for (let i = 0; i < bubbles.length; i += 1) {
        for (let j = i + 1; j < bubbles.length; j += 1) {
          const a = bubbles[i];
          const b = bubbles[j];

          const dx = b.x - a.x;
          const dy = b.y - a.y;
          const dist = Math.hypot(dx, dy);
          const minDist = a.r + b.r;
          if (dist <= 0.0001 || dist >= minDist) continue;

          // 겹침 해소(위치 분리)
          const overlap = minDist - dist;
          const nx = dx / dist;
          const ny = dy / dist;
          const totalR = a.r + b.r;
          const moveA = (b.r / totalR) * overlap;
          const moveB = (a.r / totalR) * overlap;

          a.x -= nx * moveA;
          a.y -= ny * moveA;
          b.x += nx * moveB;
          b.y += ny * moveB;

          // 탄성 충돌(질량 동일 가정): v1, v2 교환 성분 + 반발
          const rvx = b.vx - a.vx;
          const rvy = b.vy - a.vy;
          const vn = rvx * nx + rvy * ny;
          if (vn < 0) {
            const e = 0.92; // 반발(1에 가까울수록 탄성)
            const impulse = -(1 + e) * vn / 2; // 동일 질량

            a.vx -= impulse * nx;
            a.vy -= impulse * ny;
            b.vx += impulse * nx;
            b.vy += impulse * ny;
          }

          adjusted = true;
        }
      }

      if (!adjusted) break;
    }

    // 벽 밖으로 밀려난 경우(충돌 해소 과정에서) 다시 클램프
    const { w, h } = getArenaRect();
    for (const b of bubbles) {
      b.x = clamp(b.x, b.r, w - b.r);
      b.y = clamp(b.y, b.r, h - b.r);
    }
  }

  function animate(ts) {
    animId = requestAnimationFrame(animate);
    if (!state || state.endedAt) return;
    if (!lastTs) lastTs = ts;
    const dt = clamp((ts - lastTs) / 1000, 0, 0.05);
    lastTs = ts;
    stepBubbles(dt);
    layoutBubbles();
  }

  function getPhases() {
    if (Array.isArray(cfg.phases) && cfg.phases.length) return cfg.phases;
    return [{
      id: 'phase1',
      text: '',
      answer: String(cfg.gameplay.targetWord || 'ALEX').toUpperCase(),
      progressSeed: '',
    }];
  }

  function normalizeSeed(seed, len) {
    const s = String(seed || '').toUpperCase().replace(/\s+/g, '');
    if (!len) return '';
    if (!s) return ''.padEnd(len, '-');
    if (s.length >= len) return s.slice(0, len);
    return s.padEnd(len, '-');
  }

  function seedPrefixLen(seed, targetLetters) {
    const seedArr = String(seed || '').split('');
    const t = Array.isArray(targetLetters) ? targetLetters : [];
    let n = 0;
    for (let i = 0; i < t.length; i += 1) {
      const ch = seedArr[i] || '-';
      if (ch === '-' || ch === '_') break;
      if (ch !== t[i]) break;
      n += 1;
    }
    return n;
  }

  function applyPhaseText() {
    if (!state) return;
    const p = state.phases[state.phaseIndex] || state.phases[0] || {};
    elPhaseText.textContent = String(p.text || '');
  }

  function resetGame() {
    stopTick();
    stopAnim();
    stopMaskTimers();
    lastTs = 0;

    const hearts = run.hearts;
    const phases = getPhases();
    const phase0 = phases[0] || {};
    const target = String(phase0.answer || cfg.gameplay.targetWord || 'ALEX').toUpperCase().split('');
    const seed = normalizeSeed(phase0.progressSeed, target.length);
    const initialProgress = seedPrefixLen(seed, target);

    state = {
      phases,
      phaseIndex: 0,
      target,
      progress: initialProgress,
      initialProgress,
      hearts,
      maxHearts: run.maxHearts,
      startedAt: 0,
      endedAt: 0,
      locked: false,
      deck: buildDeck(target),
      bubbles: [],
    };

    spawnBubbles();
    layoutBubbles();
    applyBubbleMaskForCurrentPhase();

    const limitMs = (Math.max(1, Number(cfg.gameplay.timeLimitSeconds) || 30) * 1000);
    setTimeText(limitMs);
    renderStats();
    hideOverlay();
    applyIngameLayout();
    applyPhaseText();

    // 타이머는 화면4 진입 시 즉시 시작(블록 클릭 없이도 차감)
    state.startedAt = nowMs();
    state.endedAt = 0;
    timerEndAt = state.startedAt + limitMs;
    tick();
    animate(0);
  }

  function lockBoard() {
    state.locked = true;
    state.bubbles.forEach((b) => b.el.classList.add('is-found'));
  }

  function markBubble(btn, kind) {
    btn.classList.remove('is-correct', 'is-wrong');
    btn.classList.add(kind === 'ok' ? 'is-correct' : 'is-wrong');
    setTimeout(() => btn.classList.remove('is-correct', 'is-wrong'), 220);
  }

  function endGame() {
    state.endedAt = nowMs();
    const elapsed = state.endedAt - state.startedAt;

    const isLast = state.phaseIndex >= state.phases.length - 1;
    if (!isLast) {
      beep('ok');
      vibrate([20, 30, 20]);
      const o = getScene4Overlay(state.phaseIndex, false);
      showOverlay(String(o?.title ?? ''), String(o?.subtitle ?? ''));
      btnRetry.textContent = '다음';
      lockBoard();
      return;
    }

    const best = loadBest();
    if (!best || elapsed < best) saveBest(elapsed);
    const nextBest = renderBest();

    beep('win');
    vibrate([30, 40, 30]);
    const bestLine = nextBest ? `\n최고: ${formatTime(nextBest)}` : '';
    const o = getScene4Overlay(state.phaseIndex, true);
    const subtitle = String(o?.subtitle ?? `기록: ${formatTime(elapsed)}${bestLine}`);
    const subWithBest = subtitle.includes('{best}')
      ? subtitle.replaceAll('{best}', nextBest ? formatTime(nextBest) : '')
      : subtitle;
    const subWithTime = subWithBest.includes('{time}')
      ? subWithBest.replaceAll('{time}', formatTime(elapsed))
      : subWithBest || `기록: ${formatTime(elapsed)}${bestLine}`;
    showOverlay(String(o?.title ?? '성공!'), subWithTime);
    btnRetry.textContent = '다시 하기';

    lockBoard();

    // scene4 성공 → scene5
    if (sceneId === 'scene4') {
      const next = scenesCfg.scene4?.successNextSceneId || 'scene5';
      setTimeout(() => gotoScene(next), 280);
    }
  }

  function gotoNextPhase() {
    const nextIdx = state.phaseIndex + 1;
    if (nextIdx >= state.phases.length) {
      gotoScene('scene5');
      return;
    }

    stopTick();
    stopAnim();
    stopMaskTimers();
    lastTs = 0;

    state.phaseIndex = nextIdx;
    const phase = state.phases[state.phaseIndex] || {};
    state.target = String(phase.answer || 'ALEX').toUpperCase().split('');
    const seed = normalizeSeed(phase.progressSeed, state.target.length);
    state.initialProgress = seedPrefixLen(seed, state.target);
    state.progress = state.initialProgress;
    state.locked = false;
    state.deck = buildDeck(state.target);
    state.bubbles = [];
    state.endedAt = 0;
    const limitMs = (Math.max(1, Number(cfg.gameplay.timeLimitSeconds) || 30) * 1000);
    state.startedAt = nowMs();
    timerEndAt = state.startedAt + limitMs;

    spawnBubbles();
    layoutBubbles();
    applyBubbleMaskForCurrentPhase();
    setTimeText(limitMs);
    renderStats();
    hideOverlay();
    applyPhaseText();
    btnRetry.textContent = '다시 하기';

    tick();
    animate(0);
  }

  function startTimerIfNeeded() {}

  function resetProgressOnly() {
    state.progress = state.initialProgress || 0;
    state.bubbles.forEach((b) => {
      b.found = false;
      b.el.classList.remove('is-found');
    });
    renderStats();
  }

  function loseHeartAndRestartProgress() {
    const lose = Math.max(1, Number(cfg.gameplay.wrongConsumesHeart) || 1);
    const prevHearts = run.hearts;
    consumeHearts(lose);
    state.hearts = run.hearts;
    
    // 시각적 피드백: 줄어드는 하트에 애니메이션 적용
    const heartEls = elHearts.querySelectorAll('.heart:not(.is-empty)');
    for (let i = 0; i < lose; i++) {
      const target = heartEls[heartEls.length - 1 - i];
      if (target) {
        target.classList.add('is-flashing');
      }
    }

    beep('beep1');
    vibrate(30);

    setTimeout(() => {
      renderHearts();
      if (run.hearts <= 0) {
        failByHearts();
        return;
      }
      if (cfg.gameplay.resetProgressOnWrong !== false) {
        resetProgressOnly();
      }
    }, 450);
  }

  function onBubblePress(e) {
    if (state.locked) return;
    const btn = e.currentTarget;
    if (!(btn instanceof HTMLElement)) return;
    if (btn.classList.contains('is-found')) return;

    ensureAudio(); // 모바일에서 최초 터치로 오디오 unlock

    const letter = btn.dataset.letter || '';
    const expected = state.target[state.progress];

    if (letter === expected) {
      beep('ok');
      markBubble(btn, 'ok');
      btn.classList.add('is-found');
      const bubble = state.bubbles.find((b) => b.el === btn);
      if (bubble) bubble.found = true;

      state.progress += 1;
      renderStats();

      if (state.progress >= state.target.length) {
        endGame();
        return;
      }
      return;
    }

    // 오답: 하트 1 감소 + 진행 리셋
    beep('beep1');
    vibrate(25);
    markBubble(btn, 'bad');
    loseHeartAndRestartProgress();
  }

  function failByTime() {
    if (!state || state.endedAt) return;
    state.endedAt = nowMs();
    beep('beep1');
    vibrate([30, 40, 30]);
    showFailScreen();
  }

  function failByHearts() {
    if (!state || state.endedAt) return;
    state.endedAt = nowMs();
    showFailScreen();
  }

  function showGame() {
    elGame.classList.remove('hidden');
    elFail.classList.add('hidden');
    elScene1.classList.add('hidden');
    elScene2.classList.add('hidden');
    elScene3.classList.add('hidden');
    elScene5.classList.add('hidden');
    resetGame();
  }

  function showFailScreen() {
    lockBoard();
    hideOverlay();
    elGame.classList.add('hidden');
    elFail.classList.remove('hidden');

    // scene4 실패 → fail 화면 유지(버튼으로 scene1)
  }

  btnRetry.addEventListener('click', () => {
    if (!state) { showGame(); return; }
    const isLast = state.phaseIndex >= state.phases.length - 1;
    if (state.endedAt && !isLast && btnRetry.textContent === '다음') {
      gotoNextPhase();
      return;
    }
    showGame();
  });
  btnBack.addEventListener('click', () => { resetRun(); gotoScene('scene1'); });
  btnFailRetry.addEventListener('click', () => { resetRun(); gotoScene('scene4'); });
  btnFailBack.addEventListener('click', () => { resetRun(); gotoScene('scene1'); });

  // 최초 렌더
  resetRun();
  renderBest();
  applyBackground(elGameBg, cfg.ingame.backgroundImage);
  applyIngameLayout();
  applyFailureLayout();

  // 최초 진입은 화면1(로비 제거)
  gotoScene('scene1');

  // BGM은 브라우저 정책 때문에 최초 사용자 입력 이후 재생 가능
  // (일부 기기) pointerdown이 누락되는 케이스 대비 touchstart도 함께 바인딩
  window.addEventListener('pointerdown', unlockBgm, { once: true, passive: true });
  window.addEventListener('touchstart', unlockBgm, { once: true, passive: true });
  window.addEventListener('keydown', unlockBgm, { once: true });
});

