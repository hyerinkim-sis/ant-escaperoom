document.addEventListener('DOMContentLoaded', () => {
    const gameContainer = document.getElementById('game-container');
    const bgmPlayer = document.getElementById('bgm-player');
    
    // Quiz Elements
    const quizScreen = document.getElementById('quiz-screen');
    const quizText = document.getElementById('quiz-text');
    const quizTopText = document.getElementById('quiz-top-text');
    const quizProblem = document.getElementById('quiz-problem');
    const answerInput = document.getElementById('answer-input');
    const submitBtn = document.getElementById('submit-btn');
    const quizCard = quizScreen ? quizScreen.querySelector('.card') : null;

    // List Elements
    const listScreen = document.getElementById('list-screen');
    const listContent = document.getElementById('list-content');
    const backBtn = document.getElementById('back-btn');

    let audioStarted = false;
    let quizBackgroundUrl = '';

    function escapeHtml(s) {
        return String(s)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    }

    // Initialize Game
    function init() {
        // Set Title
        document.title = gameConfig.title;

        // Load Quiz Content
        // 기존 quizScene.text는 호환용(있으면 topText.text로 사용)
        const legacyText = gameConfig.quizScene && typeof gameConfig.quizScene.text === 'string' ? gameConfig.quizScene.text : '';
        const top = (gameConfig.quizScene && gameConfig.quizScene.topText) ? gameConfig.quizScene.topText : { text: legacyText, style: {} };
        const topText = (top && typeof top.text === 'string') ? top.text : legacyText;
        if (quizTopText) {
            quizTopText.textContent = topText || '';
            const st = (top && top.style) ? top.style : {};
            if (typeof st.x === 'number') quizTopText.style.left = `${st.x}%`;
            if (typeof st.y === 'number') quizTopText.style.top = `${st.y}%`;
            if (typeof st.fontSize === 'number') quizTopText.style.fontSize = `${Math.max(8, st.fontSize)}px`;
            if (st.color) quizTopText.style.color = String(st.color);
            if (st.align) quizTopText.style.textAlign = String(st.align);
            const ow = Number(st.outlineWidth);
            const oc = st.outlineColor ? String(st.outlineColor) : '#000000';
            if (Number.isFinite(ow) && ow > 0) {
                quizTopText.style.webkitTextStroke = `${ow}px ${oc}`;
                // text-stroke 미지원 브라우저 대비(간단 외곽선)
                const w = Math.max(1, Math.round(ow));
                quizTopText.style.textShadow = [
                    `${w}px 0 ${oc}`,
                    `-${w}px 0 ${oc}`,
                    `0 ${w}px ${oc}`,
                    `0 -${w}px ${oc}`,
                    `${w}px ${w}px ${oc}`,
                    `-${w}px ${w}px ${oc}`,
                    `${w}px -${w}px ${oc}`,
                    `-${w}px -${w}px ${oc}`,
                    `0 10px 22px rgba(0,0,0,0.6)`,
                ].join(', ');
            } else {
                quizTopText.style.webkitTextStroke = '';
                quizTopText.style.textShadow = '0 10px 22px rgba(0,0,0,0.6)';
            }
        }
        // 카드 안의 기존 텍스트는 비워서(또는 그대로 둬도 됨) “상단 텍스트”를 분리
        quizText.textContent = '';
        quizProblem.textContent = gameConfig.quizScene.problem;

        // 카드(퀴즈 박스) 레이아웃/디자인
        if (quizCard && gameConfig.quizScene && gameConfig.quizScene.cardStyle) {
            const cs = gameConfig.quizScene.cardStyle || {};
            const num = (v, fb) => (Number.isFinite(Number(v)) ? Number(v) : fb);
            const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
            const x = clamp(num(cs.x, 50), 0, 100);
            const y = clamp(num(cs.y, 58), 0, 100);
            const w = clamp(num(cs.widthPercent, 86), 20, 100);
            const pad = Math.max(0, num(cs.padding, 40));
            const rad = Math.max(0, num(cs.radius, 24));
            const bgA = clamp(num(cs.bgOpacity, 0.28), 0, 1);
            const blur = Math.max(0, num(cs.blur, 10));
            const borderA = clamp(num(cs.borderOpacity, 0.12), 0, 1);

            quizCard.style.position = 'absolute';
            quizCard.style.left = `${x}%`;
            quizCard.style.top = `${y}%`;
            quizCard.style.transform = 'translate(-50%, -50%)';
            quizCard.style.width = `${w}%`;
            quizCard.style.maxWidth = '';
            quizCard.style.padding = `${pad}px`;
            quizCard.style.borderRadius = `${rad}px`;
            quizCard.style.background = `rgba(0,0,0,${bgA})`;
            quizCard.style.backdropFilter = `blur(${blur}px)`;
            quizCard.style.webkitBackdropFilter = `blur(${blur}px)`;
            quizCard.style.borderColor = `rgba(255,255,255,${borderA})`;
            quizCard.style.animation = 'none';
        }

        quizBackgroundUrl = gameConfig.quizScene.backgroundImage || '';
        gameContainer.style.backgroundImage = quizBackgroundUrl ? `url(${quizBackgroundUrl})` : '';

        // Set BGM (재생은 사용자 제스처 후 — 첫 화면에서도 가능)
        bgmPlayer.src = gameConfig.bgm || '';
        bgmPlayer.volume = typeof gameConfig.bgmVolume === 'number' ? gameConfig.bgmVolume : 1;

        // Render List Items
        renderList();
        applyListLayoutVars();

        // 첫 화면(퀴즈)에서도 BGM: 클릭/터치 또는 입력 포커스 시 1회 재생 시도
        const tryStartBgm = () => startAudio();
        quizScreen.addEventListener('pointerdown', tryStartBgm, { passive: true });
        answerInput.addEventListener('focus', tryStartBgm, { passive: true });
    }

    function applyListLayoutVars() {
        const layout = (gameConfig.listScene && gameConfig.listScene.layout) ? gameConfig.listScene.layout : {};
        const textStyle = (gameConfig.listScene && gameConfig.listScene.textStyle) ? gameConfig.listScene.textStyle : {};

        const px = (n, fallback) => `${Math.max(0, Number.isFinite(n) ? n : fallback)}px`;

        listScreen.style.setProperty('--list-container-pad-top', px(layout.containerPaddingTop, 32));
        listScreen.style.setProperty('--list-container-pad-x', px(layout.containerPaddingX, 16));
        listScreen.style.setProperty('--list-container-pad-bottom', px(layout.containerPaddingBottom, 16));
        listScreen.style.setProperty('--list-item-gap', px(layout.itemGap, 40));
        listScreen.style.setProperty('--list-image-text-gap', px(layout.imageTextGap, 20));
        listScreen.style.setProperty('--list-text-pad-x', px(layout.textPaddingX, 20));

        const fontSize = Number(textStyle.fontSize);
        if (Number.isFinite(fontSize)) listScreen.style.setProperty('--list-text-size', `${Math.max(8, fontSize)}px`);
        if (textStyle.color) listScreen.style.setProperty('--list-text-color', String(textStyle.color));
        if (textStyle.align) listScreen.style.setProperty('--list-text-align', String(textStyle.align));
    }

    function renderList() {
        listContent.innerHTML = '';
        const items = Array.isArray(gameConfig.listScene.items) ? gameConfig.listScene.items : [];
        items.forEach((item, index) => {
            const itemEl = document.createElement('div');
            itemEl.className = 'list-item';
            itemEl.style.animationDelay = `${index * 0.1}s`;
            const imgPath = (item.image || '').trim();
            const text = item.text != null ? String(item.text) : '';
            const parts = [];
            if (imgPath) {
                parts.push(`<img src="${escapeHtml(imgPath)}" alt="">`);
            }
            if (text.trim()) {
                parts.push(`<div class="list-item-text">${escapeHtml(text)}</div>`);
            }
            itemEl.innerHTML = parts.length ? parts.join('') : '<div class="list-item-text">(내용 없음)</div>';
            listContent.appendChild(itemEl);
        });
        backBtn.textContent = gameConfig.listScene.backButtonText || '돌아가기';
    }

    function applyListScreenBackground() {
        const path = (gameConfig.listScene.backgroundImage || '').trim();
        if (path) {
            listScreen.style.backgroundImage = `url(${path})`;
            listScreen.classList.add('list-screen--has-bg');
        } else {
            listScreen.style.backgroundImage = '';
            listScreen.classList.remove('list-screen--has-bg');
        }
    }

    function startAudio() {
        if (!audioStarted) {
            if (bgmPlayer.src) {
                bgmPlayer.play().catch((err) => console.log('Audio play deferred', err));
            }
            audioStarted = true;
        }
    }

    submitBtn.addEventListener('click', () => {
        startAudio();
        const input = answerInput.value.trim().toLowerCase();
        if (input === gameConfig.quizScene.answer.toLowerCase()) {
            transitionTo(listScreen);
        } else {
            alert("틀렸습니다! 다시 생각해보세요.");
            answerInput.value = '';
            answerInput.focus();
        }
    });

    answerInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            submitBtn.click();
        }
    });

    backBtn.addEventListener('click', () => {
        startAudio();
        answerInput.value = '';
        transitionTo(quizScreen);
        answerInput.focus();
    });

    function transitionTo(newScreen) {
        // Hide all screens
        document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
        // Show new screen
        newScreen.classList.add('active');

        if (newScreen === listScreen) {
            // 퀴즈 배경이 비치지 않도록: 컨테이너 배경 제거 + 결과 화면만의 배경
            gameContainer.style.backgroundImage = 'none';
            applyListScreenBackground();
            applyListLayoutVars();
            listScreen.scrollTop = 0;
            const scrollArea = listScreen.querySelector('.list-scroll-area');
            if (scrollArea) scrollArea.scrollTop = 0;
        } else if (newScreen === quizScreen) {
            gameContainer.style.backgroundImage = quizBackgroundUrl ? `url(${quizBackgroundUrl})` : '';
            listScreen.style.backgroundImage = '';
            listScreen.classList.remove('list-screen--has-bg');
        }
    }

    init();
});
