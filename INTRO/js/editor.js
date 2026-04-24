document.addEventListener('DOMContentLoaded', () => {
    const editorApp = document.getElementById('editor-app');
    const outputArea = document.getElementById('config-output');
    const defaultConfig = JSON.parse(JSON.stringify(gameConfig));

    function escapeHtml(s) {
        return String(s)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
    }

    function escapeAttr(s) {
        return String(s)
            .replace(/&/g, '&amp;')
            .replace(/"/g, '&quot;')
            .replace(/</g, '&lt;');
    }
    
    function mergeConfig(baseConfig, savedConfig) {
        const merged = JSON.parse(JSON.stringify(baseConfig));
        if (!savedConfig || typeof savedConfig !== 'object') return merged;

        merged.button = {
            ...(baseConfig.button || {}),
            ...(savedConfig.button || {})
        };

        const parsedTypeSpeed = Number(savedConfig.typeSpeed);
        merged.typeSpeed = Number.isNaN(parsedTypeSpeed)
            ? (baseConfig.typeSpeed ?? 50)
            : Math.min(200, Math.max(0, parsedTypeSpeed));

        const baseScenes = Array.isArray(baseConfig.scenes) ? baseConfig.scenes : [];
        const savedScenes = Array.isArray(savedConfig.scenes) ? savedConfig.scenes : [];
        const savedSceneMap = new Map();

        savedScenes.forEach((scene, index) => {
            if (!scene || typeof scene !== 'object') return;
            const key = scene.id ?? `index-${index}`;
            savedSceneMap.set(key, scene);
        });

        merged.scenes = baseScenes.map((baseScene, index) => {
            const key = baseScene.id ?? `index-${index}`;
            const savedScene = savedSceneMap.get(key) || savedScenes[index] || {};
            const mergedScene = {
                ...baseScene,
                ...savedScene
            };

            if (baseScene.subtitle || savedScene.subtitle) {
                mergedScene.subtitle = {
                    ...(baseScene.subtitle || {}),
                    ...(savedScene.subtitle || {})
                };
            }

            // 복수 자막(subtitles) 병합: 저장된 배열이 있으면 우선 사용, 없으면 base 유지
            if (Array.isArray(baseScene.subtitles) || Array.isArray(savedScene.subtitles)) {
                const baseSubs = Array.isArray(baseScene.subtitles) ? baseScene.subtitles : [];
                const savedSubs = Array.isArray(savedScene.subtitles) ? savedScene.subtitles : [];
                mergedScene.subtitles = savedSubs.length > 0 ? savedSubs : baseSubs;
            }

            return mergedScene;
        });

        return merged;
    }

    // 로컬 스토리지에서 데이터 로드 시도 (기존 값 보존 + 신규 필드 병합)
    const savedConfig = localStorage.getItem('intro_save_data');
    if (savedConfig) {
        try {
            const parsed = JSON.parse(savedConfig);
            const mergedConfig = mergeConfig(defaultConfig, parsed);
            Object.keys(gameConfig).forEach((key) => delete gameConfig[key]);
            Object.assign(gameConfig, mergedConfig);
        } catch (e) {
            console.error("Failed to load saved config", e);
        }
    }

    function renderEditor() {
        editorApp.innerHTML = '';
        
        // 버튼 설정 섹션
        const btnSection = document.createElement('div');
        btnSection.className = 'editor-card';
        btnSection.innerHTML = `
            <h2>1. 버튼 & 배경 애니메이션</h2>
            <div class="input-group">
                <label>이동 거리 (px):</label>
                <input type="text" value="${escapeAttr(gameConfig.button.floatDistance)}" onchange="updateBtnConfig('floatDistance', this.value)">
            </div>
            <div class="input-group">
                <label>주기 (초):</label>
                <input type="text" value="${escapeAttr(gameConfig.button.floatDuration)}" onchange="updateBtnConfig('floatDuration', this.value)">
            </div>
            <div class="input-group">
                <label>자막 타이핑 속도 (ms, 0이면 즉시 출력):</label>
                <input type="range" min="0" max="200" value="${gameConfig.typeSpeed ?? 50}" oninput="previewTypeSpeed(this.value)" onchange="updateTypeSpeed(this.value)">
                <span style="font-size: 0.85rem; color: #aaa;">현재 속도: <strong id="type-speed-value">${gameConfig.typeSpeed ?? 50}ms</strong></span>
            </div>
        `;
        editorApp.appendChild(btnSection);

        // 씬 설정 섹션
        const scenesSection = document.createElement('div');
        scenesSection.innerHTML = '<h2>2. 화면별 상세 설정</h2>';
        
        gameConfig.scenes.forEach((scene, index) => {
            const sceneCard = document.createElement('div');
            sceneCard.className = 'editor-card';
            const subtitles = Array.isArray(scene.subtitles)
                ? scene.subtitles
                : (scene.subtitle ? [scene.subtitle] : []);

            const subtitleRowsHtml = subtitles.map((s, subIdx) => {
                const text = s?.text ?? '';
                const fontSize = Number.isFinite(Number(s?.fontSize)) ? Number(s.fontSize) : 24;
                const bottom = Number.isFinite(Number(s?.bottom)) ? Number(s.bottom) : 10;
                const pauseMs = Number.isFinite(Number(s?.pauseMs)) ? Number(s.pauseMs) : 700;
                return `
                    <div class="subtitle-row" style="background:#262626; border:1px solid #3b3b3b; border-radius:8px; padding:12px; margin-top:10px;">
                        <div style="display:flex; justify-content:space-between; align-items:center; gap:10px;">
                            <strong style="color:#ddd;">자막 ${subIdx + 1}</strong>
                            <button type="button" onclick="removeSubtitleLine(${index}, ${subIdx})" style="background:#444; color:#eee; border:none; padding:6px 10px; border-radius:6px; cursor:pointer;">삭제</button>
                        </div>
                        <div class="input-group" style="margin-top:10px;">
                            <label>자막 내용 (줄바꿈: Enter)</label>
                            <textarea class="subtitle-textarea" rows="4" oninput="updateSubtitleLine(${index}, ${subIdx}, 'text', this.value)">${escapeHtml(text)}</textarea>
                        </div>
                        <div style="display:flex; gap:12px;">
                            <div class="input-group" style="flex:1;">
                                <label>글자 크기 (px)</label>
                                <input type="number" value="${fontSize}" onchange="updateSubtitleLine(${index}, ${subIdx}, 'fontSize', parseInt(this.value))">
                            </div>
                            <div class="input-group" style="flex:1;">
                                <label>하단 위치 (%)</label>
                                <input type="number" value="${bottom}" onchange="updateSubtitleLine(${index}, ${subIdx}, 'bottom', parseInt(this.value))">
                            </div>
                            <div class="input-group" style="flex:1;">
                                <label>다음 자막까지 대기 (ms)</label>
                                <input type="number" value="${pauseMs}" onchange="updateSubtitleLine(${index}, ${subIdx}, 'pauseMs', parseInt(this.value))">
                            </div>
                        </div>
                    </div>
                `;
            }).join('');

            sceneCard.innerHTML = `
                <h3 style="color: var(--primary-color)">화면 ${index + 1} (${scene.type})</h3>
                <div class="input-group">
                    <label>이미지 경로 (assets/파일명):</label>
                    <input type="text" value="${escapeAttr(scene.image)}" onchange="updateSceneConfig(${index}, 'image', this.value)">
                </div>
                <div class="input-group">
                    <label>BGM 경로 (assets/파일명):</label>
                    <input type="text" value="${escapeAttr(scene.bgm || '')}" onchange="updateSceneConfig(${index}, 'bgm', this.value)">
                </div>
                ${scene.autoNext !== undefined ? `
                <div class="input-group">
                    <label>화면 전환 대기시간 (ms, 1000=1초):</label>
                    <input type="number" value="${scene.autoNext}" onchange="updateSceneConfig(${index}, 'autoNext', parseInt(this.value))">
                </div>` : ''}

                <div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid #444;">
                    <div style="display:flex; justify-content:space-between; align-items:center; gap:10px;">
                        <label style="font-weight: bold; color: #ddd;">💬 자막 설정 (여러 개 순차 출력)</label>
                        <button type="button" onclick="addSubtitleLine(${index})" style="background: var(--primary-color); color:#fff; border:none; padding:8px 12px; border-radius:8px; cursor:pointer; font-weight:bold;">+ 자막 추가</button>
                    </div>
                    ${subtitleRowsHtml || '<p style="margin-top:10px; color:#aaa; font-size:0.9rem;">자막이 없습니다. “+ 자막 추가”로 만들 수 있어요.</p>'}
                </div>

                ${scene.buttonText !== undefined ? `
                <div class="input-group" style="margin-top: 15px;">
                    <label>중앙 버튼 텍스트:</label>
                    <input type="text" value="${escapeAttr(scene.buttonText)}" onchange="updateSceneConfig(${index}, 'buttonText', this.value)">
                </div>` : ''}
                ${scene.text !== undefined ? `
                <div class="input-group">
                    <label>화면 타이틀 텍스트 (엔딩):</label>
                    <input type="text" value="${escapeAttr(scene.text)}" onchange="updateSceneConfig(${index}, 'text', this.value)">
                </div>` : ''}
            `;
            scenesSection.appendChild(sceneCard);
        });
        editorApp.appendChild(scenesSection);
        
        generateCode();
    }

    window.updateBtnConfig = (prop, val) => {
        gameConfig.button[prop] = val;
        saveAndRender();
    };

    window.updateSceneConfig = (index, prop, val) => {
        gameConfig.scenes[index][prop] = val;
        saveAndRender();
    };

    window.previewTypeSpeed = (val) => {
        const speedEl = document.getElementById('type-speed-value');
        if (speedEl) speedEl.textContent = `${val}ms`;
    };

    window.updateTypeSpeed = (val) => {
        const numericValue = Math.min(200, Math.max(0, parseInt(val, 10) || 0));
        gameConfig.typeSpeed = numericValue;
        saveAndRender();
        window.previewTypeSpeed(numericValue);
    };

    function ensureSubtitlesArray(scene) {
        if (Array.isArray(scene.subtitles)) return scene.subtitles;
        if (scene.subtitle && typeof scene.subtitle === 'object') {
            scene.subtitles = [scene.subtitle];
            delete scene.subtitle;
            return scene.subtitles;
        }
        scene.subtitles = [];
        return scene.subtitles;
    }

    window.addSubtitleLine = (sceneIndex) => {
        const scene = gameConfig.scenes[sceneIndex];
        const arr = ensureSubtitlesArray(scene);
        arr.push({ text: "", fontSize: 24, bottom: 10, pauseMs: 700 });
        saveAndRender();
        renderEditor();
    };

    window.removeSubtitleLine = (sceneIndex, subIndex) => {
        const scene = gameConfig.scenes[sceneIndex];
        const arr = ensureSubtitlesArray(scene);
        arr.splice(subIndex, 1);
        saveAndRender();
        renderEditor();
    };

    window.updateSubtitleLine = (sceneIndex, subIndex, prop, val) => {
        const scene = gameConfig.scenes[sceneIndex];
        const arr = ensureSubtitlesArray(scene);
        if (!arr[subIndex]) arr[subIndex] = { text: "", fontSize: 24, bottom: 10, pauseMs: 700 };
        arr[subIndex][prop] = val;
        saveAndRender();
    };

    function saveAndRender() {
        // 로컬 스토리지 자동 저장
        localStorage.setItem('intro_save_data', JSON.stringify(gameConfig));
        generateCode();
    }

    function generateCode() {
        const code = `const gameConfig = ${JSON.stringify(gameConfig, null, 4)};`;
        outputArea.value = code;
    }

    function getConfigSourceCode() {
        return `const gameConfig = ${JSON.stringify(gameConfig, null, 4)};`;
    }

    const IDB_NAME = 'intro-editor-disk';
    const IDB_STORE = 'kv';
    const IDB_VER = 1;
    const IDB_KEY_CONFIG_HANDLE = 'configJsFileHandle';

    function openIdb() {
        return new Promise((resolve, reject) => {
            const req = indexedDB.open(IDB_NAME, IDB_VER);
            req.onupgradeneeded = (e) => {
                const db = e.target.result;
                if (!db.objectStoreNames.contains(IDB_STORE)) {
                    db.createObjectStore(IDB_STORE);
                }
            };
            req.onsuccess = () => resolve(req.result);
            req.onerror = () => reject(req.error);
        });
    }

    async function idbGet(key) {
        const db = await openIdb();
        try {
            return await new Promise((resolve, reject) => {
                const tx = db.transaction(IDB_STORE, 'readonly');
                const g = tx.objectStore(IDB_STORE).get(key);
                g.onsuccess = () => resolve(g.result);
                g.onerror = () => reject(g.error);
            });
        } finally {
            db.close();
        }
    }

    async function idbPut(key, val) {
        const db = await openIdb();
        try {
            await new Promise((resolve, reject) => {
                const tx = db.transaction(IDB_STORE, 'readwrite');
                tx.objectStore(IDB_STORE).put(val, key);
                tx.oncomplete = () => resolve();
                tx.onerror = () => reject(tx.error);
                tx.onabort = () => reject(tx.error || new Error('abort'));
            });
        } finally {
            db.close();
        }
    }

    async function idbDelete(key) {
        const db = await openIdb();
        try {
            await new Promise((resolve, reject) => {
                const tx = db.transaction(IDB_STORE, 'readwrite');
                tx.objectStore(IDB_STORE).delete(key);
                tx.oncomplete = () => resolve();
                tx.onerror = () => reject(tx.error);
            });
        } finally {
            db.close();
        }
    }

    async function ensureWritePermission(handle) {
        if (!handle || typeof handle.queryPermission !== 'function') return true;
        const opts = { mode: 'readwrite' };
        let p = await handle.queryPermission(opts);
        if (p === 'granted') return true;
        if (typeof handle.requestPermission === 'function') {
            p = await handle.requestPermission(opts);
        }
        return p === 'granted';
    }

    async function trySaveViaLocalServer(code) {
        try {
            const res = await fetch('/api/save-config', {
                method: 'POST',
                headers: { 'Content-Type': 'text/plain; charset=utf-8' },
                body: code,
            });
            if (!res.ok) return null;
            return await res.json();
        } catch {
            return null;
        }
    }

    async function writeConfigWithFileAccessApi(code) {
        if (typeof window.showOpenFilePicker !== 'function') {
            return { ok: false, unsupported: true };
        }

        let handle = await idbGet(IDB_KEY_CONFIG_HANDLE).catch(() => null);
        if (handle && !(await ensureWritePermission(handle))) {
            handle = null;
        }

        if (!handle) {
            try {
                const picked = await window.showOpenFilePicker({
                    types: [{ description: 'config.js', accept: { 'text/javascript': ['.js'] } }],
                    multiple: false,
                });
                handle = picked[0];
                await idbPut(IDB_KEY_CONFIG_HANDLE, handle).catch(() => {});
            } catch (e) {
                if (e && e.name === 'AbortError') return { aborted: true };
                throw e;
            }
        }

        try {
            const writable = await handle.createWritable();
            await writable.write(code);
            await writable.close();
            return { ok: true, fileName: handle.name };
        } catch (e) {
            await idbDelete(IDB_KEY_CONFIG_HANDLE).catch(() => {});
            return { ok: false, writeError: String(e && e.message ? e.message : e) };
        }
    }

    window.downloadConfig = () => {
        const code = `const gameConfig = ${JSON.stringify(gameConfig, null, 4)};`;
        const blob = new Blob([code], { type: 'text/javascript' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'config.js';
        a.click();
        URL.revokeObjectURL(url);
        alert('config.js 파일이 다운로드 되었습니다! js 폴더에 덮어쓰기 하세요.');
    };

    window.saveEditorData = async () => {
        const code = getConfigSourceCode();
        localStorage.setItem('intro_save_data', JSON.stringify(gameConfig));
        generateCode();

        const serverJson = await trySaveViaLocalServer(code);
        if (serverJson && serverJson.ok) {
            alert(`js/config.js 파일에 저장했습니다.\n${serverJson.path || ''}`);
            return;
        }

        try {
            const fsResult = await writeConfigWithFileAccessApi(code);
            if (fsResult.aborted) return;
            if (fsResult.ok) {
                alert(`선택한 파일에 저장했습니다: ${fsResult.fileName || 'config.js'}`);
                return;
            }
            if (fsResult.writeError) {
                alert(`파일 저장에 실패했습니다. 다시 시도하면 config.js를 다시 고르게 됩니다.\n${fsResult.writeError}`);
                return;
            }
        } catch (e) {
            console.error(e);
        }

        alert(
            '이 환경에서는 디스크에 직접 쓸 수 없습니다.\n\n' +
            '【권장】 games/INTRO 폴더에서 run-editor-server.bat 실행 후,\n' +
            '콘솔에 표시되는 주소(예: http://127.0.0.1:47541/editor.html)로 에디터를 연 뒤 저장하세요.\n\n' +
            '【대안】 Chrome/Edge에서 이 페이지를 연 뒤 저장 시 js/config.js를 선택하세요.\n' +
            '(file:// 로 연 경우 파일 선택이 막힐 수 있습니다.)'
        );
    };

    window.forgetConfigFileHandle = async () => {
        try {
            await idbDelete(IDB_KEY_CONFIG_HANDLE);
            alert('연결된 config.js 파일 정보를 지웠습니다. 다음 저장 시 파일을 다시 고르게 됩니다.');
        } catch (e) {
            console.error(e);
            alert('초기화에 실패했습니다.');
        }
    };

    renderEditor();
    
    window.copyConfig = () => {
        outputArea.select();
        document.execCommand('copy');
        alert('설정 코드가 복사되었습니다! js/config.js 파일에 덮어쓰기 하세요.');
    };
});
