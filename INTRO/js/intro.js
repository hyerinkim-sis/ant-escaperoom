document.addEventListener('DOMContentLoaded', () => {
    const app = document.getElementById('app');
    const audioPlayer = new Audio();
    audioPlayer.loop = true;

    let bgmVideoEl = null;
    let audioPlaybackUnlocked = false;
    
    let currentSceneIndex = 0;
    let autoNextTimeout = null;
    let typingTimeout = null;
    let currentTypingToken = 0;
    let currentBgmPath = "";

    /** 상대 경로의 한글·공백 등을 URL에 안전하게 넣기 */
    function encodeAssetPath(path) {
        if (!path) return '';
        return path.split('/').map((seg) => encodeURIComponent(seg)).join('/');
    }

    const LOBBY_IMAGE_FALLBACKS = ['assets/로비.png', 'assets/로비이미지.png'];

    function applySceneBackground(sceneEl, primaryPath) {
        const ordered = [];
        if (primaryPath) ordered.push(primaryPath);
        LOBBY_IMAGE_FALLBACKS.forEach((p) => {
            if (p && !ordered.includes(p)) ordered.push(p);
        });

        let i = 0;
        const tryNext = () => {
            if (i >= ordered.length) {
                sceneEl.style.backgroundImage = 'none';
                sceneEl.style.backgroundColor = 'black';
                return;
            }
            const candidate = ordered[i];
            const encoded = encodeAssetPath(candidate);
            const probe = new Image();
            probe.onload = () => {
                sceneEl.style.backgroundImage = `url('${encoded}')`;
                sceneEl.style.backgroundColor = '';
            };
            probe.onerror = () => {
                i += 1;
                tryNext();
            };
            probe.src = encoded;
        };
        tryNext();
    }

    function ensureBgmVideo() {
        if (!bgmVideoEl) {
            bgmVideoEl = document.createElement('video');
            bgmVideoEl.setAttribute('playsinline', '');
            bgmVideoEl.setAttribute('webkit-playsinline', '');
            // iOS/Safari에서 오디오 포함 video는 첫 play가 까다로워서,
            // 최초 재생은 muted로 성공시킨 뒤(gesture 안에서) unmute 하는 전략을 사용한다.
            bgmVideoEl.muted = true;
            bgmVideoEl.loop = true;
            bgmVideoEl.preload = 'auto';
            bgmVideoEl.style.position = 'fixed';
            bgmVideoEl.style.left = '0';
            bgmVideoEl.style.top = '0';
            bgmVideoEl.style.width = '1px';
            bgmVideoEl.style.height = '1px';
            bgmVideoEl.style.opacity = '0.01';
            bgmVideoEl.style.pointerEvents = 'none';
            document.body.appendChild(bgmVideoEl);
        }
        return bgmVideoEl;
    }

    function pauseBgmVideo() {
        if (bgmVideoEl) {
            bgmVideoEl.pause();
            bgmVideoEl.removeAttribute('src');
            bgmVideoEl.load();
        }
    }

    function unlockAudioPlayback() {
        if (audioPlaybackUnlocked) return;
        audioPlaybackUnlocked = true;
        if (audioPlayer.src) {
            audioPlayer.preload = 'auto';
            audioPlayer.play().catch(() => {});
        }
        if (bgmVideoEl && bgmVideoEl.src) {
            // 첫 gesture에서 muted로 play 성공 → 곧바로 unmute
            bgmVideoEl.muted = true;
            const p = bgmVideoEl.play();
            if (p && typeof p.then === 'function') {
                p.then(() => {
                    bgmVideoEl.muted = false;
                }).catch(() => {});
            } else {
                setTimeout(() => { bgmVideoEl.muted = false; }, 0);
            }
        }
    }

    (function bindAudioUnlockGestures() {
        const onFirstGesture = () => {
            document.body.removeEventListener('pointerdown', onFirstGesture, true);
            document.body.removeEventListener('touchstart', onFirstGesture, true);
            document.body.removeEventListener('keydown', onFirstGesture, true);
            unlockAudioPlayback();
        };
        document.body.addEventListener('pointerdown', onFirstGesture, { capture: true });
        document.body.addEventListener('touchstart', onFirstGesture, { capture: true });
        document.body.addEventListener('keydown', onFirstGesture, { capture: true });
    })();

    // CSS 변수 적용 (버튼 애니메이션)
    const root = document.documentElement;
    root.style.setProperty('--float-distance', gameConfig.button.floatDistance);
    root.style.setProperty('--float-duration', gameConfig.button.floatDuration);

    function createSceneElement(scene, index) {
        const sceneEl = document.createElement('div');
        sceneEl.className = 'scene';
        sceneEl.id = `scene-${index}`;
        
        if (scene.image) {
            if (scene.type === 'lobby') {
                applySceneBackground(sceneEl, scene.image);
            } else {
                sceneEl.style.backgroundImage = `url('${encodeAssetPath(scene.image)}')`;
            }
        } else {
            sceneEl.style.backgroundImage = 'none';
            sceneEl.style.backgroundColor = 'black';
        }

        const overlay = document.createElement('div');
        overlay.className = 'overlay';
        sceneEl.appendChild(overlay);

        if (scene.type === 'ending' && scene.text) {
            const textEl = document.createElement('div');
            textEl.className = 'scene-text';
            textEl.textContent = scene.text;
            sceneEl.appendChild(textEl);
        }

        if (scene.buttonText) {
            const btn = document.createElement('button');
            btn.className = 'btn-floating';
            btn.textContent = scene.buttonText;
            btn.onclick = () => {
                unlockAudioPlayback();
                nextScene();
            };
            sceneEl.appendChild(btn);
        }

        // 자막 추가: subtitle(단일) + subtitles(복수) 모두 지원
        const subtitleEntries = [];
        if (Array.isArray(scene.subtitles)) {
            scene.subtitles.forEach((s) => {
                if (s && typeof s === 'object' && typeof s.text === 'string') subtitleEntries.push(s);
            });
        } else if (scene.subtitle && typeof scene.subtitle.text === 'string') {
            subtitleEntries.push(scene.subtitle);
        }

        if (subtitleEntries.length > 0) {
            const sub = document.createElement('div');
            sub.className = 'subtitle';
            sub.textContent = '';
            sub._introSubtitleEntries = subtitleEntries;
            sceneEl.appendChild(sub);
        }

        return sceneEl;
    }

    function playBgm(path) {
        if (!path) {
            audioPlayer.pause();
            pauseBgmVideo();
            currentBgmPath = "";
            return;
        }

        const encoded = encodeAssetPath(path);
        const isMp4 = /\.mp4$/i.test(path);

        if (isMp4) {
            audioPlayer.pause();
            const video = ensureBgmVideo();
            if (currentBgmPath !== path) {
                video.src = encoded;
                currentBgmPath = path;
            }
            // iOS에서 음소거 상태로 시작하면 성공률이 높음
            if (!audioPlaybackUnlocked) video.muted = true;
            const p = video.play();
            if (p && typeof p.then === 'function') {
                p.then(() => {
                    if (audioPlaybackUnlocked) video.muted = false;
                }).catch((e) => console.log('BGM video play failed:', e));
            } else {
                if (audioPlaybackUnlocked) video.muted = false;
            }
        } else {
            pauseBgmVideo();
            if (currentBgmPath !== path) {
                audioPlayer.src = encoded;
                currentBgmPath = path;
            }
            audioPlayer.play().catch((e) => console.log('BGM audio play failed:', e));
        }
    }

    function clearSceneTimers() {
        if (autoNextTimeout) {
            clearTimeout(autoNextTimeout);
            autoNextTimeout = null;
        }
        if (typingTimeout) {
            clearTimeout(typingTimeout);
            typingTimeout = null;
        }
    }

    function getTypeSpeed(scene) {
        const sceneSpeed = scene?.subtitle?.typeSpeed;
        const globalSpeed = gameConfig.typeSpeed;
        const speed = Number(sceneSpeed ?? globalSpeed ?? 50);
        if (Number.isNaN(speed)) return 50;
        return Math.min(200, Math.max(0, speed));
    }

    function getSubtitlePauseMs(sceneData, entry) {
        const v = Number(entry?.pauseMs ?? sceneData?.subtitlePauseMs ?? gameConfig.subtitlePauseMs ?? 700);
        if (Number.isNaN(v)) return 700;
        return Math.min(10000, Math.max(0, v));
    }

    function runTypewriterOnElement(subtitleEl, sceneData, token, text, onComplete) {
        const fullText = String(text ?? '');
        const typeSpeed = getTypeSpeed(sceneData);

        if (typeSpeed === 0) {
            subtitleEl.textContent = fullText;
            onComplete();
            return;
        }

        subtitleEl.textContent = '';
        let currentCharIndex = 0;

        const typeNextChar = () => {
            if (token !== currentTypingToken) return;
            if (currentCharIndex >= fullText.length) {
                onComplete();
                return;
            }

            subtitleEl.textContent += fullText[currentCharIndex];
            currentCharIndex += 1;
            typingTimeout = setTimeout(typeNextChar, typeSpeed);
        };

        typeNextChar();
    }

    function runSubtitleSequence(sceneEl, sceneData, token, onComplete) {
        const subtitleEl = sceneEl.querySelector('.subtitle');
        if (!subtitleEl) {
            onComplete();
            return;
        }

        const entries = Array.isArray(subtitleEl._introSubtitleEntries) ? subtitleEl._introSubtitleEntries : [];
        if (entries.length === 0) {
            onComplete();
            return;
        }

        let idx = 0;
        const runNext = () => {
            if (token !== currentTypingToken) return;
            if (idx >= entries.length) {
                onComplete();
                return;
            }

            const entry = entries[idx];
            subtitleEl.style.fontSize = ((entry.fontSize ?? 24) + 'px');
            subtitleEl.style.bottom = ((entry.bottom ?? 10) + '%');
            runTypewriterOnElement(subtitleEl, sceneData, token, entry.text, () => {
                if (token !== currentTypingToken) return;
                idx += 1;
                const pauseMs = getSubtitlePauseMs(sceneData, entry);
                typingTimeout = setTimeout(runNext, pauseMs);
            });
        };

        runNext();
    }

    function scheduleAutoNext(sceneData) {
        if (sceneData.autoNext > 0) {
            autoNextTimeout = setTimeout(() => {
                nextScene();
            }, sceneData.autoNext);
        }
    }

    function renderScene(index) {
        const scenes = document.querySelectorAll('.scene');
        scenes.forEach(s => s.classList.remove('active'));
        
        const currentSceneData = gameConfig.scenes[index];
        const currentSceneEl = document.getElementById(`scene-${index}`);
        
        if (currentSceneEl) {
            currentSceneEl.classList.add('active');
            playBgm(currentSceneData.bgm);
            clearSceneTimers();
            currentTypingToken += 1;
            const typingToken = currentTypingToken;

            runSubtitleSequence(currentSceneEl, currentSceneData, typingToken, () => {
                if (typingToken !== currentTypingToken) return;
                scheduleAutoNext(currentSceneData);
            });
        }
    }

    function nextScene() {
        currentSceneIndex++;
        if (currentSceneIndex >= gameConfig.scenes.length) {
            currentSceneIndex = 0; // 처음으로 루프 (7번 화면에서 버튼 누르면 1번으로)
        }
        renderScene(currentSceneIndex);
    }

    // 초기화
    gameConfig.scenes.forEach((scene, index) => {
        app.appendChild(createSceneElement(scene, index));
    });

    renderScene(0);
});
