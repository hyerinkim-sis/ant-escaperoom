document.addEventListener('DOMContentLoaded', () => {
  const LS_KEY = 'antfestival_game1_editor_config';

  const $ = (id) => document.getElementById(id);

  const fields = {
    cursorEmoji: $('cursorEmoji'),
    bgmVolume: $('bgmVolume'),
    s4Bgm: $('s4Bgm'),
    s4BgmFile: $('s4BgmFile'),
    s4Ov1Title: $('s4Ov1Title'),
    s4Ov1Sub: $('s4Ov1Sub'),
    s4Ov2Title: $('s4Ov2Title'),
    s4Ov2Sub: $('s4Ov2Sub'),
    s4Ov3Title: $('s4Ov3Title'),
    s4Ov3Sub: $('s4Ov3Sub'),
    gameBg: $('gameBg'),
    gameBgFile: $('gameBgFile'),
    bubbleImg: $('bubbleImg'),
    bubbleImgFile: $('bubbleImgFile'),
    phaseTextX: $('phaseTextX'),
    phaseTextY: $('phaseTextY'),
    phaseTextFont: $('phaseTextFont'),
    phaseTextColor: $('phaseTextColor'),
    phaseTextAlign: $('phaseTextAlign'),
    progressX: $('progressX'),
    progressY: $('progressY'),
    progressFont: $('progressFont'),
    progressColor: $('progressColor'),
    progressAlign: $('progressAlign'),
    p1Text: $('p1Text'),
    p1Answer: $('p1Answer'),
    p1Seed: $('p1Seed'),
    p2Text: $('p2Text'),
    p2Answer: $('p2Answer'),
    p2Seed: $('p2Seed'),
    p2MaskEnabled: $('p2MaskEnabled'),
    p2MaskDelay: $('p2MaskDelay'),
    p2MaskIn: $('p2MaskIn'),
    p2MaskHold: $('p2MaskHold'),
    p2MaskOut: $('p2MaskOut'),
    p2MaskRepeat: $('p2MaskRepeat'),
    p2MaskInterval: $('p2MaskInterval'),
    p2MaskCount: $('p2MaskCount'),
    p3Text: $('p3Text'),
    p3Answer: $('p3Answer'),
    p3Seed: $('p3Seed'),
    p3MaskEnabled: $('p3MaskEnabled'),
    p3MaskDelay: $('p3MaskDelay'),
    p3MaskIn: $('p3MaskIn'),
    p3MaskHold: $('p3MaskHold'),
    p3MaskOut: $('p3MaskOut'),
    p3MaskRepeat: $('p3MaskRepeat'),
    p3MaskInterval: $('p3MaskInterval'),
    p3MaskCount: $('p3MaskCount'),
    fail1Text: $('fail1Text'),
    fail1AddLine: $('fail1AddLine'),
    fail1DelLine: $('fail1DelLine'),
    fail1X: $('fail1X'),
    fail1Y: $('fail1Y'),
    fail1Font: $('fail1Font'),
    fail1Color: $('fail1Color'),
    fail1Align: $('fail1Align'),
    fail2Text: $('fail2Text'),
    fail2AddLine: $('fail2AddLine'),
    fail2DelLine: $('fail2DelLine'),
    fail2X: $('fail2X'),
    fail2Y: $('fail2Y'),
    fail2Font: $('fail2Font'),
    fail2Color: $('fail2Color'),
    fail2Align: $('fail2Align'),
    targetWord: $('targetWord'),
    timeLimit: $('timeLimit'),
    hearts: $('hearts'),
    bubbleCount: $('bubbleCount'),
    bubbleSpeed: $('bubbleSpeed'),
    bubbleSize: $('bubbleSize'),
    wrongHearts: $('wrongHearts'),
    resetOnWrong: $('resetOnWrong'),
    out: $('out'),

    // scenes
    s1Bgm: $('s1Bgm'),
    s1BgmFile: $('s1BgmFile'),
    s1Layer1: $('s1Layer1'),
    s1Layer1File: $('s1Layer1File'),
    s1Layer2: $('s1Layer2'),
    s1Layer2File: $('s1Layer2File'),
    s1Layer3: $('s1Layer3'),
    s1Layer3File: $('s1Layer3File'),
    s1Layer4: $('s1Layer4'),
    s1Layer4File: $('s1Layer4File'),
    
    // s1 animation fields
    s1L2Move: $('s1L2Move'),
    s1L3Move: $('s1L3Move'),
    s1MoveDur: $('s1MoveDur'),
    s1ZoomTo: $('s1ZoomTo'),
    s1ZoomDur: $('s1ZoomDur'),
    s1FadeDur: $('s1FadeDur'),
    s1ImgFadeIn: $('s1ImgFadeIn'),
    s1ImgShake: $('s1ImgShake'),

    s1Text1: $('s1Text1'),
    s1Text1BoxEnabled: $('s1Text1BoxEnabled'),
    s1Text1BoxW: $('s1Text1BoxW'),
    s1Text1BoxH: $('s1Text1BoxH'),
    s1Text1PadY: $('s1Text1PadY'),
    s1Text1PadX: $('s1Text1PadX'),
    s1Text1Radius: $('s1Text1Radius'),
    s1Text1MinH: $('s1Text1MinH'),
    s1Text1AddLine: $('s1Text1AddLine'),
    s1Text1DelLine: $('s1Text1DelLine'),
    s1Text1X: $('s1Text1X'),
    s1Text1Y: $('s1Text1Y'),
    s1Text1Font: $('s1Text1Font'),
    s1Text1Color: $('s1Text1Color'),
    s1Text1Align: $('s1Text1Align'),
    s1Text2: $('s1Text2'),
    s1Text2BoxEnabled: $('s1Text2BoxEnabled'),
    s1Text2BoxW: $('s1Text2BoxW'),
    s1Text2BoxH: $('s1Text2BoxH'),
    s1Text2PadY: $('s1Text2PadY'),
    s1Text2PadX: $('s1Text2PadX'),
    s1Text2Radius: $('s1Text2Radius'),
    s1Text2MinH: $('s1Text2MinH'),
    s1Text2AddLine: $('s1Text2AddLine'),
    s1Text2DelLine: $('s1Text2DelLine'),
    s1Text2X: $('s1Text2X'),
    s1Text2Y: $('s1Text2Y'),
    s1Text2Font: $('s1Text2Font'),
    s1Text2Color: $('s1Text2Color'),
    s1Text2Align: $('s1Text2Align'),
    s1HeartsX: $('s1HeartsX'),
    s1HeartsY: $('s1HeartsY'),
    s1HeartSize: $('s1HeartSize'),
    s1HeartGap: $('s1HeartGap'),
    s1BoardJamos: $('s1BoardJamos'),
    s1QuizJamos: $('s1QuizJamos'),
    s1QuizX: $('s1QuizX'),
    s1QuizY: $('s1QuizY'),
    s1QuizW: $('s1QuizW'),
    s1QuizRadius: $('s1QuizRadius'),

    s2Bgm: $('s2Bgm'),
    s2BgmFile: $('s2BgmFile'),
    s2Image: $('s2Image'),
    s2ImageFile: $('s2ImageFile'),
    s2ImgFadeIn: $('s2ImgFadeIn'),
    s2ImgShake: $('s2ImgShake'),
    s2Texts: $('s2Texts'),

    s3Bgm: $('s3Bgm'),
    s3BgmFile: $('s3BgmFile'),
    s3Image: $('s3Image'),
    s3ImageFile: $('s3ImageFile'),
    s3ImgFadeIn: $('s3ImgFadeIn'),
    s3ImgShake: $('s3ImgShake'),
    s3Texts: $('s3Texts'),
    s3BtnText: $('s3BtnText'),
    s3BtnX: $('s3BtnX'),
    s3BtnY: $('s3BtnY'),
    s3BtnFont: $('s3BtnFont'),
    s3BtnPad: $('s3BtnPad'),

    s5Bgm: $('s5Bgm'),
    s5BgmFile: $('s5BgmFile'),
    s5Image: $('s5Image'),
    s5ImageFile: $('s5ImageFile'),
    s5ImgFadeIn: $('s5ImgFadeIn'),
    s5ImgShake: $('s5ImgShake'),
    s5Texts: $('s5Texts'),
    s5BtnText: $('s5BtnText'),
    s5BtnX: $('s5BtnX'),
    s5BtnY: $('s5BtnY'),
  };

  const getV = (field, def = "") => field ? (field.value || def) : def;
  const getN = (field, def = 0) => field ? (parseFloat(field.value) || def) : def;
  const getI = (field, def = 0) => field ? (parseInt(field.value, 10) || def) : def;
  const getOptN = (field) => {
    if (!field) return null;
    const raw = String(field.value ?? '').trim();
    if (!raw) return null;
    const n = Number(raw);
    return Number.isFinite(n) ? n : null;
  };

  const tabs = document.getElementById('tabs');
  const pv = document.getElementById('pv');
  const pvBg = document.getElementById('pv-bg');
  const pvText1 = document.getElementById('pv-text1');
  const pvText2 = document.getElementById('pv-text2');
  const pvHearts = document.getElementById('pv-hearts');
  const pvQuiz = document.getElementById('pv-quiz');
  const pvBtn = document.getElementById('pv-btn');
  let activeTabId = 'tab-scene1';

  function setActiveTab(tabId) {
    activeTabId = tabId;
    document.querySelectorAll('.tab').forEach((b) => b.classList.toggle('is-active', b.dataset.tab === tabId));
    document.querySelectorAll('.tabPanel').forEach((p) => p.classList.toggle('is-active', p.id === tabId));
    renderPreview(config);
  }

  function failFast(message) {
    alert(message);
    throw new Error(message);
  }

  if (!window.wordGameConfig && typeof wordGameConfig === 'object') {
    window.wordGameConfig = wordGameConfig;
  }
  if (!window.wordGameConfig) {
    failFast('wordGameConfig를 불러오지 못했습니다. 같은 폴더에 있는 game-config.js가 로드되는지 확인하세요.');
  }

  function deepClone(obj) {
    return JSON.parse(JSON.stringify(obj));
  }

  function mergeObj(base, patch) {
    return { ...(base || {}), ...(patch || {}) };
  }

  function mergeStyle(baseStyle, patchStyle) {
    return mergeObj(baseStyle || {}, patchStyle || {});
  }

  function mergePhase(basePhase, patchPhase) {
    return {
      ...(basePhase || {}),
      ...(patchPhase || {}),
      id: (patchPhase && patchPhase.id) || (basePhase && basePhase.id) || '',
      text: (patchPhase && typeof patchPhase.text === 'string') ? patchPhase.text : ((basePhase && basePhase.text) || ''),
      answer: String((patchPhase && patchPhase.answer) || (basePhase && basePhase.answer) || '').toUpperCase(),
      progressSeed: String((patchPhase && patchPhase.progressSeed) || (basePhase && basePhase.progressSeed) || ''),
    };
  }

  function loadConfig() {
    const base = deepClone(window.wordGameConfig);
    const saved = localStorage.getItem(LS_KEY);
    if (!saved) return base;
    try {
      const parsed = JSON.parse(saved);
      const merged = {
        ...base,
        ...parsed,
        ingame: mergeObj(base.ingame, parsed.ingame),
        gameplay: mergeObj(base.gameplay, parsed.gameplay),
      };
      merged.scenes = mergeObj(base.scenes, parsed.scenes);

      merged.ingame.phaseTextStyle = mergeStyle(base.ingame && base.ingame.phaseTextStyle, parsed.ingame && parsed.ingame.phaseTextStyle);
      merged.ingame.progressStyle = mergeStyle(base.ingame && base.ingame.progressStyle, parsed.ingame && parsed.ingame.progressStyle);

      if (Array.isArray(parsed.phases)) {
        const basePhases = Array.isArray(base.phases) ? base.phases : [];
        merged.phases = parsed.phases.map((p, i) => mergePhase(basePhases[i] || {}, p));
      }

      merged.failureScreen = mergeObj(base.failureScreen, parsed.failureScreen);
      merged.failureScreen.text1 = mergeObj(base.failureScreen && base.failureScreen.text1, parsed.failureScreen && parsed.failureScreen.text1);
      merged.failureScreen.text2 = mergeObj(base.failureScreen && base.failureScreen.text2, parsed.failureScreen && parsed.failureScreen.text2);
      merged.failureScreen.text1.style = mergeStyle(
        base.failureScreen && base.failureScreen.text1 && base.failureScreen.text1.style,
        parsed.failureScreen && parsed.failureScreen.text1 && parsed.failureScreen.text1.style,
      );
      merged.failureScreen.text2.style = mergeStyle(
        base.failureScreen && base.failureScreen.text2 && base.failureScreen.text2.style,
        parsed.failureScreen && parsed.failureScreen.text2 && parsed.failureScreen.text2.style,
      );

      return merged;
    } catch {
      return base;
    }
  }

  function toSource(config) {
    return `window.wordGameConfig = ${JSON.stringify(config, null, 2)};\n`;
  }

  const assetPreviewMap = new Map();
  function setAssetFromFile(fileInputEl, targetTextEl) {
    if (!fileInputEl || !targetTextEl) return;
    fileInputEl.addEventListener('change', () => {
      const file = fileInputEl.files && fileInputEl.files[0];
      if (!file) return;
      const path = `assets/${file.name}`;
      targetTextEl.value = path;
      try {
        const url = URL.createObjectURL(file);
        assetPreviewMap.set(path, url);
      } catch {}
      collect(config);
      refresh(config);
      renderPreview(config);
    });
  }

  function getPreviewUrl(path) {
    const p = String(path || '').trim();
    return assetPreviewMap.get(p) || p;
  }

  const setV = (field, val) => { if (field) field.value = val; };

  function autoResizeTextarea(el) {
    if (!el || el.tagName !== 'TEXTAREA') return;
    el.style.height = 'auto';
    const next = Math.max(42, el.scrollHeight || 42);
    el.style.height = `${next}px`;
  }

  function autoBindAllTextareas(root = document) {
    root.querySelectorAll('textarea').forEach((ta) => {
      if (ta.dataset.autoResizeBound === '1') return;
      ta.dataset.autoResizeBound = '1';
      const on = () => autoResizeTextarea(ta);
      ta.addEventListener('input', on);
      ta.addEventListener('change', on);
      queueMicrotask(on);
    });
  }

  function bind(config) {
    setV(fields.cursorEmoji, config.ingame?.cursorEmoji ?? '🔍');
    setV(fields.bgmVolume, config.audio?.bgmVolume ?? 0.7);
    setV(fields.s4Bgm, config.scenes?.scene4?.bgm ?? '');
    const ovs = config.scenes?.scene4?.phaseClearOverlays;
    setV(fields.s4Ov1Title, Array.isArray(ovs) && ovs[0] ? (ovs[0].title ?? '') : '');
    setV(fields.s4Ov1Sub, Array.isArray(ovs) && ovs[0] ? (ovs[0].subtitle ?? '') : '');
    setV(fields.s4Ov2Title, Array.isArray(ovs) && ovs[1] ? (ovs[1].title ?? '') : '');
    setV(fields.s4Ov2Sub, Array.isArray(ovs) && ovs[1] ? (ovs[1].subtitle ?? '') : '');
    setV(fields.s4Ov3Title, Array.isArray(ovs) && ovs[2] ? (ovs[2].title ?? '') : '');
    setV(fields.s4Ov3Sub, Array.isArray(ovs) && ovs[2] ? (ovs[2].subtitle ?? '') : '');
    setV(fields.gameBg, config.ingame.backgroundImage || '');
    setV(fields.bubbleImg, config.ingame.bubbleImage || '');

    setV(fields.phaseTextX, config.ingame.phaseTextStyle?.x ?? 50);
    setV(fields.phaseTextY, config.ingame.phaseTextStyle?.y ?? 20);
    setV(fields.phaseTextFont, config.ingame.phaseTextStyle?.fontSize ?? 28);
    setV(fields.phaseTextColor, config.ingame.phaseTextStyle?.color ?? '#ffffff');
    setV(fields.phaseTextAlign, config.ingame.phaseTextStyle?.align ?? 'center');

    setV(fields.progressX, config.ingame.progressStyle?.x ?? 50);
    setV(fields.progressY, config.ingame.progressStyle?.y ?? 86);
    setV(fields.progressFont, config.ingame.progressStyle?.fontSize ?? 22);
    setV(fields.progressColor, config.ingame.progressStyle?.color ?? '#ffffff');
    setV(fields.progressAlign, config.ingame.progressStyle?.align ?? 'center');

    const phases = Array.isArray(config.phases) ? config.phases : [];
    const p1 = phases[0] || {};
    const p2 = phases[1] || {};
    const p3 = phases[2] || {};
    setV(fields.p1Text, p1.text ?? '');
    setV(fields.p1Answer, p1.answer ?? 'ALEX');
    setV(fields.p1Seed, p1.progressSeed ?? '----');
    setV(fields.p2Text, p2.text ?? '');
    setV(fields.p2Answer, p2.answer ?? 'MAX');
    setV(fields.p2Seed, p2.progressSeed ?? '---');
    if (fields.p2MaskEnabled) fields.p2MaskEnabled.checked = (p2.bubbleMask?.enabled !== false);
    setV(fields.p2MaskDelay, p2.bubbleMask?.delayMs ?? 350);
    setV(fields.p2MaskIn, p2.bubbleMask?.fadeInMs ?? 650);
    setV(fields.p2MaskHold, p2.bubbleMask?.holdMs ?? 900);
    setV(fields.p2MaskOut, p2.bubbleMask?.fadeOutMs ?? 650);
    if (fields.p2MaskRepeat) fields.p2MaskRepeat.checked = !!(p2.bubbleMask?.repeatEnabled ?? true);
    setV(fields.p2MaskInterval, p2.bubbleMask?.repeatIntervalMs ?? 2600);
    setV(fields.p2MaskCount, p2.bubbleMask?.repeatCount ?? 0);
    setV(fields.p3Text, p3.text ?? '');
    setV(fields.p3Answer, p3.answer ?? 'HELP');
    setV(fields.p3Seed, p3.progressSeed ?? 'H---');
    if (fields.p3MaskEnabled) fields.p3MaskEnabled.checked = (p3.bubbleMask?.enabled !== false);
    setV(fields.p3MaskDelay, p3.bubbleMask?.delayMs ?? 250);
    setV(fields.p3MaskIn, p3.bubbleMask?.fadeInMs ?? 700);
    setV(fields.p3MaskHold, p3.bubbleMask?.holdMs ?? 1200);
    setV(fields.p3MaskOut, p3.bubbleMask?.fadeOutMs ?? 700);
    if (fields.p3MaskRepeat) fields.p3MaskRepeat.checked = !!(p3.bubbleMask?.repeatEnabled ?? true);
    setV(fields.p3MaskInterval, p3.bubbleMask?.repeatIntervalMs ?? 2800);
    setV(fields.p3MaskCount, p3.bubbleMask?.repeatCount ?? 0);

    setV(fields.fail1Text, config.failureScreen?.text1?.text ?? 'GAME OVER');
    setV(fields.fail1X, config.failureScreen?.text1?.style?.x ?? 50);
    setV(fields.fail1Y, config.failureScreen?.text1?.style?.y ?? 42);
    setV(fields.fail1Font, config.failureScreen?.text1?.style?.fontSize ?? 54);
    setV(fields.fail1Color, config.failureScreen?.text1?.style?.color ?? '#ffffff');
    setV(fields.fail1Align, config.failureScreen?.text1?.style?.align ?? 'center');

    setV(fields.fail2Text, config.failureScreen?.text2?.text ?? '');
    setV(fields.fail2X, config.failureScreen?.text2?.style?.x ?? 50);
    setV(fields.fail2Y, config.failureScreen?.text2?.style?.y ?? 56);
    setV(fields.fail2Font, config.failureScreen?.text2?.style?.fontSize ?? 22);
    setV(fields.fail2Color, config.failureScreen?.text2?.style?.color ?? '#ffffff');
    setV(fields.fail2Align, config.failureScreen?.text2?.style?.align ?? 'center');

    setV(fields.targetWord, config.gameplay.targetWord || 'ALEX');
    setV(fields.timeLimit, config.gameplay.timeLimitSeconds ?? 30);
    setV(fields.hearts, config.gameplay.hearts ?? 5);
    setV(fields.bubbleCount, config.gameplay.bubbleCount ?? 14);
    setV(fields.bubbleSpeed, config.gameplay.bubbleSpeed ?? 185);
    setV(fields.bubbleSize, config.gameplay.bubbleSize ?? 74);
    setV(fields.wrongHearts, config.gameplay.wrongConsumesHeart ?? 1);
    setV(fields.resetOnWrong, String(config.gameplay.resetProgressOnWrong !== false));

    const s1 = config.scenes?.scene1 || {};
    setV(fields.s1Bgm, s1.bgm ?? '');
    setV(fields.s1Layer1, s1.layers?.[0] || '');
    setV(fields.s1Layer2, s1.layers?.[1] || '');
    setV(fields.s1Layer3, s1.layers?.[2] || '');
    setV(fields.s1Layer4, s1.layers?.[3] || '');
    
    // s1 animation
    setV(fields.s1L2Move, s1.layerMove?.layer2MoveXvw ?? -18);
    setV(fields.s1L3Move, s1.layerMove?.layer3MoveXvw ?? 18);
    setV(fields.s1MoveDur, s1.layerMove?.moveDurationMs ?? 700);
    setV(fields.s1ZoomTo, s1.zoomFade?.zoomTo ?? 2);
    setV(fields.s1ZoomDur, s1.zoomFade?.zoomMs ?? 1000);
    setV(fields.s1FadeDur, s1.zoomFade?.fadeMs ?? 350);
    setV(fields.s1ImgFadeIn, s1.imgFadeInMs ?? 1000);
    if (fields.s1ImgShake) fields.s1ImgShake.checked = !!s1.imgShake;

    setV(fields.s1Text1, s1.text1?.text ?? '');
    if (fields.s1Text1BoxEnabled) fields.s1Text1BoxEnabled.checked = (s1.text1?.boxEnabled !== false);
    // 텍스트박스 디폴트값(에디터에 자동 입력)
    setV(fields.s1Text1BoxW, s1.text1?.boxStyle?.wPct ?? 92);
    setV(fields.s1Text1BoxH, s1.text1?.boxStyle?.hPct ?? '');
    setV(fields.s1Text1PadY, s1.text1?.boxStyle?.padY ?? 16);
    setV(fields.s1Text1PadX, s1.text1?.boxStyle?.padX ?? 18);
    setV(fields.s1Text1Radius, s1.text1?.boxStyle?.radius ?? 16);
    setV(fields.s1Text1MinH, s1.text1?.boxStyle?.minHeightPct ?? 0);
    setV(fields.s1Text1X, s1.text1?.style?.x ?? 50);
    setV(fields.s1Text1Y, s1.text1?.style?.y ?? 18);
    setV(fields.s1Text1Font, s1.text1?.style?.fontSize ?? 34);
    setV(fields.s1Text1Color, s1.text1?.style?.color ?? '#ffffff');
    setV(fields.s1Text1Align, s1.text1?.style?.align ?? 'center');
    setV(fields.s1Text2, s1.text2?.text ?? '');
    if (fields.s1Text2BoxEnabled) fields.s1Text2BoxEnabled.checked = (s1.text2?.boxEnabled !== false);
    setV(fields.s1Text2BoxW, s1.text2?.boxStyle?.wPct ?? 92);
    setV(fields.s1Text2BoxH, s1.text2?.boxStyle?.hPct ?? '');
    setV(fields.s1Text2PadY, s1.text2?.boxStyle?.padY ?? 16);
    setV(fields.s1Text2PadX, s1.text2?.boxStyle?.padX ?? 18);
    setV(fields.s1Text2Radius, s1.text2?.boxStyle?.radius ?? 16);
    setV(fields.s1Text2MinH, s1.text2?.boxStyle?.minHeightPct ?? 0);
    setV(fields.s1Text2X, s1.text2?.style?.x ?? 50);
    setV(fields.s1Text2Y, s1.text2?.style?.y ?? 24);
    setV(fields.s1Text2Font, s1.text2?.style?.fontSize ?? 28);
    setV(fields.s1Text2Color, s1.text2?.style?.color ?? '#ffffff');
    setV(fields.s1Text2Align, s1.text2?.style?.align ?? 'center');
    setV(fields.s1HeartsX, s1.hearts?.style?.x ?? 50);
    setV(fields.s1HeartsY, s1.hearts?.style?.y ?? 34);
    setV(fields.s1HeartSize, s1.hearts?.style?.size ?? 18);
    setV(fields.s1HeartGap, s1.hearts?.style?.gap ?? 8);
    const defaultBoard = 'ㄱ,ㅕ,ㅇ,ㅂ,ㅣ,ㅐ,ㅁ,ㅈ,ㄷ,ㅅ,ㄴ,ㅍ,ㅊ,ㅏ,ㅜ,ㅡ,ㅔ,ㅛ,ㅗ,ㅓ';
    if (Array.isArray(s1.quizBox?.boardJamos) && s1.quizBox.boardJamos.length) {
      setV(fields.s1BoardJamos, s1.quizBox.boardJamos.join(', '));
    } else if (typeof s1.quizBox?.boardSequence === 'string' && s1.quizBox.boardSequence.trim()) {
      setV(fields.s1BoardJamos, s1.quizBox.boardSequence.trim());
    } else {
      setV(fields.s1BoardJamos, defaultBoard);
    }
    if (Array.isArray(s1.quizBox?.quizJamos) && s1.quizBox.quizJamos.length) {
      setV(fields.s1QuizJamos, s1.quizBox.quizJamos.join(', '));
    } else if (Array.isArray(s1.quizBox?.answers) && s1.quizBox.answers.length) {
      setV(fields.s1QuizJamos, s1.quizBox.answers.join(', '));
    } else {
      setV(fields.s1QuizJamos, 'ㄱ,ㅕ,ㅇ,ㅂ,ㅣ,ㄱ,ㅐ,ㅁ,ㅣ');
    }
    setV(fields.s1QuizX, s1.quizBox?.style?.x ?? 50);
    setV(fields.s1QuizY, s1.quizBox?.style?.y ?? 52);
    setV(fields.s1QuizW, s1.quizBox?.style?.w ?? 520);
    setV(fields.s1QuizRadius, s1.quizBox?.style?.radius ?? 18);

    const s2 = config.scenes?.scene2 || {};
    setV(fields.s2Bgm, s2.bgm ?? '');
    setV(fields.s2Image, s2.image || '');
    setV(fields.s2ImgFadeIn, s2.imgFadeInMs ?? 500);
    if (fields.s2ImgShake) fields.s2ImgShake.checked = !!s2.imgShake;
    renderSubtitleList('s2', s2.subtitles || []);

    const s3 = config.scenes?.scene3 || {};
    setV(fields.s3Bgm, s3.bgm ?? '');
    setV(fields.s3Image, s3.image || '');
    setV(fields.s3ImgFadeIn, s3.imgFadeInMs ?? 500);
    if (fields.s3ImgShake) fields.s3ImgShake.checked = !!s3.imgShake;
    renderSubtitleList('s3', s3.subtitles || []);
    setV(fields.s3BtnText, s3.startButton?.text ?? '시작');
    setV(fields.s3BtnX, s3.startButton?.style?.x ?? 50);
    setV(fields.s3BtnY, s3.startButton?.style?.y ?? 82);
    setV(fields.s3BtnFont, s3.startButton?.style?.fontSize ?? 22);
    setV(fields.s3BtnPad, s3.startButton?.style?.paddingX ?? 52);

    const s5 = config.scenes?.scene5 || {};
    setV(fields.s5Bgm, s5.bgm ?? '');
    setV(fields.s5Image, s5.image || '');
    setV(fields.s5ImgFadeIn, s5.imgFadeInMs ?? 500);
    if (fields.s5ImgShake) fields.s5ImgShake.checked = !!s5.imgShake;
    renderSubtitleList('s5', s5.subtitles || []);
    setV(fields.s5BtnText, s5.startOverButton?.text ?? '처음부터');
    setV(fields.s5BtnX, s5.startOverButton?.style?.x ?? 50);
    setV(fields.s5BtnY, s5.startOverButton?.style?.y ?? 86);
  }

  function renderSubtitleList(sceneKey, subtitles) {
    const container = $(`${sceneKey}SubtitleContainer`);
    if (!container) return;
    container.innerHTML = '';
    subtitles.forEach((sub, i) => {
      const div = document.createElement('div');
      div.className = 'subtitle-item';
      div.innerHTML = `
        <div class="subtitle-item-header">
          <span>대사 ${i + 1}</span>
          <button class="btn tiny secondary" onclick="removeSubtitleLine('${sceneKey}', ${i})">삭제</button>
        </div>
        <textarea oninput="updateSubtitleProp('${sceneKey}', ${i}, 'text', this.value)">${sub.text || ''}</textarea>
        <div class="row" style="margin-top:6px;">
          <div style="display:flex; flex-direction:column;">
            <label style="font-size:10px; margin-bottom:2px;">위치 X(%)</label>
            <input type="number" step="0.1" value="${sub.x ?? 50}" oninput="updateSubtitleProp('${sceneKey}', ${i}, 'x', this.value)" />
          </div>
          <div style="display:flex; flex-direction:column;">
            <label style="font-size:10px; margin-bottom:2px;">위치 Y(%)</label>
            <input type="number" step="0.1" value="${sub.y ?? 72}" oninput="updateSubtitleProp('${sceneKey}', ${i}, 'y', this.value)" />
          </div>
          <div style="display:flex; flex-direction:column;">
            <label style="font-size:10px; margin-bottom:2px;">글자 크기(px)</label>
            <input type="number" value="${sub.fontSize ?? 26}" oninput="updateSubtitleProp('${sceneKey}', ${i}, 'fontSize', this.value)" />
          </div>
          <div style="display:flex; flex-direction:column;">
            <label style="font-size:10px; margin-bottom:2px;">글자 색</label>
            <input type="color" value="${sub.color ?? '#ffffff'}" oninput="updateSubtitleProp('${sceneKey}', ${i}, 'color', this.value)" />
          </div>
        </div>
        <div class="row" style="margin-top:6px;">
          <label style="display:flex; align-items:center; gap:8px; margin:0; font-size:12px; color:rgba(255,255,255,.8);">
            <input type="checkbox" ${sub.boxEnabled === false ? "" : "checked"} onchange="updateSubtitleProp('${sceneKey}', ${i}, 'boxEnabled', this.checked)" />
            텍스트 박스 표시
          </label>
        </div>
        <div class="row" style="margin-top:6px;">
          <div style="display:flex; flex-direction:column;">
            <label style="font-size:10px; margin-bottom:2px;">대기시간(ms)</label>
            <input type="number" step="100" value="${sub.delayMs ?? 1800}" oninput="updateSubtitleProp('${sceneKey}', ${i}, 'delayMs', this.value)" />
          </div>
          <div style="display:flex; flex-direction:column;">
            <label style="font-size:10px; margin-bottom:2px;">타자속도(ms)</label>
            <input type="number" step="5" value="${sub.typeSpeedMs ?? 45}" oninput="updateSubtitleProp('${sceneKey}', ${i}, 'typeSpeedMs', this.value)" />
          </div>
        </div>
        <div class="row" style="margin-top:6px;">
          <div style="display:flex; flex-direction:column;">
            <label style="font-size:10px; margin-bottom:2px;">박스 가로(%)</label>
            <input type="number" step="0.1" value="${sub.boxStyle?.wPct ?? 92}" oninput="updateSubtitleProp('${sceneKey}', ${i}, 'wPct', this.value)" />
          </div>
          <div style="display:flex; flex-direction:column;">
            <label style="font-size:10px; margin-bottom:2px;">박스 세로(%)</label>
            <input type="number" step="0.1" placeholder="비우면 자동" value="${sub.boxStyle?.hPct ?? ''}" oninput="updateSubtitleProp('${sceneKey}', ${i}, 'hPct', this.value)" />
          </div>
          <div style="display:flex; flex-direction:column;">
            <label style="font-size:10px; margin-bottom:2px;">패딩 위/아래(px)</label>
            <input type="number" value="${sub.boxStyle?.padY ?? 16}" oninput="updateSubtitleProp('${sceneKey}', ${i}, 'padY', this.value)" />
          </div>
          <div style="display:flex; flex-direction:column;">
            <label style="font-size:10px; margin-bottom:2px;">패딩 좌/우(px)</label>
            <input type="number" value="${sub.boxStyle?.padX ?? 18}" oninput="updateSubtitleProp('${sceneKey}', ${i}, 'padX', this.value)" />
          </div>
        </div>
        <div class="row" style="margin-top:6px;">
          <div style="display:flex; flex-direction:column;">
            <label style="font-size:10px; margin-bottom:2px;">둥글기(px)</label>
            <input type="number" value="${sub.boxStyle?.radius ?? 16}" oninput="updateSubtitleProp('${sceneKey}', ${i}, 'radius', this.value)" />
          </div>
          <div style="display:flex; flex-direction:column;">
            <label style="font-size:10px; margin-bottom:2px;">최소높이(vh%)</label>
            <input type="number" step="0.1" value="${sub.boxStyle?.minHeightPct ?? 0}" oninput="updateSubtitleProp('${sceneKey}', ${i}, 'minHeightPct', this.value)" />
          </div>
        </div>
      `;
      container.appendChild(div);
    });
    // Store JSON in the textarea for easy parsing
    $(`${sceneKey}Texts`).value = JSON.stringify(subtitles);
    autoBindAllTextareas(container);
  }

  window.updateSubtitleProp = (sceneKey, idx, prop, val) => {
    try {
      const subtitles = JSON.parse($(`${sceneKey}Texts`).value);
      if (prop === 'text' || prop === 'color') {
        subtitles[idx][prop] = val;
      } else if (prop === 'boxEnabled') {
        subtitles[idx][prop] = Boolean(val);
      } else if (prop === 'wPct' || prop === 'hPct' || prop === 'padY' || prop === 'padX' || prop === 'radius' || prop === 'minHeightPct') {
        subtitles[idx].boxStyle = subtitles[idx].boxStyle || {};
        const raw = String(val ?? '').trim();
        if (!raw) {
          delete subtitles[idx].boxStyle[prop];
        } else {
          const n = Number(raw);
          if (Number.isFinite(n)) {
            subtitles[idx].boxStyle[prop] = n;
          }
        }
      } else {
        subtitles[idx][prop] = Number(val);
      }
      $(`${sceneKey}Texts`).value = JSON.stringify(subtitles);
      collect(config);
      refresh(config);
      renderPreview(config);
    } catch (e) {}
  };

  window.removeSubtitleLine = (sceneKey, idx) => {
    try {
      const subtitles = JSON.parse($(`${sceneKey}Texts`).value);
      subtitles.splice(idx, 1);
      $(`${sceneKey}Texts`).value = JSON.stringify(subtitles);
      renderSubtitleList(sceneKey, subtitles);
      collect(config);
      refresh(config);
      renderPreview(config);
    } catch (e) {}
  };

  const addLine = (sceneKey) => {
    try {
      let subtitles = [];
      if ($(`${sceneKey}Texts`).value) subtitles = JSON.parse($(`${sceneKey}Texts`).value);
      subtitles.push({
        text: "",
        x: 50,
        y: 72,
        fontSize: 26,
        color: "#ffffff",
        align: "center",
        delayMs: 1800,
        typeSpeedMs: 45,
        boxEnabled: true,
        boxStyle: { wPct: 92, padY: 16, padX: 18, radius: 16, minHeightPct: 0 }
      });
      renderSubtitleList(sceneKey, subtitles);
      collect(config);
      refresh(config);
      renderPreview(config);
    } catch (e) {}
  };

  if ($(`s2AddLineBtn`)) $(`s2AddLineBtn`).onclick = () => addLine('s2');
  if ($(`s3AddLineBtn`)) $(`s3AddLineBtn`).onclick = () => addLine('s3');
  if ($(`s5AddLineBtn`)) $(`s5AddLineBtn`).onclick = () => addLine('s5');



  function collect(config) {
    config.audio = config.audio || {};
    config.audio.bgmVolume = Math.max(0, Math.min(1, getN(fields.bgmVolume, 0.7)));

    config.ingame.backgroundImage = getV(fields.gameBg).trim();
    config.ingame.bubbleImage = getV(fields.bubbleImg).trim();
    config.ingame.cursorEmoji = String(getV(fields.cursorEmoji, '🔍')).trim() || '🔍';

    config.ingame.phaseTextStyle = config.ingame.phaseTextStyle || {};
    config.ingame.phaseTextStyle.x = getN(fields.phaseTextX, 50);
    config.ingame.phaseTextStyle.y = getN(fields.phaseTextY, 20);
    config.ingame.phaseTextStyle.fontSize = Math.max(8, getI(fields.phaseTextFont, 28));
    config.ingame.phaseTextStyle.color = getV(fields.phaseTextColor, "#ffffff").trim();
    config.ingame.phaseTextStyle.align = getV(fields.phaseTextAlign, "center");

    config.ingame.progressStyle = config.ingame.progressStyle || {};
    config.ingame.progressStyle.x = getN(fields.progressX, 50);
    config.ingame.progressStyle.y = getN(fields.progressY, 86);
    config.ingame.progressStyle.fontSize = Math.max(8, getI(fields.progressFont, 22));
    config.ingame.progressStyle.color = getV(fields.progressColor, "#ffffff").trim();
    config.ingame.progressStyle.align = getV(fields.progressAlign, "center");

    config.phases = [
      {
        id: 'phase1',
        text: getV(fields.p1Text, ""),
        answer: String(getV(fields.p1Answer, "ALEX")).trim().toUpperCase(),
        progressSeed: String(getV(fields.p1Seed, "----")).trim().toUpperCase(),
      },
      {
        id: 'phase2',
        text: getV(fields.p2Text, ""),
        answer: String(getV(fields.p2Answer, "MAX")).trim().toUpperCase(),
        progressSeed: String(getV(fields.p2Seed, "---")).trim().toUpperCase(),
        bubbleMask: {
          enabled: !!(fields.p2MaskEnabled ? fields.p2MaskEnabled.checked : true),
          delayMs: Math.max(0, getI(fields.p2MaskDelay, 350)),
          fadeInMs: Math.max(0, getI(fields.p2MaskIn, 650)),
          holdMs: Math.max(0, getI(fields.p2MaskHold, 900)),
          fadeOutMs: Math.max(0, getI(fields.p2MaskOut, 650)),
          repeatEnabled: !!(fields.p2MaskRepeat ? fields.p2MaskRepeat.checked : true),
          repeatIntervalMs: Math.max(0, getI(fields.p2MaskInterval, 2600)),
          repeatCount: Math.max(0, getI(fields.p2MaskCount, 0)),
        },
      },
      {
        id: 'phase3',
        text: getV(fields.p3Text, ""),
        answer: String(getV(fields.p3Answer, "HELP")).trim().toUpperCase(),
        progressSeed: String(getV(fields.p3Seed, "H---")).trim().toUpperCase(),
        bubbleMask: {
          enabled: !!(fields.p3MaskEnabled ? fields.p3MaskEnabled.checked : true),
          delayMs: Math.max(0, getI(fields.p3MaskDelay, 250)),
          fadeInMs: Math.max(0, getI(fields.p3MaskIn, 700)),
          holdMs: Math.max(0, getI(fields.p3MaskHold, 1200)),
          fadeOutMs: Math.max(0, getI(fields.p3MaskOut, 700)),
          repeatEnabled: !!(fields.p3MaskRepeat ? fields.p3MaskRepeat.checked : true),
          repeatIntervalMs: Math.max(0, getI(fields.p3MaskInterval, 2800)),
          repeatCount: Math.max(0, getI(fields.p3MaskCount, 0)),
        },
      },
    ];

    config.failureScreen = config.failureScreen || {};
    config.failureScreen.text1 = config.failureScreen.text1 || {};
    config.failureScreen.text1.text = getV(fields.fail1Text, "");
    config.failureScreen.text1.style = config.failureScreen.text1.style || {};
    config.failureScreen.text1.style.x = getN(fields.fail1X, 50);
    config.failureScreen.text1.style.y = getN(fields.fail1Y, 42);
    config.failureScreen.text1.style.fontSize = Math.max(8, getI(fields.fail1Font, 54));
    config.failureScreen.text1.style.color = getV(fields.fail1Color, "#ffffff").trim();
    config.failureScreen.text1.style.align = getV(fields.fail1Align, "center");

    config.failureScreen.text2 = config.failureScreen.text2 || {};
    config.failureScreen.text2.text = getV(fields.fail2Text, "");
    config.failureScreen.text2.style = config.failureScreen.text2.style || {};
    config.failureScreen.text2.style.x = getN(fields.fail2X, 50);
    config.failureScreen.text2.style.y = getN(fields.fail2Y, 56);
    config.failureScreen.text2.style.fontSize = Math.max(8, getI(fields.fail2Font, 22));
    config.failureScreen.text2.style.color = getV(fields.fail2Color, "#ffffff").trim();
    config.failureScreen.text2.style.align = getV(fields.fail2Align, "center");

    config.gameplay.targetWord = getV(fields.targetWord, "ALEX").trim().toUpperCase();
    config.gameplay.timeLimitSeconds = Math.max(1, getI(fields.timeLimit, 30));
    config.gameplay.hearts = Math.max(1, getI(fields.hearts, 5));
    config.gameplay.bubbleCount = Math.max(4, getI(fields.bubbleCount, 14));
    config.gameplay.bubbleSpeed = Math.max(60, getI(fields.bubbleSpeed, 185));
    config.gameplay.bubbleSize = Math.max(40, getI(fields.bubbleSize, 74));
    config.gameplay.wrongConsumesHeart = Math.max(1, getI(fields.wrongHearts, 1));
    config.gameplay.resetProgressOnWrong = getV(fields.resetOnWrong) === 'true';

    config.scenes = config.scenes || {};
    const s1 = (config.scenes.scene1 = config.scenes.scene1 || {});
    s1.bgm = getV(fields.s1Bgm).trim();
    s1.layers = [getV(fields.s1Layer1).trim(), getV(fields.s1Layer2).trim(), getV(fields.s1Layer3).trim(), getV(fields.s1Layer4).trim()];
    
    // s1 animation
    s1.layerMove = s1.layerMove || {};
    s1.layerMove.layer2MoveXvw = getN(fields.s1L2Move);
    s1.layerMove.layer3MoveXvw = getN(fields.s1L3Move);
    s1.layerMove.moveDurationMs = getN(fields.s1MoveDur);
    s1.zoomFade = s1.zoomFade || {};
    s1.zoomFade.zoomTo = getN(fields.s1ZoomTo);
    s1.zoomFade.zoomMs = getN(fields.s1ZoomDur);
    s1.zoomFade.fadeMs = getN(fields.s1FadeDur);
    s1.imgFadeInMs = getI(fields.s1ImgFadeIn, 1000);
    s1.imgShake = !!(fields.s1ImgShake?.checked);

    s1.text1 = s1.text1 || { text: '', style: {} };
    s1.text1.text = getV(fields.s1Text1, "");
    s1.text1.boxEnabled = !!(fields.s1Text1BoxEnabled ? fields.s1Text1BoxEnabled.checked : true);
    s1.text1.boxStyle = s1.text1.boxStyle || {};
    const t1w = getOptN(fields.s1Text1BoxW);
    const t1h = getOptN(fields.s1Text1BoxH);
    const t1py = getOptN(fields.s1Text1PadY);
    const t1px = getOptN(fields.s1Text1PadX);
    const t1r = getOptN(fields.s1Text1Radius);
    const t1mh = getOptN(fields.s1Text1MinH);
    if (t1w === null) delete s1.text1.boxStyle.wPct; else s1.text1.boxStyle.wPct = t1w;
    if (t1h === null) delete s1.text1.boxStyle.hPct; else s1.text1.boxStyle.hPct = t1h;
    if (t1py === null) delete s1.text1.boxStyle.padY; else s1.text1.boxStyle.padY = t1py;
    if (t1px === null) delete s1.text1.boxStyle.padX; else s1.text1.boxStyle.padX = t1px;
    if (t1r === null) delete s1.text1.boxStyle.radius; else s1.text1.boxStyle.radius = t1r;
    if (t1mh === null) delete s1.text1.boxStyle.minHeightPct; else s1.text1.boxStyle.minHeightPct = t1mh;
    s1.text1.style = s1.text1.style || {};
    s1.text1.style.x = getN(fields.s1Text1X, 50);
    s1.text1.style.y = getN(fields.s1Text1Y, 18);
    s1.text1.style.fontSize = Math.max(8, getI(fields.s1Text1Font, 34));
    s1.text1.style.color = getV(fields.s1Text1Color, "#ffffff").trim();
    s1.text1.style.align = getV(fields.s1Text1Align, "center");
    s1.text2 = s1.text2 || { text: '', style: {} };
    s1.text2.text = getV(fields.s1Text2, "");
    s1.text2.boxEnabled = !!(fields.s1Text2BoxEnabled ? fields.s1Text2BoxEnabled.checked : true);
    s1.text2.boxStyle = s1.text2.boxStyle || {};
    const t2w = getOptN(fields.s1Text2BoxW);
    const t2h = getOptN(fields.s1Text2BoxH);
    const t2py = getOptN(fields.s1Text2PadY);
    const t2px = getOptN(fields.s1Text2PadX);
    const t2r = getOptN(fields.s1Text2Radius);
    const t2mh = getOptN(fields.s1Text2MinH);
    if (t2w === null) delete s1.text2.boxStyle.wPct; else s1.text2.boxStyle.wPct = t2w;
    if (t2h === null) delete s1.text2.boxStyle.hPct; else s1.text2.boxStyle.hPct = t2h;
    if (t2py === null) delete s1.text2.boxStyle.padY; else s1.text2.boxStyle.padY = t2py;
    if (t2px === null) delete s1.text2.boxStyle.padX; else s1.text2.boxStyle.padX = t2px;
    if (t2r === null) delete s1.text2.boxStyle.radius; else s1.text2.boxStyle.radius = t2r;
    if (t2mh === null) delete s1.text2.boxStyle.minHeightPct; else s1.text2.boxStyle.minHeightPct = t2mh;
    s1.text2.style = s1.text2.style || {};
    s1.text2.style.x = getN(fields.s1Text2X, 50);
    s1.text2.style.y = getN(fields.s1Text2Y, 24);
    s1.text2.style.fontSize = Math.max(8, getI(fields.s1Text2Font, 28));
    s1.text2.style.color = getV(fields.s1Text2Color, "#ffffff").trim();
    s1.text2.style.align = getV(fields.s1Text2Align, "center");
    s1.hearts = s1.hearts || { count: 3, style: {} };
    s1.hearts.style = s1.hearts.style || {};
    s1.hearts.style.x = getN(fields.s1HeartsX, 50);
    s1.hearts.style.y = getN(fields.s1HeartsY, 34);
    s1.hearts.style.size = Math.max(6, getI(fields.s1HeartSize, 18));
    s1.hearts.style.gap = Math.max(0, getI(fields.s1HeartGap, 8));
    s1.quizBox = s1.quizBox || { style: {} };
    s1.quizBox.style = s1.quizBox.style || {};
    s1.quizBox.style.x = getN(fields.s1QuizX, 50);
    s1.quizBox.style.y = getN(fields.s1QuizY, 52);
    s1.quizBox.style.w = Math.max(200, getI(fields.s1QuizW, 520));
    s1.quizBox.style.radius = Math.max(0, getI(fields.s1QuizRadius, 18));
    const boardRaw = getV(fields.s1BoardJamos, '');
    const boardJamos = [];
    if (boardRaw.includes(',')) {
      boardRaw.split(',').forEach((part) => {
        const t = String(part).trim();
        if (!t) return;
        Array.from(t).forEach((ch) => { if (ch.trim()) boardJamos.push(ch); });
      });
    } else {
      Array.from(boardRaw.trim()).forEach((ch) => { if (ch.trim()) boardJamos.push(ch); });
    }
    if (boardJamos.length) {
      s1.quizBox.boardJamos = boardJamos.slice(0, 20);
      delete s1.quizBox.boardSequence;
    } else {
      delete s1.quizBox.boardJamos;
    }
    const jamRaw = getV(fields.s1QuizJamos, '');
    const quizJamos = [];
    if (jamRaw.includes(',')) {
      jamRaw.split(',').forEach((part) => {
        const t = String(part).trim();
        if (!t) return;
        Array.from(t).forEach((ch) => { if (ch.trim()) quizJamos.push(ch); });
      });
    } else {
      Array.from(jamRaw.trim()).forEach((ch) => { if (ch.trim()) quizJamos.push(ch); });
    }
    s1.quizBox.quizJamos = quizJamos.length ? quizJamos.slice(0, 20) : ['ㄱ', 'ㅕ', 'ㅇ', 'ㅂ', 'ㅣ', 'ㄱ', 'ㅐ', 'ㅁ', 'ㅣ'];
    delete s1.quizBox.answers;

    const s2 = (config.scenes.scene2 = config.scenes.scene2 || {});
    s2.bgm = getV(fields.s2Bgm).trim();
    s2.image = getV(fields.s2Image).trim();
    s2.imgFadeInMs = getI(fields.s2ImgFadeIn, 500);
    s2.imgShake = !!(fields.s2ImgShake?.checked);
    try { s2.subtitles = JSON.parse(getV(fields.s2Texts, "[]")); } catch(e) { s2.subtitles = []; }

    const s3 = (config.scenes.scene3 = config.scenes.scene3 || {});
    s3.bgm = getV(fields.s3Bgm).trim();
    s3.image = getV(fields.s3Image).trim();
    s3.imgFadeInMs = getI(fields.s3ImgFadeIn, 500);
    s3.imgShake = !!(fields.s3ImgShake?.checked);
    try { s3.subtitles = JSON.parse(getV(fields.s3Texts, "[]")); } catch(e) { s3.subtitles = []; }
    
    s3.startButton = s3.startButton || { text: '시작', style: {} };
    s3.startButton.text = getV(fields.s3BtnText, "시작");
    s3.startButton.style = s3.startButton.style || {};
    s3.startButton.style.x = getN(fields.s3BtnX, 50);
    s3.startButton.style.y = getN(fields.s3BtnY, 82);
    s3.startButton.style.fontSize = Math.max(8, getI(fields.s3BtnFont, 22));
    const pad = Math.max(0, getI(fields.s3BtnPad, 52));
    s3.startButton.style.paddingX = pad;
    s3.startButton.style.paddingY = Math.max(0, Math.round(pad * 0.35));

    const s5 = (config.scenes.scene5 = config.scenes.scene5 || {});
    s5.bgm = getV(fields.s5Bgm).trim();
    s5.image = getV(fields.s5Image).trim();
    s5.imgFadeInMs = getI(fields.s5ImgFadeIn, 500);
    s5.imgShake = !!(fields.s5ImgShake?.checked);
    try { s5.subtitles = JSON.parse(getV(fields.s5Texts, "[]")); } catch(e) { s5.subtitles = []; }
    
    s5.startOverButton = s5.startOverButton || { text: '처음부터', style: {} };
    s5.startOverButton.text = getV(fields.s5BtnText, "처음부터");
    s5.startOverButton.style = s5.startOverButton.style || {};
    s5.startOverButton.style.x = getN(fields.s5BtnX, 50);
    s5.startOverButton.style.y = getN(fields.s5BtnY, 86);

    const s4 = (config.scenes.scene4 = config.scenes.scene4 || {});
    s4.bgm = getV(fields.s4Bgm).trim();
    s4.phaseClearOverlays = [
      { title: getV(fields.s4Ov1Title, '다음 Phase!'), subtitle: getV(fields.s4Ov1Sub, 'Phase 1 완료') },
      { title: getV(fields.s4Ov2Title, '다음 Phase!'), subtitle: getV(fields.s4Ov2Sub, 'Phase 2 완료') },
      { title: getV(fields.s4Ov3Title, '성공!'), subtitle: getV(fields.s4Ov3Sub, '기록: {time}\n최고: {best}') },
    ];
  }

  function clamp(v, lo, hi) { return Math.min(hi, Math.max(lo, v)); }
  function setPctFromDrag(el, cb) {
    if (!el || !pv) return;
    el.addEventListener('pointerdown', (e) => {
      el.setPointerCapture(e.pointerId);
      const rect = pv.getBoundingClientRect();
      const onMove = (ev) => {
        const x = clamp(((ev.clientX - rect.left) / rect.width) * 100, 0, 100);
        const y = clamp(((ev.clientY - rect.top) / rect.height) * 100, 0, 100);
        cb(x, y);
        refresh(config);
      };
      const onUp = () => {
        el.removeEventListener('pointermove', onMove);
        el.removeEventListener('pointerup', onUp);
        el.removeEventListener('pointercancel', onUp);
      };
      el.addEventListener('pointermove', onMove);
      el.addEventListener('pointerup', onUp);
      el.addEventListener('pointercancel', onUp);
    });
  }

  function renderPreview(config) {
    try {
      if (!pvBg) return;
      const scenes = config.scenes || {};
      pvText1.style.display = 'none';
      pvText2.style.display = 'none';
      pvHearts.style.display = 'none';
      pvQuiz.style.display = 'none';
      pvBtn.style.display = 'none';
      pvBg.style.backgroundImage = '';

      if (activeTabId === 'tab-scene1') {
        const s1 = scenes.scene1 || {};
        pvBg.style.backgroundImage = `url('${getPreviewUrl((s1.layers && s1.layers[3]) || '')}')`;
        pvText1.style.display = '';
        pvText2.style.display = '';
        pvHearts.style.display = '';
        pvQuiz.style.display = '';
        pvText1.textContent = s1.text1?.text || '';
        pvText2.textContent = s1.text2?.text || '';
        pvText1.style.left = `${s1.text1?.style?.x ?? 50}%`;
        pvText1.style.top = `${s1.text1?.style?.y ?? 18}%`;
        pvText1.style.fontSize = `${s1.text1?.style?.fontSize ?? 34}px`;
        pvText1.style.color = `${s1.text1?.style?.color ?? '#ffffff'}`;
        pvText2.style.left = `${s1.text2?.style?.x ?? 50}%`;
        pvText2.style.top = `${s1.text2?.style?.y ?? 24}%`;
        pvText2.style.fontSize = `${s1.text2?.style?.fontSize ?? 28}px`;
        pvText2.style.color = `${s1.text2?.style?.color ?? '#ffffff'}`;
        pvHearts.style.left = `${s1.hearts?.style?.x ?? 50}%`;
        pvHearts.style.top = `${s1.hearts?.style?.y ?? 34}%`;
        pvHearts.style.gap = `${s1.hearts?.style?.gap ?? 8}px`;
        const size = s1.hearts?.style?.size ?? 18;
        pvHearts.querySelectorAll('.pv-heart').forEach((h) => { h.style.width = `${size}px`; h.style.height = `${size}px`; });
        pvQuiz.style.left = `${s1.quizBox?.style?.x ?? 50}%`;
        pvQuiz.style.top = `${s1.quizBox?.style?.y ?? 52}%`;
        pvQuiz.style.borderRadius = `${s1.quizBox?.style?.radius ?? 18}px`;
        const jm = Array.isArray(s1.quizBox?.quizJamos) ? s1.quizBox.quizJamos : [];
        pvQuiz.textContent = jm.length ? `자모 퀴즈 (${jm.length}자)` : '퀴즈 박스';
      } else if (activeTabId === 'tab-scene2') {
        const s2 = scenes.scene2 || {};
        pvBg.style.backgroundImage = `url('${getPreviewUrl(s2.image || '')}')`;
        pvText1.style.display = '';
        const sub = (Array.isArray(s2.subtitles) && s2.subtitles.length) ? s2.subtitles[0] : null;
        pvText1.textContent = sub ? sub.text : '';
        if (sub) {
          pvText1.style.left = `${sub.x ?? 50}%`;
          pvText1.style.top = `${sub.y ?? 72}%`;
          pvText1.style.fontSize = `${sub.fontSize ?? 26}px`;
          pvText1.style.color = `${sub.color ?? '#ffffff'}`;
        }
      } else if (activeTabId === 'tab-scene3') {
        const s3 = scenes.scene3 || {};
        pvBg.style.backgroundImage = `url('${getPreviewUrl(s3.image || '')}')`;
        pvText1.style.display = '';
        pvBtn.style.display = '';
        const sub = (Array.isArray(s3.subtitles) && s3.subtitles.length) ? s3.subtitles[0] : null;
        pvText1.textContent = sub ? sub.text : '';
        if (sub) {
          pvText1.style.left = `${sub.x ?? 50}%`;
          pvText1.style.top = `${sub.y ?? 68}%`;
          pvText1.style.fontSize = `${sub.fontSize ?? 24}px`;
          pvText1.style.color = `${sub.color ?? '#ffffff'}`;
        }
        pvBtn.textContent = s3.startButton?.text || '시작';
        pvBtn.style.left = `${s3.startButton?.style?.x ?? 50}%`;
        pvBtn.style.top = `${s3.startButton?.style?.y ?? 82}%`;
        pvBtn.style.fontSize = `${s3.startButton?.style?.fontSize ?? 22}px`;
      } else if (activeTabId === 'tab-scene5') {
        const s5 = scenes.scene5 || {};
        pvBg.style.backgroundImage = `url('${getPreviewUrl(s5.image || '')}')`;
        pvText1.style.display = '';
        pvBtn.style.display = '';
        const sub = (Array.isArray(s5.subtitles) && s5.subtitles.length) ? s5.subtitles[0] : null;
        pvText1.textContent = sub ? sub.text : '';
        if (sub) {
          pvText1.style.left = `${sub.x ?? 50}%`;
          pvText1.style.top = `${sub.y ?? 72}%`;
          pvText1.style.fontSize = `${sub.fontSize ?? 26}px`;
          pvText1.style.color = `${sub.color ?? '#ffffff'}`;
        }
        pvBtn.textContent = s5.startOverButton?.text || '처음부터';
        pvBtn.style.left = `${s5.startOverButton?.style?.x ?? 50}%`;
        pvBtn.style.top = `${s5.startOverButton?.style?.y ?? 86}%`;
      }
    } catch (e) {
      console.error("Preview render error:", e);
    }
  }

  function refresh(config) {
    if (fields.out) fields.out.value = toSource(config);
  }

  let config;
  try {
    config = loadConfig();
    bind(config);
    refresh(config);
    renderPreview(config);
    autoBindAllTextareas(document);
  } catch (e) {
    console.error("Initialization error:", e);
    config = deepClone(window.wordGameConfig);
  }

  setAssetFromFile(fields.s1BgmFile, fields.s1Bgm);
  setAssetFromFile(fields.s2BgmFile, fields.s2Bgm);
  setAssetFromFile(fields.s3BgmFile, fields.s3Bgm);
  setAssetFromFile(fields.s4BgmFile, fields.s4Bgm);
  setAssetFromFile(fields.s5BgmFile, fields.s5Bgm);
  setAssetFromFile(fields.s1Layer1File, fields.s1Layer1);
  setAssetFromFile(fields.s1Layer2File, fields.s1Layer2);
  setAssetFromFile(fields.s1Layer3File, fields.s1Layer3);
  setAssetFromFile(fields.s1Layer4File, fields.s1Layer4);
  setAssetFromFile(fields.s2ImageFile, fields.s2Image);
  setAssetFromFile(fields.s3ImageFile, fields.s3Image);
  setAssetFromFile(fields.s5ImageFile, fields.s5Image);
  setAssetFromFile(fields.gameBgFile, fields.gameBg);
  setAssetFromFile(fields.bubbleImgFile, fields.bubbleImg);

  function appendLine(textareaEl) {
    if (!textareaEl) return;
    const v = String(textareaEl.value || '');
    textareaEl.value = v ? `${v}\n` : '\n';
    textareaEl.dispatchEvent(new Event('input', { bubbles: true }));
    textareaEl.focus();
  }
  function deleteLastLine(textareaEl) {
    if (!textareaEl) return;
    const lines = String(textareaEl.value || '').split('\n');
    if (!lines.length) return;
    lines.pop();
    textareaEl.value = lines.join('\n');
    textareaEl.dispatchEvent(new Event('input', { bubbles: true }));
    textareaEl.focus();
  }
  if (fields.s1Text1AddLine) fields.s1Text1AddLine.addEventListener('click', () => appendLine(fields.s1Text1));
  if (fields.s1Text1DelLine) fields.s1Text1DelLine.addEventListener('click', () => deleteLastLine(fields.s1Text1));
  if (fields.s1Text2AddLine) fields.s1Text2AddLine.addEventListener('click', () => appendLine(fields.s1Text2));
  if (fields.s1Text2DelLine) fields.s1Text2DelLine.addEventListener('click', () => deleteLastLine(fields.s1Text2));
  if (fields.fail1AddLine) fields.fail1AddLine.addEventListener('click', () => appendLine(fields.fail1Text));
  if (fields.fail1DelLine) fields.fail1DelLine.addEventListener('click', () => deleteLastLine(fields.fail1Text));
  if (fields.fail2AddLine) fields.fail2AddLine.addEventListener('click', () => appendLine(fields.fail2Text));
  if (fields.fail2DelLine) fields.fail2DelLine.addEventListener('click', () => deleteLastLine(fields.fail2Text));

  if (tabs) {
    tabs.addEventListener('click', (e) => {
      const btn = e.target.closest('.tab');
      if (!btn) return;
      setActiveTab(btn.dataset.tab);
    });
  }

  setPctFromDrag(pvText1, (x, y) => {
    if (activeTabId === 'tab-scene1') { fields.s1Text1X.value = x.toFixed(1); fields.s1Text1Y.value = y.toFixed(1); }
    if (activeTabId === 'tab-scene2' || activeTabId === 'tab-scene3' || activeTabId === 'tab-scene5') {
      const sceneKey = activeTabId === 'tab-scene2' ? 's2' : (activeTabId === 'tab-scene3' ? 's3' : 's5');
      try {
        const subtitles = JSON.parse($(`${sceneKey}Texts`).value);
        if (subtitles.length > 0) {
          subtitles[0].x = Number(x.toFixed(1));
          subtitles[0].y = Number(y.toFixed(1));
          $(`${sceneKey}Texts`).value = JSON.stringify(subtitles);
          renderSubtitleList(sceneKey, subtitles);
        }
      } catch (e) {}
    }
    collect(config);
    renderPreview(config);
  });
  setPctFromDrag(pvText2, (x, y) => {
    if (activeTabId !== 'tab-scene1') return;
    fields.s1Text2X.value = x.toFixed(1);
    fields.s1Text2Y.value = y.toFixed(1);
    collect(config);
    renderPreview(config);
  });
  setPctFromDrag(pvHearts, (x, y) => {
    if (activeTabId !== 'tab-scene1') return;
    fields.s1HeartsX.value = x.toFixed(1);
    fields.s1HeartsY.value = y.toFixed(1);
    collect(config);
    renderPreview(config);
  });
  setPctFromDrag(pvQuiz, (x, y) => {
    if (activeTabId !== 'tab-scene1') return;
    fields.s1QuizX.value = x.toFixed(1);
    fields.s1QuizY.value = y.toFixed(1);
    collect(config);
    renderPreview(config);
  });
  setPctFromDrag(pvBtn, (x, y) => {
    if (activeTabId === 'tab-scene3') { fields.s3BtnX.value = x.toFixed(1); fields.s3BtnY.value = y.toFixed(1); }
    if (activeTabId === 'tab-scene5') { fields.s5BtnX.value = x.toFixed(1); fields.s5BtnY.value = y.toFixed(1); }
    collect(config);
    renderPreview(config);
  });

  const btnSave = document.getElementById('btnSave');
  const btnCopy = document.getElementById('btnCopy');
  const btnDownload = document.getElementById('btnDownload');
  const btnReset = document.getElementById('btnReset');

  function saveLocal() {
    collect(config);
    localStorage.setItem(LS_KEY, JSON.stringify(config));
    refresh(config);
  }

  [
    fields.cursorEmoji,
    fields.bgmVolume, fields.s4Bgm,
    fields.s4Ov1Title, fields.s4Ov1Sub, fields.s4Ov2Title, fields.s4Ov2Sub, fields.s4Ov3Title, fields.s4Ov3Sub,
    fields.gameBg, fields.bubbleImg,
    fields.phaseTextX, fields.phaseTextY, fields.phaseTextFont, fields.phaseTextColor,
    fields.p1Text, fields.p1Answer, fields.p1Seed,
    fields.p2Text, fields.p2Answer, fields.p2Seed, fields.p2MaskDelay, fields.p2MaskIn, fields.p2MaskHold, fields.p2MaskOut, fields.p2MaskInterval, fields.p2MaskCount,
    fields.p3Text, fields.p3Answer, fields.p3Seed, fields.p3MaskDelay, fields.p3MaskIn, fields.p3MaskHold, fields.p3MaskOut, fields.p3MaskInterval, fields.p3MaskCount,
    fields.fail1Text, fields.fail1X, fields.fail1Y, fields.fail1Font, fields.fail1Color,
    fields.fail2Text, fields.fail2X, fields.fail2Y, fields.fail2Font, fields.fail2Color,
    fields.targetWord, fields.timeLimit,
    fields.bubbleCount, fields.bubbleSpeed, fields.bubbleSize,
    fields.s1Bgm, fields.s1Layer1, fields.s1Layer2, fields.s1Layer3, fields.s1Layer4,
    fields.s1L2Move, fields.s1L3Move, fields.s1MoveDur, fields.s1ZoomTo, fields.s1ZoomDur, fields.s1FadeDur,
    fields.s1ImgFadeIn, fields.s1ImgShake,
    fields.s1Text1, fields.s1Text1BoxW, fields.s1Text1BoxH, fields.s1Text1PadY, fields.s1Text1PadX, fields.s1Text1Radius, fields.s1Text1MinH, fields.s1Text1X, fields.s1Text1Y, fields.s1Text1Font, fields.s1Text1Color,
    fields.s1Text2, fields.s1Text2BoxW, fields.s1Text2BoxH, fields.s1Text2PadY, fields.s1Text2PadX, fields.s1Text2Radius, fields.s1Text2MinH, fields.s1Text2X, fields.s1Text2Y, fields.s1Text2Font, fields.s1Text2Color,
    fields.s1BoardJamos, fields.s1QuizJamos, fields.s1QuizX, fields.s1QuizY, fields.s1QuizW,
    fields.s2Bgm, fields.s2Image, fields.s2ImgFadeIn, fields.s2ImgShake,
    fields.s3Bgm, fields.s3Image, fields.s3ImgFadeIn, fields.s3ImgShake,
    fields.s3BtnText, fields.s3BtnX, fields.s3BtnY, fields.s3BtnFont, fields.s3BtnPad,
    fields.s5Bgm, fields.s5Image, fields.s5ImgFadeIn, fields.s5ImgShake,
    fields.s5BtnText, fields.s5BtnX, fields.s5BtnY,
  ].forEach((f) => {
    if (f) f.addEventListener('input', () => { collect(config); refresh(config); renderPreview(config); });
  });

  // checkbox는 input 이벤트가 브라우저별로 달라서 change도 함께 바인딩
  [fields.p2MaskEnabled, fields.p3MaskEnabled, fields.p2MaskRepeat, fields.p3MaskRepeat].forEach((f) => {
    if (f) f.addEventListener('change', () => { collect(config); refresh(config); renderPreview(config); });
  });

  if (btnSave) btnSave.onclick = () => { saveLocal(); alert('로컬 브라우저에 저장되었습니다.'); };
  if (btnCopy) btnCopy.onclick = () => { fields.out.select(); document.execCommand('copy'); alert('코드가 복사되었습니다.'); };
  if (btnDownload) btnDownload.onclick = () => {
    saveLocal();
    const blob = new Blob([toSource(config)], { type: 'text/javascript' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'game-config.js';
    a.click();
    URL.revokeObjectURL(url);
  };

  btnReset.addEventListener('click', () => {
    localStorage.removeItem(LS_KEY);
    config = deepClone(window.wordGameConfig);
    bind(config);
    refresh(config);
    alert('로컬 설정을 초기화했습니다.');
  });
});

