const form = document.getElementById('editor-form');
const codePreview = document.getElementById('code-preview');

// Live preview elements (editor.html에 있을 때만 존재)
const pvTabQuiz = document.getElementById('pv-tab-quiz');
const pvTabList = document.getElementById('pv-tab-list');
const pvQuiz = document.getElementById('pv-quiz');
const pvList = document.getElementById('pv-list');
const pvQuizBg = document.getElementById('pv-quiz-bg');
const pvListBg = document.getElementById('pv-list-bg');
const pvTopText = document.getElementById('pv-topText');
const pvProblem = document.getElementById('pv-problem');
const pvItems = document.getElementById('pv-items');
const pvCard = document.getElementById('pv-card');

function renderForm() {
    form.innerHTML = `
        <h2>SCENE1 콘텐츠 설정</h2>
        
        <div class="form-group">
            <label>게임 제목</label>
            <input type="text" value="${gameConfig.title}" oninput="updateConfig('title', this.value)">
        </div>

        <div class="form-group">
            <label>BGM 경로 (assets/bgm.mp3)</label>
            <input type="text" value="${gameConfig.bgm}" oninput="updateConfig('bgm', this.value)">
        </div>

        <hr style="margin: 30px 0; border-color: #333;">

        <h3>[화면 1] 퀴즈 화면</h3>
        <div class="form-group">
            <label>상단 텍스트(분리 표시)</label>
            <input type="text" value="${(gameConfig.quizScene.topText && gameConfig.quizScene.topText.text) ? gameConfig.quizScene.topText.text : (gameConfig.quizScene.text || '')}" oninput="updateQuizTopText(this.value)">
        </div>
        <div class="form-group">
            <label>상단 텍스트 X(%) / Y(%)</label>
            <div style="display:flex; gap:10px;">
                <input type="number" step="0.1" min="0" max="100" value="${getQuizTopStyle('x', 50)}" oninput="updateQuizTopStyle('x', this.value)">
                <input type="number" step="0.1" min="0" max="100" value="${getQuizTopStyle('y', 12)}" oninput="updateQuizTopStyle('y', this.value)">
            </div>
        </div>
        <div class="form-group">
            <label>상단 텍스트 크기(px) / 색상</label>
            <div style="display:flex; gap:10px; align-items:center;">
                <input type="number" step="1" min="8" value="${getQuizTopStyle('fontSize', 34)}" oninput="updateQuizTopStyle('fontSize', this.value)">
                <input type="color" value="${getQuizTopStyle('color', '#ffffff')}" oninput="updateQuizTopStyle('color', this.value)">
            </div>
        </div>
        <div class="form-group">
            <label>상단 텍스트 외곽선(px) / 외곽선 색상</label>
            <div style="display:flex; gap:10px; align-items:center;">
                <input type="number" step="1" min="0" value="${getQuizTopStyle('outlineWidth', 0)}" oninput="updateQuizTopStyle('outlineWidth', this.value)">
                <input type="color" value="${getQuizTopStyle('outlineColor', '#000000')}" oninput="updateQuizTopStyle('outlineColor', this.value)">
            </div>
        </div>
        <div class="form-group">
            <label>상단 텍스트 정렬</label>
            <select onchange="updateQuizTopStyle('align', this.value)">
                <option value="left" ${getQuizTopStyle('align', 'center') === 'left' ? 'selected' : ''}>왼쪽</option>
                <option value="center" ${getQuizTopStyle('align', 'center') === 'center' ? 'selected' : ''}>가운데</option>
                <option value="right" ${getQuizTopStyle('align', 'center') === 'right' ? 'selected' : ''}>오른쪽</option>
            </select>
        </div>
        <div class="form-group">
            <label>문제 내용</label>
            <input type="text" value="${gameConfig.quizScene.problem}" oninput="updateNested('quizScene', 'problem', this.value)">
        </div>
        <div class="form-group">
            <label>정답 (소문자 판별)</label>
            <input type="text" value="${gameConfig.quizScene.answer}" oninput="updateNested('quizScene', 'answer', this.value)">
        </div>
        <div class="form-group">
            <label>배경 이미지</label>
            <input type="text" value="${gameConfig.quizScene.backgroundImage}" oninput="updateNested('quizScene', 'backgroundImage', this.value)">
        </div>

        <h4 style="margin: 10px 0 12px;">퀴즈 박스(카드) 위치/크기/디자인</h4>
        <div class="form-group">
            <label>카드 X(%) / Y(%)</label>
            <div style="display:flex; gap:10px;">
                <input type="number" step="0.1" min="0" max="100" value="${getQuizCard('x', 50)}" oninput="updateQuizCard('x', this.value)">
                <input type="number" step="0.1" min="0" max="100" value="${getQuizCard('y', 58)}" oninput="updateQuizCard('y', this.value)">
            </div>
        </div>
        <div class="form-group">
            <label>카드 너비(%)</label>
            <input type="number" step="1" min="20" max="100" value="${getQuizCard('widthPercent', 86)}" oninput="updateQuizCard('widthPercent', this.value)">
        </div>
        <div class="form-group">
            <label>패딩(px) / 둥글기(px)</label>
            <div style="display:flex; gap:10px;">
                <input type="number" step="1" min="0" value="${getQuizCard('padding', 40)}" oninput="updateQuizCard('padding', this.value)">
                <input type="number" step="1" min="0" value="${getQuizCard('radius', 24)}" oninput="updateQuizCard('radius', this.value)">
            </div>
        </div>
        <div class="form-group">
            <label>배경 투명도(0~1) / 블러(px)</label>
            <div style="display:flex; gap:10px;">
                <input type="number" step="0.01" min="0" max="1" value="${getQuizCard('bgOpacity', 0.28)}" oninput="updateQuizCard('bgOpacity', this.value)">
                <input type="number" step="1" min="0" value="${getQuizCard('blur', 10)}" oninput="updateQuizCard('blur', this.value)">
            </div>
        </div>
        <div class="form-group">
            <label>테두리 투명도(0~1)</label>
            <input type="number" step="0.01" min="0" max="1" value="${getQuizCard('borderOpacity', 0.12)}" oninput="updateQuizCard('borderOpacity', this.value)">
        </div>

        <hr style="margin: 30px 0; border-color: #333;">

        <h3>[화면 2] 정답 후 결과 화면 (세로 정렬)</h3>
        <div class="form-group">
            <label>결과 화면 배경 이미지 (비우면 어두운 단색)</label>
            <input type="text" value="${gameConfig.listScene.backgroundImage || ''}" oninput="updateNested('listScene', 'backgroundImage', this.value)">
        </div>
        <div class="form-group">
            <label>이미지/텍스트 간격, 아이템 간격, 바깥 패딩(px)</label>
            <div style="display:flex; gap:10px; flex-wrap:wrap;">
                <input type="number" min="0" step="1" value="${getListLayout('imageTextGap', 20)}" oninput="updateListLayout('imageTextGap', this.value)" placeholder="이미지-텍스트 간격">
                <input type="number" min="0" step="1" value="${getListLayout('itemGap', 40)}" oninput="updateListLayout('itemGap', this.value)" placeholder="아이템 간격">
                <input type="number" min="0" step="1" value="${getListLayout('containerPaddingTop', 32)}" oninput="updateListLayout('containerPaddingTop', this.value)" placeholder="상단 패딩">
                <input type="number" min="0" step="1" value="${getListLayout('containerPaddingX', 16)}" oninput="updateListLayout('containerPaddingX', this.value)" placeholder="좌우 패딩">
                <input type="number" min="0" step="1" value="${getListLayout('containerPaddingBottom', 16)}" oninput="updateListLayout('containerPaddingBottom', this.value)" placeholder="하단 패딩">
                <input type="number" min="0" step="1" value="${getListLayout('textPaddingX', 20)}" oninput="updateListLayout('textPaddingX', this.value)" placeholder="텍스트 좌우 패딩">
            </div>
        </div>
        <div class="form-group">
            <label>텍스트 크기(px) / 색상 / 정렬</label>
            <div style="display:flex; gap:10px; align-items:center; flex-wrap:wrap;">
                <input type="number" min="8" step="1" value="${getListTextStyle('fontSize', 22)}" oninput="updateListTextStyle('fontSize', this.value)">
                <input type="color" value="${getListTextStyle('color', '#f5f5f5')}" oninput="updateListTextStyle('color', this.value)">
                <select onchange="updateListTextStyle('align', this.value)">
                    <option value="left" ${getListTextStyle('align', 'center') === 'left' ? 'selected' : ''}>왼쪽</option>
                    <option value="center" ${getListTextStyle('align', 'center') === 'center' ? 'selected' : ''}>가운데</option>
                    <option value="right" ${getListTextStyle('align', 'center') === 'right' ? 'selected' : ''}>오른쪽</option>
                </select>
            </div>
        </div>
        <div id="items-list">
            ${gameConfig.listScene.items.map((item, index) => `
                <div class="item-row">
                    <button class="remove-btn" onclick="removeItem(${index})">삭제</button>
                    <div class="form-group">
                        <label>이미지 경로</label>
                        <input type="text" value="${item.image}" oninput="updateItem(${index}, 'image', this.value)">
                    </div>
                    <div class="form-group">
                        <label>설명 텍스트</label>
                        <input type="text" value="${item.text}" oninput="updateItem(${index}, 'text', this.value)">
                    </div>
                </div>
            `).join('')}
        </div>
        <button class="add-btn" onclick="addItem()">+ 아이템 추가</button>

        <div class="form-group" style="margin-top: 20px;">
            <label>뒤로가기 버튼 텍스트</label>
            <input type="text" value="${gameConfig.listScene.backButtonText}" oninput="updateNested('listScene', 'backButtonText', this.value)">
        </div>
    `;
    updateCodePreview();
}

function ensureQuizTop() {
    gameConfig.quizScene = gameConfig.quizScene || {};
    if (!gameConfig.quizScene.topText) {
        gameConfig.quizScene.topText = { text: gameConfig.quizScene.text || '', style: { x: 50, y: 12, fontSize: 34, color: '#ffffff', align: 'center', outlineWidth: 0, outlineColor: '#000000' } };
    }
    if (!gameConfig.quizScene.topText.style) {
        gameConfig.quizScene.topText.style = { x: 50, y: 12, fontSize: 34, color: '#ffffff', align: 'center', outlineWidth: 0, outlineColor: '#000000' };
    }
}

function ensureQuizCard() {
    gameConfig.quizScene = gameConfig.quizScene || {};
    if (!gameConfig.quizScene.cardStyle) {
        gameConfig.quizScene.cardStyle = { x: 50, y: 58, widthPercent: 86, padding: 40, radius: 24, bgOpacity: 0.28, blur: 10, borderOpacity: 0.12 };
    }
}

function getQuizCard(key, fallback) {
    ensureQuizCard();
    const v = gameConfig.quizScene.cardStyle[key];
    return (v === undefined || v === null || v === '') ? fallback : v;
}

function updateQuizCard(key, val) {
    ensureQuizCard();
    gameConfig.quizScene.cardStyle[key] = Number(val);
    updateCodePreview();
}

function getQuizTopStyle(key, fallback) {
    ensureQuizTop();
    const v = gameConfig.quizScene.topText.style[key];
    return (v === undefined || v === null || v === '') ? fallback : v;
}

function updateQuizTopText(val) {
    ensureQuizTop();
    gameConfig.quizScene.topText.text = val;
    // legacy 필드도 같이 맞춰두면 예전 코드/호환에도 안전
    gameConfig.quizScene.text = val;
    updateCodePreview();
}

function updateQuizTopStyle(key, val) {
    ensureQuizTop();
    if (key === 'x' || key === 'y') gameConfig.quizScene.topText.style[key] = Number(val);
    else if (key === 'fontSize') gameConfig.quizScene.topText.style[key] = Number(val);
    else if (key === 'outlineWidth') gameConfig.quizScene.topText.style[key] = Number(val);
    else gameConfig.quizScene.topText.style[key] = val;
    updateCodePreview();
}

function ensureListLayout() {
    gameConfig.listScene = gameConfig.listScene || { items: [] };
    gameConfig.listScene.layout = gameConfig.listScene.layout || {};
    gameConfig.listScene.textStyle = gameConfig.listScene.textStyle || {};
}

function getListLayout(key, fallback) {
    ensureListLayout();
    const v = gameConfig.listScene.layout[key];
    return (v === undefined || v === null || v === '') ? fallback : v;
}

function updateListLayout(key, val) {
    ensureListLayout();
    gameConfig.listScene.layout[key] = Number(val);
    updateCodePreview();
}

function getListTextStyle(key, fallback) {
    ensureListLayout();
    const v = gameConfig.listScene.textStyle[key];
    return (v === undefined || v === null || v === '') ? fallback : v;
}

function updateListTextStyle(key, val) {
    ensureListLayout();
    if (key === 'fontSize') gameConfig.listScene.textStyle[key] = Number(val);
    else gameConfig.listScene.textStyle[key] = val;
    updateCodePreview();
}

function updateConfig(prop, val) {
    gameConfig[prop] = val;
    updateCodePreview();
}

function updateNested(parent, prop, val) {
    gameConfig[parent][prop] = val;
    updateCodePreview();
}

function updateItem(index, prop, val) {
    gameConfig.listScene.items[index][prop] = val;
    updateCodePreview();
}

function addItem() {
    gameConfig.listScene.items.push({ image: 'assets/item_image.png', text: '새로운 유물 설명' });
    renderForm();
}

function removeItem(index) {
    gameConfig.listScene.items.splice(index, 1);
    renderForm();
}

window.setPreviewScreen = function setPreviewScreen(which) {
    if (!pvQuiz || !pvList) return;
    const isQuiz = which === 'quiz';
    pvQuiz.classList.toggle('active', isQuiz);
    pvList.classList.toggle('active', !isQuiz);
    if (pvTabQuiz) pvTabQuiz.classList.toggle('active', isQuiz);
    if (pvTabList) pvTabList.classList.toggle('active', !isQuiz);
};

function clamp(n, lo, hi) {
    return Math.min(hi, Math.max(lo, n));
}

function percentFromPx(px, sizePx) {
    if (!sizePx) return 0;
    return (px / sizePx) * 100;
}

function setupDragToUpdatePercent(el, getXY, setXY) {
    if (!el) return;
    el.style.pointerEvents = 'auto';
    el.style.cursor = 'grab';

    let dragging = false;
    let start = null;

    const onDown = (e) => {
        dragging = true;
        el.setPointerCapture(e.pointerId);
        el.style.cursor = 'grabbing';
        const rect = el.parentElement.getBoundingClientRect();
        start = { rect, pointerId: e.pointerId };
        e.preventDefault();
    };

    const onMove = (e) => {
        if (!dragging || !start) return;
        const { rect } = start;
        const xPct = clamp(percentFromPx(e.clientX - rect.left, rect.width), 0, 100);
        const yPct = clamp(percentFromPx(e.clientY - rect.top, rect.height), 0, 100);
        setXY(xPct, yPct);
    };

    const onUp = (e) => {
        if (!dragging) return;
        dragging = false;
        el.style.cursor = 'grab';
        try { el.releasePointerCapture(e.pointerId); } catch {}
        start = null;
    };

    el.addEventListener('pointerdown', onDown);
    el.addEventListener('pointermove', onMove);
    el.addEventListener('pointerup', onUp);
    el.addEventListener('pointercancel', onUp);
}

function renderLivePreview() {
    if (!pvQuizBg || !pvTopText || !pvProblem || !pvItems || !pvListBg) return;

    // 1화면
    pvQuizBg.style.backgroundImage = gameConfig.quizScene.backgroundImage ? `url(${gameConfig.quizScene.backgroundImage})` : '';
    const top = (gameConfig.quizScene && gameConfig.quizScene.topText) ? gameConfig.quizScene.topText : { text: (gameConfig.quizScene.text || ''), style: {} };
    const st = (top && top.style) ? top.style : {};
    pvTopText.textContent = top.text || '';
    pvTopText.style.left = `${Number.isFinite(Number(st.x)) ? Number(st.x) : 50}%`;
    pvTopText.style.top = `${Number.isFinite(Number(st.y)) ? Number(st.y) : 12}%`;
    pvTopText.style.fontSize = `${Math.max(8, Number(st.fontSize) || 34)}px`;
    pvTopText.style.color = st.color || '#ffffff';
    pvTopText.style.textAlign = st.align || 'center';

    const ow = Number(st.outlineWidth);
    const oc = st.outlineColor || '#000000';
    if (Number.isFinite(ow) && ow > 0) {
        pvTopText.style.webkitTextStroke = `${ow}px ${oc}`;
        const w = Math.max(1, Math.round(ow));
        pvTopText.style.textShadow = [
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
        pvTopText.style.webkitTextStroke = '';
        pvTopText.style.textShadow = '0 10px 22px rgba(0,0,0,0.6)';
    }
    pvProblem.textContent = gameConfig.quizScene.problem || '';

    // 카드(퀴즈 박스) 미리보기
    if (pvCard) {
        ensureQuizCard();
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

        pvCard.style.left = `${x}%`;
        pvCard.style.top = `${y}%`;
        pvCard.style.width = `${w}%`;
        pvCard.style.padding = `${pad}px`;
        pvCard.style.borderRadius = `${rad}px`;
        pvCard.style.background = `rgba(0,0,0,${bgA})`;
        pvCard.style.backdropFilter = `blur(${blur}px)`;
        pvCard.style.borderColor = `rgba(255,255,255,${borderA})`;
    }

    // 2화면
    pvListBg.style.backgroundImage = (gameConfig.listScene && gameConfig.listScene.backgroundImage) ? `url(${gameConfig.listScene.backgroundImage})` : '';
    const layout = (gameConfig.listScene && gameConfig.listScene.layout) ? gameConfig.listScene.layout : {};
    const textStyle = (gameConfig.listScene && gameConfig.listScene.textStyle) ? gameConfig.listScene.textStyle : {};

    pvItems.style.gap = `${Math.max(0, Number(layout.itemGap) || 40)}px`;
    pvItems.style.padding = `${Math.max(0, Number(layout.containerPaddingTop) || 32)}px ${Math.max(0, Number(layout.containerPaddingX) || 16)}px ${Math.max(0, Number(layout.containerPaddingBottom) || 16)}px`;

    pvItems.innerHTML = '';
    (gameConfig.listScene.items || []).forEach((it) => {
        const el = document.createElement('div');
        el.className = 'pv-item';
        el.style.gap = `${Math.max(0, Number(layout.imageTextGap) || 20)}px`;

        if (it.image) {
            const img = document.createElement('img');
            img.src = it.image;
            img.alt = '';
            el.appendChild(img);
        }
        if (it.text) {
            const t = document.createElement('div');
            t.className = 'pv-itemText';
            t.textContent = it.text;
            t.style.padding = `0 ${Math.max(0, Number(layout.textPaddingX) || 20)}px`;
            t.style.fontSize = `${Math.max(8, Number(textStyle.fontSize) || 22)}px`;
            t.style.color = textStyle.color || '#f5f5f5';
            t.style.textAlign = textStyle.align || 'center';
            t.style.lineHeight = '1.5';
            el.appendChild(t);
        }

        pvItems.appendChild(el);
    });
}

function updateCodePreview() {
    codePreview.textContent = `const gameConfig = ${JSON.stringify(gameConfig, null, 4)};`;
    renderLivePreview();
}

async function saveConfig() {
    const code = `const gameConfig = ${JSON.stringify(gameConfig, null, 4)};`;
    try {
        const res = await fetch('/api/save-config', {
            method: 'POST',
            headers: { 'Content-Type': 'text/plain; charset=utf-8' },
            body: code
        });
        const data = await res.json();
        if (data.ok) {
            alert('성공적으로 저장되었습니다!');
        } else {
            alert('저장 실패: ' + data.error);
        }
    } catch (e) {
        alert('서버가 실행 중이지 않거나 오류가 발생했습니다. run-editor-server.bat를 실행했는지 확인하세요.');
    }
}

function downloadConfig() {
    const code = `const gameConfig = ${JSON.stringify(gameConfig, null, 4)};`;
    const blob = new Blob([code], { type: 'text/javascript' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'config.js';
    a.click();
}

renderForm();
try { renderLivePreview(); } catch (e) { /* ignore */ }

// 미리보기에서 드래그로 위치 조정(상단 텍스트 / 카드)
setupDragToUpdatePercent(pvTopText, 
    () => ({ x: getQuizTopStyle('x', 50), y: getQuizTopStyle('y', 12) }),
    (x, y) => { updateQuizTopStyle('x', x); updateQuizTopStyle('y', y); }
);
setupDragToUpdatePercent(pvCard,
    () => ({ x: getQuizCard('x', 50), y: getQuizCard('y', 58) }),
    (x, y) => { updateQuizCard('x', x); updateQuizCard('y', y); }
);
