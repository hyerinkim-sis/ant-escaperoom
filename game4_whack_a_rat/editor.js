document.addEventListener('DOMContentLoaded', () => {
  const $ = (id) => document.getElementById(id);
  const LS_KEY = 'antfestival_game4_config';

  let config = JSON.parse(JSON.stringify(window.gameConfig));
  let activeTab = 'scene0';

  function ensureDefaults() {
    if (!config.scenes) config.scenes = {};
    if (!config.scenes.scene0) {
      config.scenes.scene0 = {
        id: 'scene0',
        type: 'signal-challenge',
        promptText: '가져왔나? 그러면 신호를 보내주게나',
        correctAnswer: 'FIGHT',
        nextSceneId: 'scene1',
        image: '',
        bgm: ''
      };
    } else {
      const s0 = config.scenes.scene0;
      if (s0.type !== 'signal-challenge') s0.type = 'signal-challenge';
      if (!s0.id) s0.id = 'scene0';
      if (s0.nextSceneId === undefined) s0.nextSceneId = 'scene1';
    }

    if (config.scenes.scene4 && config.scenes.scene4.nextSceneId === 'scene1') {
      config.scenes.scene4.nextSceneId = 'scene0';
    }

    if (!config.text) config.text = {};
    if (config.text.typeSpeedMs === undefined) config.text.typeSpeedMs = 40;
    if (config.text.autoAdvanceGapMs === undefined) config.text.autoAdvanceGapMs = 1500;
    if (config.text.autoAdvanceLastGapMs === undefined) config.text.autoAdvanceLastGapMs = 2000;
    if (config.text.revealMode === undefined) config.text.revealMode = 'typewriter';

    if (!config.audio) config.audio = {};
    if (config.audio.bgmVolume === undefined) config.audio.bgmVolume = 0.5;
    if (config.audio.hitSfx === undefined) config.audio.hitSfx = 'assets/sfx.wav';
    if (config.audio.sfxVolume === undefined) config.audio.sfxVolume = 0.85;

    ['scene1', 'scene2', 'scene4'].forEach((id) => {
      const s = config.scenes[id];
      if (!s) return;
      if (s.autoAdvance === undefined) s.autoAdvance = true;
      if (s.bgm === undefined) s.bgm = '';
    });

    const s3 = config.scenes.scene3;
    if (s3) {
      if (s3.bgm === undefined) s3.bgm = '';
      if (s3.image === undefined) s3.image = '';
      if (s3.ratImage === undefined) s3.ratImage = '';
      if (s3.hitSfx === undefined) s3.hitSfx = '';
      if (s3.ratMaxHp == null && s3.targetScore != null) {
        s3.ratMaxHp = s3.targetScore;
        delete s3.targetScore;
      }
      if (s3.ratMaxHp === undefined) s3.ratMaxHp = 100;
    }
  }

  function init() {
    loadFromLocalStorage();
    ensureDefaults();
    bindEvents();
    syncUI();
    renderPreview();
  }

  function loadFromLocalStorage() {
    const saved = localStorage.getItem(LS_KEY);
    if (saved) {
      try {
        config = JSON.parse(saved);
      } catch (e) {
        console.error('Failed to load saved config', e);
      }
    }
  }

  function saveToLocalStorage() {
    localStorage.setItem(LS_KEY, JSON.stringify(config));
  }

  function syncUI() {
    ensureDefaults();

    $('text-type-speed-ms').value = config.text.typeSpeedMs ?? 40;
    $('text-auto-gap-ms').value = config.text.autoAdvanceGapMs ?? 1500;
    $('text-auto-last-gap-ms').value = config.text.autoAdvanceLastGapMs ?? 2000;
    $('audio-bgm-volume').value = config.audio.bgmVolume ?? 0.5;
    $('text-dialogue-font-rem').value = config.text.dialogueFontRem ?? '';
    $('text-speaker-font-rem').value = config.text.speakerFontRem ?? '';
    $('audio-hit-sfx').value = config.audio.hitSfx ?? '';
    $('audio-sfx-volume').value = config.audio.sfxVolume ?? 0.85;

    const s0 = config.scenes.scene0;
    const p0 = $('panel-scene0');
    if (s0 && p0) {
      p0.querySelector('.scene-bgm').value = s0.bgm || '';
      p0.querySelector('.scene-image').value = s0.image || '';
      const pr = p0.querySelector('.scene-prompt');
      const ca = p0.querySelector('.scene-correct');
      if (pr) pr.value = s0.promptText || '';
      if (ca) ca.value = s0.correctAnswer || '';
    }

    ['scene1', 'scene2', 'scene4'].forEach((sceneId) => {
      const sceneData = config.scenes[sceneId];
      const panel = $(`panel-${sceneId}`);
      if (!panel) return;

      const bgmEl = panel.querySelector('.scene-bgm');
      if (bgmEl) bgmEl.value = sceneData.bgm || '';
      panel.querySelector('.scene-image').value = sceneData.image || '';

      const ts = panel.querySelector('.scene-type-speed');
      if (ts) ts.value = sceneData.typeSpeedMs ?? '';

      const ag = panel.querySelector('.scene-auto-gap');
      if (ag) ag.value = sceneData.autoAdvanceGapMs ?? '';

      const aa = panel.querySelector('.scene-auto-advance');
      if (aa) aa.checked = sceneData.autoAdvance !== false;

      const df = panel.querySelector('.scene-dialogue-font-rem');
      if (df) df.value = sceneData.dialogueFontRem ?? '';
      const sf = panel.querySelector('.scene-speaker-font-rem');
      if (sf) sf.value = sceneData.speakerFontRem ?? '';

      panel.querySelector('.scene-btn-text').value = sceneData.buttonText || '';
      renderDialogueList(sceneId);
    });

    const s3 = config.scenes.scene3;
    $('s3-bgm').value = s3.bgm || '';
    $('s3-image').value = s3.image || '';
    $('s3-title').value = s3.title || '';
    $('s3-desc').value = s3.desc || '';
    $('s3-game-time').value = s3.gameTime ?? 30;
    $('s3-rat-max-hp').value = s3.ratMaxHp ?? 100;
    $('s3-rat-image').value = s3.ratImage ?? '';
    $('s3-hit-sfx').value = s3.hitSfx ?? '';

    updateCodeOutput();
  }

  function renderDialogueList(sceneId) {
    const sceneData = config.scenes[sceneId];
    const listContainer = $(`panel-${sceneId}`).querySelector('.dialogue-list');
    listContainer.innerHTML = '';

    sceneData.dialogues.forEach((d, idx) => {
      const item = document.createElement('div');
      item.className = 'dialogue-item';
      item.innerHTML = `
        <button class="btn btn-danger btn-small" style="position:absolute; right:10px; top:10px;" onclick="removeDialogue('${sceneId}', ${idx})">×</button>
        <div class="row">
          <input type="text" class="dlg-speaker" placeholder="화자" oninput="updateDialogue('${sceneId}', ${idx}, 'speaker', this.value)">
        </div>
        <textarea class="dlg-text" placeholder="내용" oninput="updateDialogue('${sceneId}', ${idx}, 'text', this.value)"></textarea>
        <div class="row" style="margin-top: 8px;">
          <div>
            <label style="margin:0 0 5px; font-size:0.85rem;">글자 노출(ms, 줄별·비우면 화면/전역)</label>
            <input type="number" min="1" step="1" value="${d.typeSpeedMs ?? ''}" placeholder="(상위)" oninput="updateDialogueNum('${sceneId}', ${idx}, 'typeSpeedMs', this.value)">
          </div>
          <div>
            <label style="margin:0 0 5px; font-size:0.85rem;">다음 대사까지(ms, 줄별·비우면 화면/전역)</label>
            <input type="number" min="0" step="50" value="${d.autoAdvanceGapMs ?? ''}" placeholder="(상위)" oninput="updateDialogueNum('${sceneId}', ${idx}, 'autoAdvanceGapMs', this.value)">
          </div>
        </div>
        <div class="row" style="margin-top: 8px;">
          <div>
            <label style="margin:0 0 5px; font-size:0.85rem;">대사 크기(rem, 이 줄만)</label>
            <input type="number" min="0.5" max="4" step="0.05" value="${d.fontSizeRem ?? ''}" placeholder="(상위)" oninput="updateDialogueFloat('${sceneId}', ${idx}, 'fontSizeRem', this.value)">
          </div>
          <div>
            <label style="margin:0 0 5px; font-size:0.85rem;">화자 크기(rem, 이 줄만)</label>
            <input type="number" min="0.5" max="4" step="0.05" value="${d.speakerFontSizeRem ?? ''}" placeholder="(상위)" oninput="updateDialogueFloat('${sceneId}', ${idx}, 'speakerFontSizeRem', this.value)">
          </div>
        </div>
        <div class="row" style="margin-top: 6px;">
          <label style="display:flex; align-items:center; gap:6px; margin:0;">
            <input type="checkbox" ${d.revealMode === 'instant' ? 'checked' : ''} onchange="updateDialogue('${sceneId}', ${idx}, 'revealMode', this.checked ? 'instant' : 'typewriter')"> 한꺼번에 표시
          </label>
          <label style="display:flex; align-items:center; gap:6px; margin:0;">
            <input type="checkbox" ${d.isInstruction ? 'checked' : ''} onchange="updateDialogue('${sceneId}', ${idx}, 'isInstruction', this.checked)"> 안내문구
          </label>
          <label style="display:flex; align-items:center; gap:6px; margin:0;">
            <input type="checkbox" ${d.isFinal ? 'checked' : ''} onchange="updateDialogue('${sceneId}', ${idx}, 'isFinal', this.checked)"> 마지막만 버튼
          </label>
        </div>
      `;
      listContainer.appendChild(item);
      item.querySelector('.dlg-speaker').value = d.speaker || '';
      item.querySelector('.dlg-text').value = d.text || '';
    });
  }

  function bindEvents() {
    document.querySelectorAll('.tab').forEach((tab) => {
      tab.onclick = () => {
        document.querySelectorAll('.tab').forEach((t) => t.classList.remove('active'));
        document.querySelectorAll('.panel').forEach((p) => p.classList.remove('active'));
        tab.classList.add('active');
        activeTab = tab.dataset.tab;
        $(`panel-${activeTab}`).classList.add('active');
        renderPreview();
      };
    });

    $('text-type-speed-ms').oninput = (e) => {
      config.text.typeSpeedMs = Math.max(1, parseInt(e.target.value || '40', 10));
      updateAll();
    };
    $('text-auto-gap-ms').oninput = (e) => {
      config.text.autoAdvanceGapMs = Math.max(0, parseInt(e.target.value || '1500', 10));
      updateAll();
    };
    $('text-auto-last-gap-ms').oninput = (e) => {
      config.text.autoAdvanceLastGapMs = Math.max(0, parseInt(e.target.value || '2000', 10));
      updateAll();
    };
    $('audio-bgm-volume').oninput = (e) => {
      const v = parseFloat(e.target.value);
      config.audio.bgmVolume = Number.isFinite(v) ? Math.max(0, Math.min(1, v)) : 0.5;
      updateAll();
    };
    $('text-dialogue-font-rem').oninput = (e) => {
      const raw = e.target.value.trim();
      if (raw === '') delete config.text.dialogueFontRem;
      else {
        const n = parseFloat(raw);
        if (!Number.isNaN(n) && n > 0) config.text.dialogueFontRem = n;
      }
      updateAll();
    };
    $('text-speaker-font-rem').oninput = (e) => {
      const raw = e.target.value.trim();
      if (raw === '') delete config.text.speakerFontRem;
      else {
        const n = parseFloat(raw);
        if (!Number.isNaN(n) && n > 0) config.text.speakerFontRem = n;
      }
      updateAll();
    };
    $('audio-hit-sfx').oninput = (e) => {
      config.audio.hitSfx = e.target.value;
      updateAll();
    };
    $('audio-sfx-volume').oninput = (e) => {
      const v = parseFloat(e.target.value);
      config.audio.sfxVolume = Number.isFinite(v) ? Math.max(0, Math.min(1, v)) : 0.85;
      updateAll();
    };

    const p0 = $('panel-scene0');
    if (p0 && config.scenes.scene0) {
      p0.querySelector('.scene-bgm').oninput = (e) => {
        config.scenes.scene0.bgm = e.target.value;
        updateAll();
      };
      p0.querySelector('.scene-image').oninput = (e) => {
        config.scenes.scene0.image = e.target.value;
        updateAll();
      };
      const pr = p0.querySelector('.scene-prompt');
      if (pr) {
        pr.oninput = (e) => {
          config.scenes.scene0.promptText = e.target.value;
          updateAll();
        };
      }
      const ca = p0.querySelector('.scene-correct');
      if (ca) {
        ca.oninput = (e) => {
          config.scenes.scene0.correctAnswer = e.target.value;
          updateAll();
        };
      }
    }

    ['scene1', 'scene2', 'scene4'].forEach((sceneId) => {
      const panel = $(`panel-${sceneId}`);
      panel.querySelector('.scene-bgm').oninput = (e) => {
        config.scenes[sceneId].bgm = e.target.value;
        updateAll();
      };
      panel.querySelector('.scene-image').oninput = (e) => {
        config.scenes[sceneId].image = e.target.value;
        updateAll();
      };
      const ts = panel.querySelector('.scene-type-speed');
      if (ts) {
        ts.oninput = (e) => {
          const raw = e.target.value.trim();
          if (raw === '') delete config.scenes[sceneId].typeSpeedMs;
          else config.scenes[sceneId].typeSpeedMs = Math.max(1, parseInt(raw, 10));
          updateAll();
        };
      }
      const ag = panel.querySelector('.scene-auto-gap');
      if (ag) {
        ag.oninput = (e) => {
          const raw = e.target.value.trim();
          if (raw === '') delete config.scenes[sceneId].autoAdvanceGapMs;
          else config.scenes[sceneId].autoAdvanceGapMs = Math.max(0, parseInt(raw, 10));
          updateAll();
        };
      }
      const aa = panel.querySelector('.scene-auto-advance');
      if (aa) {
        aa.onchange = (e) => {
          config.scenes[sceneId].autoAdvance = !!e.target.checked;
          updateAll();
        };
      }
      const df = panel.querySelector('.scene-dialogue-font-rem');
      if (df) {
        df.oninput = (e) => {
          const raw = e.target.value.trim();
          if (raw === '') delete config.scenes[sceneId].dialogueFontRem;
          else {
            const n = parseFloat(raw);
            if (!Number.isNaN(n) && n > 0) config.scenes[sceneId].dialogueFontRem = n;
          }
          updateAll();
        };
      }
      const sf = panel.querySelector('.scene-speaker-font-rem');
      if (sf) {
        sf.oninput = (e) => {
          const raw = e.target.value.trim();
          if (raw === '') delete config.scenes[sceneId].speakerFontRem;
          else {
            const n = parseFloat(raw);
            if (!Number.isNaN(n) && n > 0) config.scenes[sceneId].speakerFontRem = n;
          }
          updateAll();
        };
      }
      panel.querySelector('.scene-btn-text').oninput = (e) => {
        config.scenes[sceneId].buttonText = e.target.value;
        updateAll();
      };
      panel.querySelector('.add-line-btn').onclick = () => {
        config.scenes[sceneId].dialogues.push({ speaker: '닉', text: '' });
        renderDialogueList(sceneId);
        updateAll();
      };
    });

    $('s3-bgm').oninput = (e) => {
      config.scenes.scene3.bgm = e.target.value;
      updateAll();
    };
    $('s3-image').oninput = (e) => {
      config.scenes.scene3.image = e.target.value;
      updateAll();
    };
    $('s3-title').oninput = (e) => {
      config.scenes.scene3.title = e.target.value;
      updateAll();
    };
    $('s3-desc').oninput = (e) => {
      config.scenes.scene3.desc = e.target.value;
      updateAll();
    };
    $('s3-game-time').oninput = (e) => {
      config.scenes.scene3.gameTime = parseInt(e.target.value || '30', 10);
      updateAll();
    };
    $('s3-rat-max-hp').oninput = (e) => {
      const n = parseInt(e.target.value || '100', 10);
      config.scenes.scene3.ratMaxHp = Number.isFinite(n) && n > 0 ? n : 100;
      delete config.scenes.scene3.targetScore;
      updateAll();
    };
    $('s3-rat-image').oninput = (e) => {
      config.scenes.scene3.ratImage = e.target.value;
      updateAll();
    };
    $('s3-hit-sfx').oninput = (e) => {
      config.scenes.scene3.hitSfx = e.target.value;
      updateAll();
    };

    $('btn-save-local').onclick = () => {
      saveToLocalStorage();
      alert('브라우저에 저장되었습니다.');
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
      alert('클립보드에 복사되었습니다.');
    };
  }

  window.updateDialogue = (sceneId, idx, prop, val) => {
    config.scenes[sceneId].dialogues[idx][prop] = val;
    updateAll();
  };

  window.updateDialogueNum = (sceneId, idx, prop, raw) => {
    const v = String(raw ?? '').trim();
    if (v === '') {
      delete config.scenes[sceneId].dialogues[idx][prop];
    } else {
      const n = parseInt(v, 10);
      if (!Number.isNaN(n)) config.scenes[sceneId].dialogues[idx][prop] = n;
    }
    updateAll();
  };

  window.updateDialogueFloat = (sceneId, idx, prop, raw) => {
    const v = String(raw ?? '').trim();
    if (v === '') {
      delete config.scenes[sceneId].dialogues[idx][prop];
    } else {
      const n = parseFloat(v);
      if (!Number.isNaN(n) && n > 0) config.scenes[sceneId].dialogues[idx][prop] = n;
    }
    updateAll();
  };

  window.removeDialogue = (sceneId, idx) => {
    config.scenes[sceneId].dialogues.splice(idx, 1);
    renderDialogueList(sceneId);
    updateAll();
  };

  function updateAll() {
    ensureDefaults();
    renderPreview();
    updateCodeOutput();
  }

  function renderPreview() {
    const scene = config.scenes[activeTab];
    const pvBg = $('pv-bg');
    if (!scene) {
      $('pv-title').innerText = '?';
      $('pv-text').innerText = '설정 없음';
      $('pv-btn').style.display = 'none';
      return;
    }
    const pvTitle = $('pv-title');
    const pvText = $('pv-text');
    const pvBtn = $('pv-btn');

    pvBg.style.backgroundImage = scene.image ? `url(${scene.image})` : 'none';

    if (activeTab === 'scene0') {
      pvTitle.innerText = '신호 입력';
      pvText.innerText = scene.promptText || '(문구 없음)';
      pvBtn.style.display = 'none';
    } else if (activeTab === 'scene3') {
      pvTitle.innerText = scene.title || 'GAME';
      pvText.innerText = scene.desc || 'Game Description';
      pvBtn.style.display = 'block';
      pvBtn.innerText = '미션 시작';
    } else {
      const firstLine = scene.dialogues && scene.dialogues[0];
      pvTitle.innerText = firstLine ? firstLine.speaker : '...';
      pvText.innerText = firstLine ? firstLine.text : '대사가 없습니다.';
      pvBtn.style.display = scene.buttonText ? 'block' : 'none';
      pvBtn.innerText = scene.buttonText || '';
    }
  }

  function updateCodeOutput() {
    $('output-code').value = `window.gameConfig = ${JSON.stringify(config, null, 2)};`;
  }

  init();
});
