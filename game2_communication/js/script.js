document.addEventListener('DOMContentLoaded', () => {
    const ant = document.getElementById('emoji-ant');
    const viewport = document.getElementById('viewport');
    const background = document.getElementById('background');
    const dialogue = document.getElementById('dialogue-content');
    const dialogue2 = document.getElementById('dialogue-content-2');
    const dialogueContainer = document.querySelector('.dialogue-container');
    const bottomUi = document.querySelector('.bottom-ui');
    const bgm = document.getElementById('bgm');
    const bgmStartOverlay = document.getElementById('bgm-start-overlay');
    const sceneFade = document.getElementById('scene-fade');
    const screen1 = document.getElementById('screen-1');
    const screen2 = document.getElementById('screen-2');
    const quizProblem = document.getElementById('quiz-problem');
    const answerInput = document.getElementById('answer-input');
    const submitBtn = document.getElementById('submit-btn');
    const quizHint = document.getElementById('quiz-hint');
    const resultText = document.getElementById('result-text');
    const backBtn = document.getElementById('back-btn');

    let antHalf = 30;
    let bgmPlaySucceeded = false;
    let detachBgmGestureListeners = null;

    function isTouchLikeDevice() {
        return ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
    }

    function hideBgmStartOverlay() {
        if (!bgmStartOverlay) return;
        bgmStartOverlay.classList.add('is-hidden');
        bgmStartOverlay.setAttribute('aria-hidden', 'true');
    }

    function showBgmStartOverlay() {
        if (!bgmStartOverlay) return;
        bgmStartOverlay.classList.remove('is-hidden');
        bgmStartOverlay.setAttribute('aria-hidden', 'false');
    }

    function applyAntConfig(config) {
        const antCfg = config.ant || {};
        const src = antCfg.src || '';
        const size = Number(antCfg.sizePx);
        const s = Number.isFinite(size) ? Math.max(12, size) : 60;

        antHalf = s / 2;

        if (ant) {
            // image mode (preferred)
            if (src) {
                ant.setAttribute('src', src);
            }
            ant.style.width = `${s}px`;
            ant.style.height = `${s}px`;
        }
    }

    function applyGameConfig(config) {
        background.style.backgroundImage = `url('${config.background}')`;
        // bottom-ui removed by request (ignore config.bottomUi / bottomImage)
        if (bottomUi) bottomUi.style.display = 'none';
        applyAntConfig(config);
        dialogue.innerHTML = config.dialogue.text;
        if (dialogue2) {
            dialogue2.innerHTML = config.dialogue.text2 || '';
            dialogue2.style.display = (config.dialogue.text2 && String(config.dialogue.text2).trim() !== '') ? '' : 'none';
        }
        const st = config.dialogue.style;
        dialogueContainer.style.top = st.top;
        if (st.fontSize) {
            dialogue.style.fontSize = st.fontSize;
        }
        if (st.fontSize && dialogue2) {
            dialogue2.style.fontSize = st.fontSize;
        }
        dialogueContainer.style.background = `rgba(0, 0, 0, ${st.opacity})`;
        dialogueContainer.style.backdropFilter = `blur(${st.blur}px)`;

        if (bgm && config.bgm?.enabled) {
            const src = config.bgm?.src || 'assets/BGM.mp3';
            if (bgm.getAttribute('src') !== src) {
                bgm.setAttribute('src', src);
                bgm.load();
            }
            const v = Number(config.bgm?.volume);
            bgm.volume = Number.isFinite(v) ? Math.max(0, Math.min(1, v)) : 0.6;
            bgm.loop = true;
        }

        // Quiz / Result UI
        if (quizProblem) quizProblem.textContent = config.quiz?.problem ?? '';
        if (answerInput) answerInput.placeholder = config.quiz?.placeholder ?? '';
        if (quizHint) quizHint.textContent = config.quiz?.hintText ?? '';
        if (resultText) resultText.textContent = config.resultScene?.text1 ?? '';
        if (backBtn) backBtn.textContent = config.resultScene?.backButtonText ?? '돌아가기';
    }

    function ensureMovementShape(cfg) {
        const m = cfg.movement;
        if (!m) return;
        if (Array.isArray(m.sequences) && m.sequences.length > 0) {
            if (typeof m.fadeOutSeconds !== 'number' || Number.isNaN(m.fadeOutSeconds)) {
                m.fadeOutSeconds = 1;
            }
            return;
        }
        m.sequences = [
            {
                points: [{ xPercent: 0, yPercent: 0 }],
                speed: typeof m.speed === 'number' ? m.speed : 0.6,
                padding: typeof m.padding === 'number' ? m.padding : 0.2,
                blockPadding: typeof m.blockPadding === 'number' ? m.blockPadding : 0
            }
        ];
        m.fadeOutSeconds = 1;
    }

    let sequenceIndex = 0;
    let pointIndex = 0;
    let offsetXPercent = 0;
    let offsetYPercent = 0;
    let posX = 0;
    let posY = 0;
    let isMoving = false;

    function getViewportSize() {
        const r = viewport.getBoundingClientRect();
        return { w: r.width, h: r.height };
    }

    function percentOffsetToPx(ox, oy) {
        const { w, h } = getViewportSize();
        const cx = w / 2 - antHalf;
        const cy = h / 2 - antHalf;
        return {
            x: cx + (ox / 100) * w,
            y: cy + (oy / 100) * h
        };
    }

    function pxToPercentOffset(px, py) {
        const { w, h } = getViewportSize();
        const cx = w / 2 - antHalf;
        const cy = h / 2 - antHalf;
        return {
            ox: w > 0 ? ((px - cx) / w) * 100 : 0,
            oy: h > 0 ? ((py - cy) / h) * 100 : 0
        };
    }

    function clampPxToViewport(x, y) {
        const vRect = viewport.getBoundingClientRect();
        return {
            x: Math.max(20, Math.min(vRect.width - 80, x)),
            y: Math.max(100, Math.min(vRect.height - 200, y))
        };
    }

    function syncFromPercentOffsets() {
        const p = percentOffsetToPx(offsetXPercent, offsetYPercent);
        const c = clampPxToViewport(p.x, p.y);
        posX = c.x;
        posY = c.y;
        const pc = pxToPercentOffset(c.x, c.y);
        offsetXPercent = pc.ox;
        offsetYPercent = pc.oy;
    }

    function getActiveSequence() {
        const seqs = gameConfig.movement?.sequences;
        if (!seqs?.length) return null;
        return seqs[sequenceIndex] ?? seqs[0];
    }

    function clampPercentOffsets() {
        // percentOffset -> px clamp -> percentOffset (to keep internal state consistent)
        syncFromPercentOffsets();
    }

    function seqPointsFromLegacyPattern(seq) {
        const startX = Number.isFinite(seq?.startXPercent) ? seq.startXPercent : 0;
        const startY = Number.isFinite(seq?.startYPercent) ? seq.startYPercent : 0;
        const step = Number.isFinite(seq?.stepPercent) ? seq.stepPercent : 10;
        const pattern = Array.isArray(seq?.pattern) ? seq.pattern : [];
        let x = startX;
        let y = startY;
        const pts = [{ xPercent: x, yPercent: y }];
        for (const cmd of pattern) {
            switch (cmd) {
                case '상': y -= step; break;
                case '하': y += step; break;
                case '좌': x -= step; break;
                case '우': x += step; break;
                default: break;
            }
            pts.push({ xPercent: x, yPercent: y });
        }
        return pts;
    }

    function getSequencePoints(seq) {
        if (!seq) return [];
        if (Array.isArray(seq.points) && seq.points.length > 0) {
            return seq.points
                .map((p) => ({ xPercent: Number(p?.xPercent), yPercent: Number(p?.yPercent) }))
                .filter((p) => Number.isFinite(p.xPercent) && Number.isFinite(p.yPercent));
        }
        if (Array.isArray(seq.pattern) && seq.pattern.length > 0) {
            return seqPointsFromLegacyPattern(seq);
        }
        return [];
    }

    function setOffsetsToPoint(p) {
        offsetXPercent = p?.xPercent ?? 0;
        offsetYPercent = p?.yPercent ?? 0;
        clampPercentOffsets();
    }

    function resetMovementState() {
        ensureMovementShape(gameConfig);
        sequenceIndex = 0;
        pointIndex = 0;
        const seq = getActiveSequence();
        const pts = getSequencePoints(seq);
        if (pts.length > 0) {
            setOffsetsToPoint(pts[0]);
            pointIndex = 1;
        } else {
            setOffsetsToPoint({ xPercent: 0, yPercent: 0 });
            pointIndex = 0;
        }
        updateAntPosition(true);
    }

    function updateAntPosition(instant = false) {
        const seq = getActiveSequence();
        const dur = seq?.speed ?? 0.6;
        const ease = 'cubic-bezier(0.4, 0, 0.2, 1)';
        if (instant) {
            ant.style.transition = 'none';
        } else {
            ant.style.transition = `left ${dur}s ${ease}, top ${dur}s ${ease}`;
        }
        ant.style.left = `${posX}px`;
        ant.style.top = `${posY}px`;

        if (!instant) {
            createFootprint(posX + antHalf, posY + antHalf);
        }
    }

    function createFootprint(x, y) {
        const dot = document.createElement('div');
        dot.className = 'footprint';
        dot.style.left = `${x}px`;
        dot.style.top = `${y}px`;
        viewport.appendChild(dot);
        setTimeout(() => {
            dot.style.opacity = '0';
        }, 500);
        setTimeout(() => {
            dot.remove();
        }, 1000);
    }

    function clearFootprints() {
        viewport.querySelectorAll('.footprint').forEach((el) => el.remove());
    }

    function sleep(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }

    async function runSceneFade() {
        const sec = Math.max(0.05, gameConfig.movement.fadeOutSeconds ?? 1);
        const ms = sec * 1000;

        if (sceneFade) {
            sceneFade.style.transition = 'none';
            sceneFade.style.opacity = '0';
            void sceneFade.offsetWidth;
            sceneFade.style.transition = `opacity ${sec}s linear`;
            sceneFade.style.opacity = '1';
            await sleep(ms);
        }

        clearFootprints();
        sequenceIndex = 0;
        pointIndex = 0;
        const seq = getActiveSequence();
        const pts = getSequencePoints(seq);
        if (pts.length > 0) {
            setOffsetsToPoint(pts[0]);
            pointIndex = 1;
        } else {
            setOffsetsToPoint({ xPercent: 0, yPercent: 0 });
            pointIndex = 0;
        }
        updateAntPosition(true);

        if (sceneFade) {
            sceneFade.style.transition = `opacity ${sec}s linear`;
            sceneFade.style.opacity = '0';
            await sleep(ms);
            sceneFade.style.transition = 'none';
        }
    }

    function normalizeAnswer(s, caseInsensitive) {
        const t = String(s ?? '').trim();
        return caseInsensitive ? t.toLowerCase() : t;
    }

    function showScreen(which) {
        if (!screen1 || !screen2) return;
        if (which === 2) {
            screen1.classList.remove('active');
            screen2.classList.add('active');
        } else {
            screen2.classList.remove('active');
            screen1.classList.add('active');
        }
    }

    async function startMovement() {
        if (isMoving) return;
        isMoving = true;

        while (isMoving) {
            ensureMovementShape(gameConfig);
            const sequences = gameConfig.movement.sequences;
            if (!sequences?.length) {
                await sleep(500);
                continue;
            }

            const seq = sequences[sequenceIndex];
            const points = getSequencePoints(seq);
            if (!seq || points.length === 0) {
                // skip invalid block
                sequenceIndex = (sequenceIndex + 1) % sequences.length;
                pointIndex = 0;
                await sleep(200);
                continue;
            }

            // If we just entered this block, ensure we're at its first point
            if (pointIndex === 0) {
                setOffsetsToPoint(points[0]);
                updateAntPosition(true);
                pointIndex = 1;
                const blockPad = typeof seq.blockPadding === 'number' ? seq.blockPadding : 0;
                if (blockPad > 0) await sleep(blockPad * 1000);
                continue;
            }

            if (pointIndex >= points.length) {
                // Block done -> move to next block (with optional block padding) or fade loop
                const blockPad = typeof seq.blockPadding === 'number' ? seq.blockPadding : 0;
                if (blockPad > 0) await sleep(blockPad * 1000);

                if (sequenceIndex + 1 >= sequences.length) {
                    await runSceneFade();
                } else {
                    sequenceIndex += 1;
                    pointIndex = 0;
                }
                continue;
            }

            // Move to next absolute point
            setOffsetsToPoint(points[pointIndex]);
            updateAntPosition(false);

            const spd = typeof seq.speed === 'number' ? seq.speed : 0.6;
            const pad = typeof seq.padding === 'number' ? seq.padding : 0.2;
            await sleep((spd + pad) * 1000);
            pointIndex += 1;
        }
    }

    window.applyGame2HintConfig = (config) => {
        const cfg = config || gameConfig;
        ensureMovementShape(cfg);
        applyGameConfig(cfg);
    };
    window.game2HintResetAnt = () => resetMovementState();

    ensureMovementShape(gameConfig);
    applyGameConfig(gameConfig);
    resetMovementState();
    setTimeout(startMovement, 1000);

    // BGM: 모바일 자동재생 제한 대응 (성공할 때까지 제스처에서 재시도)
    async function tryPlayBgm() {
        if (bgmPlaySucceeded) return;
        if (!bgm) return;
        if (!gameConfig.bgm?.enabled) return;
        if (!bgm.getAttribute('src')) return;
        try {
            await bgm.play();
            bgmPlaySucceeded = true;
            hideBgmStartOverlay();
            if (typeof detachBgmGestureListeners === 'function') {
                detachBgmGestureListeners();
                detachBgmGestureListeners = null;
            }
        } catch {
            // ignore - will be retried on next user gesture
        }
    }

    function attachBgmGestureUnlock() {
        const opts = { capture: true, passive: true };
        const onGesture = () => { void tryPlayBgm(); };
        document.addEventListener('pointerdown', onGesture, opts);
        document.addEventListener('touchend', onGesture, opts);
        document.addEventListener('click', onGesture, opts);
        document.addEventListener('keydown', onGesture, opts);

        detachBgmGestureListeners = () => {
            document.removeEventListener('pointerdown', onGesture, opts);
            document.removeEventListener('touchend', onGesture, opts);
            document.removeEventListener('click', onGesture, opts);
            document.removeEventListener('keydown', onGesture, opts);
        };
    }

    if (gameConfig.bgm?.enabled) {
        attachBgmGestureUnlock();
        if (isTouchLikeDevice()) showBgmStartOverlay();
        if (bgmStartOverlay) {
            bgmStartOverlay.addEventListener('click', () => { void tryPlayBgm(); });
            bgmStartOverlay.addEventListener('touchend', () => { void tryPlayBgm(); }, { passive: true });
        }
        void tryPlayBgm();
    }

    // Quiz events
    function submitAnswer() {
        const cfg = gameConfig.quiz || {};
        const input = normalizeAnswer(answerInput?.value, cfg.caseInsensitive !== false);
        const ans = normalizeAnswer(cfg.answer, cfg.caseInsensitive !== false);
        if (input && input === ans) {
            showScreen(2);
        } else {
            if (quizHint) quizHint.textContent = cfg.wrongMessage ?? '틀렸습니다.';
            if (answerInput) {
                answerInput.value = '';
                answerInput.focus();
            }
        }
    }

    if (submitBtn) {
        submitBtn.addEventListener('click', () => {
            tryPlayBgm();
            submitAnswer();
        });
    }
    if (answerInput) {
        answerInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                tryPlayBgm();
                submitAnswer();
            }
        });
    }
    if (backBtn) {
        backBtn.addEventListener('click', () => {
            tryPlayBgm();
            showScreen(1);
            if (answerInput) {
                answerInput.value = '';
                answerInput.focus();
            }
        });
    }
});
