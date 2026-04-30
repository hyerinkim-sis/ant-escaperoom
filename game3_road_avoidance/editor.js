document.addEventListener('DOMContentLoaded', () => {
  const $ = (id) => document.getElementById(id);
  const LS_KEY = 'antfestival_game3_config';

  // State
  let config = deepClone(window.gameConfig);
  let activeTab = 'scene1';
  let currentTool = 'wall';
  let isDragging = false;
  let startX, startY;
  let currentRect = null;

  // Canvas elements
  const canvas = $('editor-canvas');
  const ctx = canvas.getContext('2d');

  // --- Initialization ---
  function init() {
    loadFromLocalStorage();
    ensureSceneDefaults();
    bindEvents();
    syncUI();
    renderPreview();
    drawMap();
  }

  function loadFromLocalStorage() {
    const saved = localStorage.getItem(LS_KEY);
    if (saved) {
      try {
        config = JSON.parse(saved);
      } catch (e) {
        console.error("Failed to load saved config", e);
      }
    }
  }

  function saveToLocalStorage() {
    localStorage.setItem(LS_KEY, JSON.stringify(config));
  }

  function deepClone(obj) {
    return JSON.parse(JSON.stringify(obj));
  }

  function resizeGridPreserve(src, srcCols, srcRows, dstCols, dstRows) {
    const out = new Array(dstCols * dstRows).fill(0);
    if (!Array.isArray(src) || !srcCols || !srcRows) return out;
    const copyCols = Math.min(srcCols, dstCols);
    const copyRows = Math.min(srcRows, dstRows);
    for (let r = 0; r < copyRows; r++) {
      for (let c = 0; c < copyCols; c++) {
        out[r * dstCols + c] = src[r * srcCols + c] ? 1 : 0;
      }
    }
    return out;
  }

  function ensureSceneDefaults() {
    const sceneIds = ['scene2', 'scene4', 'scene5'];
    if (config.scenes && config.scenes.scene3) {
      const s3 = config.scenes.scene3;
      if (s3.hoverGuideText === undefined) s3.hoverGuideText = '개미를 잡아 인도하세요 (마우스 오버)';
      if (s3.livesSizePx === undefined) s3.livesSizePx = 48;
      if (s3.wallImage === undefined) s3.wallImage = '';
      if (s3.ratImage === undefined) s3.ratImage = '';
      if (s3.playerImage === undefined) s3.playerImage = '';
      if (s3.goalImage === undefined) s3.goalImage = '';
    }
    sceneIds.forEach((sceneId) => {
      if (!config.scenes || !config.scenes[sceneId]) return;
      const scene = config.scenes[sceneId];
      if (scene.autoAdvance === undefined) scene.autoAdvance = true;
      if (scene.autoAdvanceGapMs === undefined) scene.autoAdvanceGapMs = 1500;
      if (scene.autoAdvanceLastGapMs === undefined) scene.autoAdvanceLastGapMs = 2000;
      if ((sceneId === 'scene4' || sceneId === 'scene5') && scene.shakeIntensityPx === undefined) {
        scene.shakeIntensityPx = 0;
      }
    });
  }

  // --- UI Binding ---
  function syncUI() {
    // Global text settings
    if (!config.text) config.text = {};
    $('text-type-speed-ms').value = config.text.typeSpeedMs ?? 40;
    $('text-auto-gap-ms').value = config.text.autoAdvanceGapMs ?? 900;
    $('text-auto-last-gap-ms').value = config.text.autoAdvanceLastGapMs ?? 1500;

    // Global UI positions defaults (used for "기본값 표시")
    const globalUI = config.uiPositions || {};
    const s5UI = (config.scenes.scene5 && config.scenes.scene5.uiPositions) || {};

    // Scene 1
    const s1 = config.scenes.scene1;
    $('s1-bgm').value = s1.bgm || '';
    $('s1-image').value = s1.image || '';
    $('s1-text').value = s1.text || '';
    $('s1-patterns').value = (s1.patterns || []).join('\n');

    // Scene 3
    const s3 = config.scenes.scene3;
    $('s3-bgm').value = s3.bgm || '';
    $('s3-image').value = s3.image || '';
    $('s3-hover-guide-text').value = s3.hoverGuideText || '';
    $('s3-lives-size-px').value = s3.livesSizePx ?? 48;
    $('s3-wall-image').value = s3.wallImage || '';
    $('s3-rat-image').value = s3.ratImage || '';
    $('s3-player-image').value = s3.playerImage || '';
    $('s3-goal-image').value = s3.goalImage || '';
    $('s3-panel-width').value = s3.panelWidthPx ?? 800;
    $('s3-panel-height').value = s3.panelHeightPx ?? 500;
    $('s3-start-btn-left').value = (globalUI['escape-start-btn'] && globalUI['escape-start-btn'].leftPct) ?? 50;
    $('s3-start-btn-bottom').value = (globalUI['escape-start-btn'] && globalUI['escape-start-btn'].bottomPct) ?? 18;

    // Tile map (scene3)
    if (!config.mapTile) {
      config.mapTile = { cols: 32, rows: 20, tileSize: 25, walls: [], safeWalls: [], player: { c: 2, r: 2 }, goal: { c: 29, r: 17 }, rats: [] };
    }
    ensureTileWalls();
    $('tile-cols').value = config.mapTile.cols ?? 32;
    $('tile-rows').value = config.mapTile.rows ?? 20;
    $('tile-size').value = config.mapTile.tileSize ?? 25;

    // Dialogue Scenes (2, 4, 5)
    ['scene2', 'scene4', 'scene5'].forEach(sceneId => {
      const sceneData = config.scenes[sceneId];
      const panel = $(`panel-${sceneId}`);
      if (!panel) return;

      panel.querySelector('.scene-bgm').value = sceneData.bgm || '';
      panel.querySelector('.scene-image').value = sceneData.image || '';
      const autoAdvanceInput = panel.querySelector('.scene-auto-advance');
      if (autoAdvanceInput) autoAdvanceInput.checked = (sceneData.autoAdvance !== false);
      const shakeInput = panel.querySelector('.scene-shake-intensity');
      if (shakeInput) shakeInput.value = sceneData.shakeIntensityPx ?? 0;
      const btnInput = panel.querySelector('.scene-btn-text');
      if (btnInput) btnInput.value = sceneData.buttonText || '';

      renderDialogueList(sceneId);
    });

    // Scene 5 button position (single for the scene)
    const s5Btn = s5UI['dialogue-next-btn'] || globalUI['dialogue-next-btn'] || {};
    $('s5-btn-left').value = s5Btn.leftPct ?? 50;
    $('s5-btn-bottom').value = s5Btn.topPct ?? 50;

    updateCodeOutput();
  }

  function renderDialogueList(sceneId) {
    const sceneData = config.scenes[sceneId];
    const listContainer = $(`panel-${sceneId}`).querySelector('.dialogue-list');
    listContainer.innerHTML = '';

    const globalUI = config.uiPositions || {};
    const baseBox = globalUI['dialogue-box'] || { leftPct: 5, topPct: 80, widthPct: 90 };

    sceneData.dialogues.forEach((d, idx) => {
      const item = document.createElement('div');
      item.className = 'dialogue-item';
      const boxPos = (d.uiPositions && d.uiPositions['dialogue-box']) || {};
      const effectiveBoxLeft = boxPos.leftPct ?? baseBox.leftPct ?? 5;
      const effectiveBoxTop = boxPos.topPct ?? baseBox.topPct ?? 80;
      const effectiveBoxWidth = boxPos.widthPct ?? baseBox.widthPct ?? 90;
      item.innerHTML = `
        <button class="btn btn-danger btn-small" style="position:absolute; right:10px; top:10px;" onclick="removeDialogue('${sceneId}', ${idx})">×</button>
        <div class="row">
          <input type="text" placeholder="화자" value="${d.speaker || ''}" oninput="updateDialogue('${sceneId}', ${idx}, 'speaker', this.value)">
        </div>
        <textarea placeholder="내용" oninput="updateDialogue('${sceneId}', ${idx}, 'text', this.value)">${d.text || ''}</textarea>
        <div class="row" style="margin-top: 8px;">
          <div>
            <label style="margin:0 0 5px; font-size:0.85rem;">글자 노출 속도(ms, 줄별)</label>
            <input type="number" min="0" step="1" value="${(d.typeSpeedMs ?? '')}" placeholder="(전역값 사용)" oninput="updateDialogue('${sceneId}', ${idx}, 'typeSpeedMs', this.value === '' ? null : parseInt(this.value, 10))">
          </div>
          <div>
            <label style="margin:0 0 5px; font-size:0.85rem;">자동 넘어가기 간격(ms, 줄별)</label>
            <input type="number" min="0" step="50" value="${(d.autoAdvanceGapMs ?? '')}" placeholder="(전역값 사용)" oninput="updateDialogue('${sceneId}', ${idx}, 'autoAdvanceGapMs', this.value === '' ? null : parseInt(this.value, 10))">
          </div>
        </div>
        <div class="row" style="margin-top: 6px;">
          <label style="display:flex; align-items:center; gap:6px; margin:0;">
            <input type="checkbox" ${(d.revealMode === 'instant') ? 'checked' : ''} onchange="updateDialogue('${sceneId}', ${idx}, 'revealMode', this.checked ? 'instant' : 'typewriter')"> 한꺼번에 표시(타자효과 끄기)
          </label>
        </div>
        <div style="margin-top: 10px; padding: 10px; border-radius: 10px; background: rgba(0,0,0,0.18); border: 1px solid rgba(255,255,255,0.08);">
          <label style="margin:0 0 8px; font-size:0.9rem;">대사별 위치 설정(%, 줄별)</label>
          <div class="row">
            <div>
              <label style="margin:0 0 5px; font-size:0.85rem;">대사박스 LEFT(%)</label>
              <input type="number" min="0" max="100" step="1" value="${effectiveBoxLeft}" oninput="updateDialoguePos('${sceneId}', ${idx}, 'dialogue-box', 'leftPct', this.value)">
            </div>
            <div>
              <label style="margin:0 0 5px; font-size:0.85rem;">대사박스 TOP(%)</label>
              <input type="number" min="0" max="100" step="1" value="${effectiveBoxTop}" oninput="updateDialoguePos('${sceneId}', ${idx}, 'dialogue-box', 'topPct', this.value)">
            </div>
            <div>
              <label style="margin:0 0 5px; font-size:0.85rem;">대사박스 WIDTH(%)</label>
              <input type="number" min="1" max="100" step="1" value="${effectiveBoxWidth}" oninput="updateDialoguePos('${sceneId}', ${idx}, 'dialogue-box', 'widthPct', this.value)">
            </div>
          </div>
          <p class="help-text" style="margin-top:8px;">버튼 위치는 줄별이 아니라 화면3/화면5에서만 조절합니다.</p>
        </div>
        <div class="row" style="margin-top: 5px;">
          <label style="display:flex; align-items:center; gap:5px; margin:0;">
            <input type="checkbox" ${d.isInstruction ? 'checked' : ''} onchange="updateDialogue('${sceneId}', ${idx}, 'isInstruction', this.checked)"> 안내문구
          </label>
          <label style="display:flex; align-items:center; gap:5px; margin:0;">
            <input type="checkbox" ${d.isSfx ? 'checked' : ''} onchange="updateDialogue('${sceneId}', ${idx}, 'isSfx', this.checked)"> 효과음
          </label>
        </div>
      `;
      listContainer.appendChild(item);
    });
  }

  // --- Events ---
  function bindEvents() {
    // Tabs
    document.querySelectorAll('.tab').forEach(tab => {
      tab.onclick = () => {
        document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
        tab.classList.add('active');
        activeTab = tab.dataset.tab;
        $(`panel-${activeTab}`).classList.add('active');
        renderPreview();
      };
    });

    // Scene 1 inputs
    $('s1-bgm').oninput = (e) => { config.scenes.scene1.bgm = e.target.value; updateAll(); };
    $('s1-image').oninput = (e) => { config.scenes.scene1.image = e.target.value; updateAll(); };
    $('s1-text').oninput = (e) => { config.scenes.scene1.text = e.target.value; updateAll(); };
    $('s1-patterns').oninput = (e) => { config.scenes.scene1.patterns = e.target.value.split('\n').filter(p => p.trim()); updateAll(); };

    // Global text settings inputs
    $('text-type-speed-ms').oninput = (e) => {
      if (!config.text) config.text = {};
      config.text.typeSpeedMs = Math.max(1, parseInt(e.target.value || '40', 10));
      updateAll();
    };
    $('text-auto-gap-ms').oninput = (e) => {
      if (!config.text) config.text = {};
      config.text.autoAdvanceGapMs = Math.max(0, parseInt(e.target.value || '900', 10));
      updateAll();
    };
    $('text-auto-last-gap-ms').oninput = (e) => {
      if (!config.text) config.text = {};
      config.text.autoAdvanceLastGapMs = Math.max(0, parseInt(e.target.value || '1500', 10));
      updateAll();
    };

    // Scene 3 inputs
    $('s3-bgm').oninput = (e) => { config.scenes.scene3.bgm = e.target.value; updateAll(); };
    $('s3-image').oninput = (e) => { config.scenes.scene3.image = e.target.value; updateAll(); };
    $('s3-hover-guide-text').oninput = (e) => { config.scenes.scene3.hoverGuideText = e.target.value; updateAll(); };
    $('s3-lives-size-px').oninput = (e) => {
      config.scenes.scene3.livesSizePx = Math.max(20, Math.min(120, parseInt(e.target.value || '48', 10)));
      updateAll();
    };
    $('s3-wall-image').oninput = (e) => { config.scenes.scene3.wallImage = e.target.value; updateAll(); };
    $('s3-rat-image').oninput = (e) => { config.scenes.scene3.ratImage = e.target.value; updateAll(); };
    $('s3-player-image').oninput = (e) => { config.scenes.scene3.playerImage = e.target.value; updateAll(); };
    $('s3-goal-image').oninput = (e) => { config.scenes.scene3.goalImage = e.target.value; updateAll(); };
    $('s3-panel-width').oninput = (e) => {
      const n = Math.max(300, Math.min(2000, parseInt(e.target.value || '800', 10)));
      config.scenes.scene3.panelWidthPx = n;
      updateAll();
    };
    $('s3-panel-height').oninput = (e) => {
      const n = Math.max(200, Math.min(2000, parseInt(e.target.value || '500', 10)));
      config.scenes.scene3.panelHeightPx = n;
      updateAll();
    };
    $('s3-start-btn-left').oninput = (e) => {
      if (!config.uiPositions) config.uiPositions = {};
      if (!config.uiPositions['escape-start-btn']) config.uiPositions['escape-start-btn'] = {};
      config.uiPositions['escape-start-btn'].leftPct = Math.max(0, Math.min(100, parseInt(e.target.value || '50', 10)));
      updateAll();
    };
    $('s3-start-btn-bottom').oninput = (e) => {
      if (!config.uiPositions) config.uiPositions = {};
      if (!config.uiPositions['escape-start-btn']) config.uiPositions['escape-start-btn'] = {};
      config.uiPositions['escape-start-btn'].bottomPct = Math.max(0, Math.min(100, parseInt(e.target.value || '18', 10)));
      updateAll();
    };

    // Tile map inputs
    $('tile-cols').oninput = (e) => {
      if (!config.mapTile) return;
      const oldCols = config.mapTile.cols;
      const oldRows = config.mapTile.rows;
      const nextCols = Math.max(5, Math.min(100, parseInt(e.target.value || '32', 10)));
      if (nextCols !== oldCols) {
        config.mapTile.walls = resizeGridPreserve(config.mapTile.walls || [], oldCols, oldRows, nextCols, oldRows);
        config.mapTile.safeWalls = resizeGridPreserve(config.mapTile.safeWalls || [], oldCols, oldRows, nextCols, oldRows);
        config.mapTile.cols = nextCols;
        // Clamp entities into bounds
        if (config.mapTile.player) config.mapTile.player.c = Math.max(0, Math.min(nextCols - 1, config.mapTile.player.c));
        if (config.mapTile.goal) config.mapTile.goal.c = Math.max(0, Math.min(nextCols - 1, config.mapTile.goal.c));
        (config.mapTile.rats || []).forEach(rt => { rt.c = Math.max(0, Math.min(nextCols - 1, rt.c)); });
      }
      ensureTileWalls();
      drawMap();
      updateAll();
    };
    $('tile-rows').oninput = (e) => {
      if (!config.mapTile) return;
      const oldCols = config.mapTile.cols;
      const oldRows = config.mapTile.rows;
      const nextRows = Math.max(5, Math.min(100, parseInt(e.target.value || '20', 10)));
      if (nextRows !== oldRows) {
        config.mapTile.walls = resizeGridPreserve(config.mapTile.walls || [], oldCols, oldRows, oldCols, nextRows);
        config.mapTile.safeWalls = resizeGridPreserve(config.mapTile.safeWalls || [], oldCols, oldRows, oldCols, nextRows);
        config.mapTile.rows = nextRows;
        // Clamp entities into bounds
        if (config.mapTile.player) config.mapTile.player.r = Math.max(0, Math.min(nextRows - 1, config.mapTile.player.r));
        if (config.mapTile.goal) config.mapTile.goal.r = Math.max(0, Math.min(nextRows - 1, config.mapTile.goal.r));
        (config.mapTile.rats || []).forEach(rt => { rt.r = Math.max(0, Math.min(nextRows - 1, rt.r)); });
      }
      ensureTileWalls();
      drawMap();
      updateAll();
    };
    $('tile-size').oninput = (e) => {
      if (!config.mapTile) return;
      config.mapTile.tileSize = Math.max(10, Math.min(100, parseInt(e.target.value || '25', 10)));
      drawMap();
      updateAll();
    };

    // Dialogue Scene inputs
    ['scene2', 'scene4', 'scene5'].forEach(sceneId => {
      const panel = $(`panel-${sceneId}`);
      panel.querySelector('.scene-bgm').oninput = (e) => { config.scenes[sceneId].bgm = e.target.value; updateAll(); };
      panel.querySelector('.scene-image').oninput = (e) => { config.scenes[sceneId].image = e.target.value; updateAll(); };
      const autoAdvanceInput = panel.querySelector('.scene-auto-advance');
      if (autoAdvanceInput) {
        autoAdvanceInput.onchange = (e) => {
          config.scenes[sceneId].autoAdvance = !!e.target.checked;
          updateAll();
        };
      }
      const shakeInput = panel.querySelector('.scene-shake-intensity');
      if (shakeInput) {
        shakeInput.oninput = (e) => {
          config.scenes[sceneId].shakeIntensityPx = Math.max(0, Math.min(20, parseInt(e.target.value || '0', 10)));
          updateAll();
        };
      }
      const btnInput = panel.querySelector('.scene-btn-text');
      if (btnInput) btnInput.oninput = (e) => { config.scenes[sceneId].buttonText = e.target.value; updateAll(); };

      panel.querySelector('.add-line-btn').onclick = () => {
        config.scenes[sceneId].dialogues.push({ speaker: '닉', text: '' });
        renderDialogueList(sceneId);
        updateAll();
      };
    });

    // Scene 5 button position (single for the scene)
    $('s5-btn-left').oninput = (e) => {
      const n = Math.max(0, Math.min(100, parseInt(e.target.value || '50', 10)));
      if (!config.scenes.scene5.uiPositions) config.scenes.scene5.uiPositions = {};
      if (!config.scenes.scene5.uiPositions['dialogue-next-btn']) config.scenes.scene5.uiPositions['dialogue-next-btn'] = {};
      config.scenes.scene5.uiPositions['dialogue-next-btn'].leftPct = n;
      updateAll();
    };
    $('s5-btn-bottom').oninput = (e) => {
      const n = Math.max(0, Math.min(100, parseInt(e.target.value || '50', 10)));
      if (!config.scenes.scene5.uiPositions) config.scenes.scene5.uiPositions = {};
      if (!config.scenes.scene5.uiPositions['dialogue-next-btn']) config.scenes.scene5.uiPositions['dialogue-next-btn'] = {};
      config.scenes.scene5.uiPositions['dialogue-next-btn'].topPct = n;
      updateAll();
    };

    // Map Tools
    document.querySelectorAll('.btn-tool').forEach(btn => {
      btn.onclick = () => {
        document.querySelectorAll('.btn-tool').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentTool = btn.id.replace('tool-', '');
        $('rat-props').style.display = currentTool === 'rat' ? 'flex' : 'none';
      };
    });

    $('btn-clear-map').onclick = () => {
      if (confirm("타일맵의 모든 요소를 지우시겠습니까?")) {
        if (!config.mapTile) config.mapTile = { cols: 32, rows: 20, tileSize: 25, walls: [], safeWalls: [], player: { c: 2, r: 2 }, goal: { c: 29, r: 17 }, rats: [] };
        config.mapTile.walls = new Array(config.mapTile.cols * config.mapTile.rows).fill(0);
        config.mapTile.safeWalls = new Array(config.mapTile.cols * config.mapTile.rows).fill(0);
        config.mapTile.rats = [];
        config.mapTile.player = { c: 2, r: 2 };
        config.mapTile.goal = { c: config.mapTile.cols - 3, r: config.mapTile.rows - 3 };
        drawMap();
        updateAll();
      }
    };

    // Canvas Mouse Events (Tile Map)
    canvas.oncontextmenu = (e) => e.preventDefault();
    canvas.onmousedown = (e) => {
      if (!config.mapTile) return;
      ensureTileWalls();
      const { c, r } = getTileAtCanvasPos(e);
      if (!inBounds(c, r)) return;

      const isRight = e.button === 2;
      const idx = tileIndex(c, r);

      const removeRatAt = (cc, rr) => {
        const list = config.mapTile.rats || [];
        const i = list.findIndex(rt => rt.c === cc && rt.r === rr);
        if (i >= 0) list.splice(i, 1);
      };

      if (currentTool === 'wall') {
        config.mapTile.walls[idx] = isRight ? 0 : (config.mapTile.walls[idx] ? 0 : 1);
        if (config.mapTile.walls[idx]) config.mapTile.safeWalls[idx] = 0;
      } else if (currentTool === 'safe-wall') {
        config.mapTile.safeWalls[idx] = isRight ? 0 : (config.mapTile.safeWalls[idx] ? 0 : 1);
        if (config.mapTile.safeWalls[idx]) config.mapTile.walls[idx] = 0;
      } else if (currentTool === 'erase') {
        config.mapTile.walls[idx] = 0;
        config.mapTile.safeWalls[idx] = 0;
        removeRatAt(c, r);
      } else if (currentTool === 'player') {
        config.mapTile.player = { c, r };
      } else if (currentTool === 'goal') {
        config.mapTile.goal = { c, r };
      } else if (currentTool === 'rat') {
        if (isRight) {
          removeRatAt(c, r);
        } else {
          if (!config.mapTile.rats) config.mapTile.rats = [];
          removeRatAt(c, r);
          const speed = parseFloat($('rat-speed').value) || 2.0;
          const range = parseFloat($('rat-range').value) || 200;
          config.mapTile.rats.push({ c, r, speed, range });
        }
      }

      drawMap();
      updateAll();
    };

    // no drag rectangle in tile mode
    window.onmousemove = null;
    window.onmouseup = null;

    // Global Buttons
    $('btn-save-local').onclick = () => {
      saveToLocalStorage();
      alert("브라우저 로컬 저장소에 저장되었습니다.");
    };

    $('btn-download').onclick = () => {
      const code = `window.gameConfig = ${JSON.stringify(config, null, 2)};`;
      const blob = new Blob([code], { type: 'text/javascript' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'game-config.js';
      a.click();
    };

    $('btn-copy').onclick = () => {
      $('output-code').select();
      document.execCommand('copy');
      alert("코드가 클립보드에 복사되었습니다.");
    };
  }

  // Window scoped functions for dynamic HTML
  window.updateDialogue = (sceneId, idx, prop, val) => {
    config.scenes[sceneId].dialogues[idx][prop] = val;
    updateAll();
  };

  window.updateDialoguePos = (sceneId, idx, elementId, key, rawVal) => {
    const line = config.scenes[sceneId].dialogues[idx];
    if (!line.uiPositions) line.uiPositions = {};
    if (!line.uiPositions[elementId]) line.uiPositions[elementId] = {};

    const vStr = String(rawVal ?? '').trim();
    if (vStr === '') {
      delete line.uiPositions[elementId][key];
    } else {
      const n = Number(vStr);
      if (!Number.isNaN(n)) line.uiPositions[elementId][key] = n;
    }

    if (line.uiPositions[elementId] && Object.keys(line.uiPositions[elementId]).length === 0) {
      delete line.uiPositions[elementId];
    }
    if (line.uiPositions && Object.keys(line.uiPositions).length === 0) {
      delete line.uiPositions;
    }

    updateAll();
  };

  window.removeDialogue = (sceneId, idx) => {
    config.scenes[sceneId].dialogues.splice(idx, 1);
    renderDialogueList(sceneId);
    updateAll();
  };

  function updateAll() {
    ensureSceneDefaults();
    renderPreview();
    updateCodeOutput();
  }

  function getCanvasPos(e) {
    const rect = canvas.getBoundingClientRect();
    return {
      x: Math.round(e.clientX - rect.left),
      y: Math.round(e.clientY - rect.top)
    };
  }

  function ensureTileWalls() {
    if (!config.mapTile) return;
    const cols = config.mapTile.cols;
    const rows = config.mapTile.rows;
    const size = cols * rows;
    const srcCols = Number(config.mapTile.sourceCols ?? config.mapTile._sourceCols ?? cols);
    const srcRows = Number(config.mapTile.sourceRows ?? config.mapTile._sourceRows ?? rows);
    const srcSize = srcCols * srcRows;
    if (!Array.isArray(config.mapTile.walls)) config.mapTile.walls = [];
    if (config.mapTile.walls.length === srcSize && (srcCols !== cols || srcRows !== rows)) {
      config.mapTile.walls = resizeGridPreserve(config.mapTile.walls, srcCols, srcRows, cols, rows);
    }
    if (config.mapTile.walls.length !== size) {
      config.mapTile.walls = resizeGridPreserve(config.mapTile.walls, cols, rows, cols, rows);
    }
    if (!Array.isArray(config.mapTile.safeWalls)) config.mapTile.safeWalls = [];
    if (config.mapTile.safeWalls.length === srcSize && (srcCols !== cols || srcRows !== rows)) {
      config.mapTile.safeWalls = resizeGridPreserve(config.mapTile.safeWalls, srcCols, srcRows, cols, rows);
    }
    if (config.mapTile.safeWalls.length !== size) {
      config.mapTile.safeWalls = resizeGridPreserve(config.mapTile.safeWalls, cols, rows, cols, rows);
    }
    if (!Array.isArray(config.mapTile.rats)) config.mapTile.rats = [];
    if (!config.mapTile.player) config.mapTile.player = { c: 2, r: 2 };
    if (!config.mapTile.goal) config.mapTile.goal = { c: cols - 3, r: rows - 3 };

    config.mapTile._sourceCols = cols;
    config.mapTile._sourceRows = rows;
  }

  function tileIndex(c, r) {
    return r * config.mapTile.cols + c;
  }

  function inBounds(c, r) {
    return c >= 0 && r >= 0 && c < config.mapTile.cols && r < config.mapTile.rows;
  }

  function getTileAtCanvasPos(e) {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const ts = config.mapTile.tileSize;
    return { c: Math.floor(x / ts), r: Math.floor(y / ts) };
  }

  // --- Rendering ---
  function renderPreview() {
    const scene = config.scenes[activeTab];
    const pvBg = $('pv-bg');
    const pvTitle = $('pv-title');
    const pvText = $('pv-text');
    const pvBtn = $('pv-btn');

    pvBg.style.backgroundImage = scene.image ? `url(${scene.image})` : 'none';

    if (activeTab === 'scene1') {
      pvTitle.innerText = "PATTERN LOCK";
      pvText.innerText = scene.text || '';
      pvBtn.style.display = 'none';
    } else if (activeTab === 'scene3') {
      pvTitle.innerText = "ESCAPE GAME";
      pvText.innerText = "(길 피하기 게임 화면)";
      pvBtn.style.display = 'block';
      pvBtn.innerText = "시작하기";
    } else {
      const firstLine = scene.dialogues && scene.dialogues[0];
      pvTitle.innerText = firstLine ? firstLine.speaker : '...';
      pvText.innerText = firstLine ? firstLine.text : '대사가 없습니다.';
      pvBtn.style.display = scene.buttonText ? 'block' : 'none';
      pvBtn.innerText = scene.buttonText || '';
    }
  }

  function drawMap() {
    if (!config.mapTile) return;
    ensureTileWalls();

    const { cols, rows, tileSize } = config.mapTile;
    canvas.width = cols * tileSize;
    canvas.height = rows * tileSize;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Grid
    ctx.strokeStyle = 'rgba(255,255,255,0.08)';
    ctx.lineWidth = 1;
    for (let c = 0; c <= cols; c++) {
      const x = c * tileSize;
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke();
    }
    for (let r = 0; r <= rows; r++) {
      const y = r * tileSize;
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke();
    }

    // Walls
    ctx.fillStyle = 'rgba(255,255,255,0.22)';
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (config.mapTile.walls[tileIndex(c, r)]) {
          ctx.fillRect(c * tileSize, r * tileSize, tileSize, tileSize);
        }
      }
    }
    // Safe Walls
    ctx.fillStyle = 'rgba(0,255,204,0.18)';
    ctx.strokeStyle = 'rgba(0,255,204,0.45)';
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (config.mapTile.safeWalls[tileIndex(c, r)]) {
          const x = c * tileSize;
          const y = r * tileSize;
          ctx.fillRect(x, y, tileSize, tileSize);
          ctx.strokeRect(x + 1, y + 1, tileSize - 2, tileSize - 2);
        }
      }
    }

    // Goal
    if (config.mapTile.goal) {
      ctx.fillStyle = 'rgba(255, 215, 0, 0.35)';
      ctx.fillRect(config.mapTile.goal.c * tileSize, config.mapTile.goal.r * tileSize, tileSize, tileSize);
    }

    // Player
    if (config.mapTile.player) {
      ctx.fillStyle = 'rgba(0,255,204,0.35)';
      ctx.fillRect(config.mapTile.player.c * tileSize, config.mapTile.player.r * tileSize, tileSize, tileSize);
    }

    // Rats
    (config.mapTile.rats || []).forEach(rat => {
      const cx = rat.c * tileSize + tileSize / 2;
      const cy = rat.r * tileSize + tileSize / 2;
      const range = Math.max(10, Number(rat.range ?? 200));
      // vision circle
      ctx.beginPath();
      ctx.arc(cx, cy, range, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 71, 87, 0.08)';
      ctx.fill();
      ctx.strokeStyle = 'rgba(255, 71, 87, 0.22)';
      ctx.stroke();
      ctx.fillStyle = 'rgba(255, 71, 87, 0.55)';
      ctx.fillRect(rat.c * tileSize, rat.r * tileSize, tileSize, tileSize);
    });
  }

  function updateCodeOutput() {
    $('output-code').value = `window.gameConfig = ${JSON.stringify(config, null, 2)};`;
  }

  init();
});
