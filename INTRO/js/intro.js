document.addEventListener('DOMContentLoaded', () => {
    const app = document.getElementById('app');
    const audioPlayer = new Audio();
    audioPlayer.loop = true;
    audioPlayer.preload = 'auto';

    let bgmVideoEl = null;
    let audioPlaybackUnlocked = false;
    
    let currentSceneIndex = 0;
    let autoNextTimeout = null;
    let typingTimeout = null;
    let currentTypingToken = 0;
    let currentBgmPath = "";
    let transitionInProgress = false;
    let audioFadeRaf = null;
    let currentAudioFadeToken = 0;

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

    function getTransitionMs(key, fallback) {
        const v = Number(gameConfig?.transition?.[key] ?? fallback);
        if (Number.isNaN(v)) return fallback;
        return Math.min(30000, Math.max(0, Math.floor(v)));
    }

    function getCurrentBgmMedia() {
        if (bgmVideoEl && bgmVideoEl.src) return bgmVideoEl;
        if (audioPlayer && audioPlayer.src) return audioPlayer;
        return null;
    }

    function setMediaVolume(media, vol) {
        if (!media) return;
        const v = Math.min(1, Math.max(0, Number(vol)));
        if (Number.isNaN(v)) return;
        media.volume = v;
    }

    function cancelAudioFade() {
        if (audioFadeRaf) cancelAnimationFrame(audioFadeRaf);
        audioFadeRaf = null;
        currentAudioFadeToken += 1;
    }

    function fadeMediaVolumeTo(media, targetVolume, durationMs) {
        if (!media) return Promise.resolve();
        const token = currentAudioFadeToken;

        const from = Number(media.volume);
        const to = Math.min(1, Math.max(0, Number(targetVolume)));
        const dur = Math.min(30000, Math.max(0, Math.floor(Number(durationMs) || 0)));

        if (Number.isNaN(from) || Number.isNaN(to)) return Promise.resolve();
        if (dur === 0) {
            setMediaVolume(media, to);
            return Promise.resolve();
        }

        const start = performance.now();
        return new Promise((resolve) => {
            const step = (now) => {
                if (token !== currentAudioFadeToken) return resolve();
                const t = Math.min(1, Math.max(0, (now - start) / dur));
                const eased = t < 0.5 ? (2 * t * t) : (1 - Math.pow(-2 * t + 2, 2) / 2); // easeInOutQuad
                setMediaVolume(media, from + (to - from) * eased);
                if (t >= 1) return resolve();
                audioFadeRaf = requestAnimationFrame(step);
            };
            audioFadeRaf = requestAnimationFrame(step);
        });
    }

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
            // 첫 렌더 프레임부터 위치가 튀지 않도록(중앙에 잠깐 뜨는 현상 방지)
            // 첫 자막의 스타일(하단/글자크기)을 미리 적용한다.
            const first = subtitleEntries[0] || {};
            if (first && typeof first === 'object') {
                if (first.fontSize != null) sub.style.fontSize = (first.fontSize + 'px');
                if (first.bottom != null) sub.style.bottom = (first.bottom + '%');
            }
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

    async function transitionBgm(nextPath, { fadeOutMs, fadeInMs } = {}) {
        const outMs = Math.min(30000, Math.max(0, Math.floor(Number(fadeOutMs) || 0)));
        const inMs = Math.min(30000, Math.max(0, Math.floor(Number(fadeInMs) || 0)));

        const currentMedia = getCurrentBgmMedia();
        if (!nextPath) {
            cancelAudioFade();
            if (currentMedia) await fadeMediaVolumeTo(currentMedia, 0, outMs);
            playBgm("");
            return;
        }

        if (currentBgmPath === nextPath) {
            // 같은 BGM이면 유지 (단, 볼륨이 0 근처면 페이드 인)
            if (currentMedia && currentMedia.volume < 0.05) {
                cancelAudioFade();
                await fadeMediaVolumeTo(currentMedia, 1, inMs);
            }
            return;
        }

        cancelAudioFade();
        if (currentMedia) await fadeMediaVolumeTo(currentMedia, 0, outMs);

        playBgm(nextPath);

        const nextMedia = getCurrentBgmMedia();
        if (nextMedia) {
            setMediaVolume(nextMedia, 0);
            // autoplay가 막히면 실패해도, gesture 이후 unlockAudioPlayback()에서 재생 시도됨
            await fadeMediaVolumeTo(nextMedia, 1, inMs);
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

        // 자막 시작 전에 첫 엔트리의 위치/스타일을 즉시 반영해서
        // 장면 전환 직후 한 프레임이라도 잘못된 위치(중앙 등)에 뜨지 않게 한다.
        const first = entries[0] || {};
        subtitleEl.style.fontSize = ((first.fontSize ?? 24) + 'px');
        subtitleEl.style.bottom = ((first.bottom ?? 10) + '%');

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

    function setSceneActive(sceneEl, active, fadeMs) {
        if (!sceneEl) return;
        const ms = Math.min(30000, Math.max(0, Math.floor(Number(fadeMs) || 0)));
        sceneEl.style.transitionDuration = `${ms}ms`;
        if (active) {
            sceneEl.classList.add('active');
        } else {
            sceneEl.classList.remove('active');
        }
    }

    function afterMs(ms) {
        const t = Math.min(30000, Math.max(0, Math.floor(Number(ms) || 0)));
        if (t === 0) return Promise.resolve();
        return new Promise((resolve) => setTimeout(resolve, t));
    }

    async function renderScene(index, { immediate = false } = {}) {
        const scenes = document.querySelectorAll('.scene');
        const prevIndex = currentSceneIndex;
        const prevSceneEl = document.getElementById(`scene-${prevIndex}`);
        const nextSceneEl = document.getElementById(`scene-${index}`);

        const nextSceneData = gameConfig.scenes[index];
        if (!nextSceneEl || !nextSceneData) return;

        const imageOutMs = getTransitionMs('imageFadeOutMs', 800);
        const imageInMs = getTransitionMs('imageFadeInMs', 800);
        const audioOutMs = getTransitionMs('audioFadeOutMs', 800);
        const audioInMs = getTransitionMs('audioFadeInMs', 800);

        // 초기 0번 씬은 가능한 즉시 보여주고, 오디오는 페이드 인(autoplay 실패해도 gesture로 이어짐)
        if (immediate) {
            scenes.forEach(s => s.classList.remove('active'));
            setSceneActive(nextSceneEl, true, imageInMs);
            setMediaVolume(getCurrentBgmMedia(), 1);
            await transitionBgm(nextSceneData.bgm, { fadeOutMs: 0, fadeInMs: audioInMs });
        } else {
            if (transitionInProgress) return;
            transitionInProgress = true;

            // 이미지 페이드 아웃 → 씬 스위치 → 이미지 페이드 인
            if (prevSceneEl && prevSceneEl !== nextSceneEl) {
                setSceneActive(prevSceneEl, false, imageOutMs);
            } else {
                // 동일 씬일 때는 전체를 끄지 않음
                scenes.forEach(s => s.classList.remove('active'));
            }

            // 오디오는 동시에 페이드 처리
            const audioPromise = transitionBgm(nextSceneData.bgm, { fadeOutMs: audioOutMs, fadeInMs: audioInMs });
            await afterMs(imageOutMs);

            scenes.forEach(s => s.classList.remove('active'));
            setSceneActive(nextSceneEl, true, imageInMs);
            await Promise.all([audioPromise, afterMs(imageInMs)]);

            transitionInProgress = false;
        }

        clearSceneTimers();
        currentTypingToken += 1;
        const typingToken = currentTypingToken;

        runSubtitleSequence(nextSceneEl, nextSceneData, typingToken, () => {
            if (typingToken !== currentTypingToken) return;
            scheduleAutoNext(nextSceneData);
        });
    }

    function nextScene() {
        if (transitionInProgress) return;
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

    renderScene(0, { immediate: true });
});
