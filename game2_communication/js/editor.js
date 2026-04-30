const form = document.getElementById('editor-form');
const codePreview = document.getElementById('code-preview');

function defaultMovementBlock() {
    return {
        points: [
            { xPercent: 0, yPercent: 0 },
            { xPercent: 0, yPercent: 8 },
            { xPercent: 8, yPercent: 8 },
            { xPercent: 8, yPercent: 0 },
            { xPercent: 0, yPercent: 0 },
        ],
        speed: 0.6,
        padding: 0.2,
        blockPadding: 0.2,
    };
}

function ensureMovementEditor() {
    const m = gameConfig.movement;
    if (!m) {
        gameConfig.movement = {};
    }
    const mv = gameConfig.movement;
    if (!Array.isArray(mv.sequences)) {
        mv.sequences = [];
    }
    if (mv.sequences.length === 0) {
        mv.sequences.push(defaultMovementBlock());
    }
    if (typeof mv.fadeOutSeconds !== 'number' || Number.isNaN(mv.fadeOutSeconds)) {
        mv.fadeOutSeconds = 1;
    }
}

function escapeAttr(s) {
    return String(s)
        .replace(/&/g, '&amp;')
        .replace(/"/g, '&quot;')
        .replace(/</g, '&lt;');
}

function renderMovementSection() {
    ensureMovementEditor();
    const mv = gameConfig.movement;
    const seqs = mv.sequences;
    const blocks = seqs
        .map(
            (seq, i) => `
        <div class="movement-block">
            <div class="movement-block-head">
                <strong>움직임 블록 ${i + 1}</strong>
                <button type="button" class="btn-small btn-del" onclick="removeMovementBlock(${i})" ${seqs.length <= 1 ? 'disabled' : ''}>삭제</button>
            </div>
            <div class="form-group">
                <label>패턴 (좌표) — 예: (0,0),(0,8),(8,8)</label>
                <textarea rows="3" oninput="updateSeqPointsText(${i}, this.value)">${escapeAttr(pointsToText(seq.points))}</textarea>
            </div>
            <div class="form-group">
                <label>이동 속도 (초)</label>
                <input type="number" step="0.05" value="${seq.speed ?? 0.6}" oninput="updateSeqNumber(${i}, 'speed', this)">
            </div>
            <div class="form-group">
                <label>이동 후 패딩 (초) — 다음 좌표로 가기 전 대기</label>
                <input type="number" step="0.05" value="${seq.padding ?? 0.2}" oninput="updateSeqNumber(${i}, 'padding', this)">
            </div>
            <div class="form-group">
                <label>블록 패딩 (초) — 이 블록이 끝난 뒤 다음 블록 시작 전 대기</label>
                <input type="number" step="0.05" value="${seq.blockPadding ?? 0.2}" oninput="updateSeqNumber(${i}, 'blockPadding', this)">
            </div>
        </div>
    `
        )
        .join('');

    return `
        <h3>움직임 설정 (순서대로 실행 → 전부 끝나면 검정 페이드 후 처음부터)</h3>
        <p style="color:#888;font-size:0.85rem;margin:-8px 0 16px;line-height:1.55;">
            좌표는 모두 <strong>%</strong>이며, <strong>뷰포트 정중앙이 (0, 0)</strong>입니다. (오른쪽/아래 +)
            입력한 좌표를 <strong>순서대로</strong> 이동합니다. 첫 좌표는 시작 위치로 사용됩니다.
        </p>
        <div class="form-group">
            <label>씬 전환 페이드 (초) — 검정으로 뜨는 시간과 다시 밝아지는 시간에 동일 적용</label>
            <input type="number" step="0.05" min="0.05" value="${mv.fadeOutSeconds ?? 1}" oninput="updateFadeOutSeconds(this)">
        </div>
        <div class="btn-row" style="margin-bottom:16px;">
            <button type="button" class="btn-small btn-add" onclick="addMovementBlock()">+ 움직임 블록 추가</button>
        </div>
        ${blocks}
    `;
}

function renderForm() {
    ensureMovementEditor();
    form.innerHTML = `
        <h2>game2 (힌트 페이지) 설정</h2>
        
        <div class="form-group">
            <label>페이지 제목</label>
            <input type="text" value="${escapeAttr(gameConfig.title)}" oninput="updateConfig('title', this.value)">
        </div>

        <div class="form-group">
            <label>배경 이미지 경로</label>
            <input type="text" value="${escapeAttr(gameConfig.background)}" oninput="updateConfig('background', this.value)">
        </div>

        <div class="form-group">
            <label>하단 이미지 경로</label>
            <input type="text" value="${escapeAttr(gameConfig.bottomImage)}" oninput="updateConfig('bottomImage', this.value)">
        </div>

        <div class="form-group">
            <label>이모지</label>
            <input type="text" value="${escapeAttr(gameConfig.emoji)}" oninput="updateConfig('emoji', this.value)">
        </div>

        <div class="form-group">
            <label>개미 이미지 경로 (예: assets/순찰개미.png)</label>
            <input type="text" value="${escapeAttr(gameConfig.ant?.src ?? 'assets/순찰개미.png')}" oninput="updateAnt('src', this.value)">
        </div>
        <div class="form-group">
            <label>개미 크기 (px)</label>
            <input type="number" step="1" value="${Number.isFinite(Number(gameConfig.ant?.sizePx)) ? Number(gameConfig.ant.sizePx) : 60}" oninput="updateAntNumber('sizePx', this.value)">
        </div>

        <hr style="margin: 30px 0; border-color: #333;">

        <h3>대사 설정</h3>
        <div class="form-group">
            <label>대사 텍스트 (HTML 가능)</label>
            <textarea oninput="updateNested('dialogue', 'text', this.value)">${gameConfig.dialogue.text}</textarea>
        </div>
        <div class="form-group">
            <label>대사 텍스트 2 (HTML 가능)</label>
            <textarea oninput="updateNested('dialogue', 'text2', this.value)">${gameConfig.dialogue.text2 ?? ''}</textarea>
        </div>
        <div class="form-group">
            <label>상단 위치 (예: 15%)</label>
            <input type="text" value="${escapeAttr(gameConfig.dialogue.style.top)}" oninput="updateNestedStyle('dialogue', 'top', this.value)">
        </div>
        <div class="form-group">
            <label>블러 강도 (px)</label>
            <input type="number" value="${gameConfig.dialogue.style.blur}" oninput="updateNestedStyle('dialogue', 'blur', Number(this.value))">
        </div>

        <hr style="margin: 30px 0; border-color: #333;">

        <h3>문제 입력(정답) 설정</h3>
        <div class="form-group">
            <label>문제 문구</label>
            <textarea oninput="updateNested('quiz', 'problem', this.value)">${gameConfig.quiz?.problem ?? ''}</textarea>
        </div>
        <div class="form-group">
            <label>입력 placeholder</label>
            <input type="text" value="${escapeAttr(gameConfig.quiz?.placeholder ?? '')}" oninput="updateNested('quiz', 'placeholder', this.value)">
        </div>
        <div class="form-group">
            <label>정답</label>
            <input type="text" value="${escapeAttr(gameConfig.quiz?.answer ?? '')}" oninput="updateNested('quiz', 'answer', this.value)">
        </div>
        <div class="form-group">
            <label>오답 메시지 (틀렸을 때)</label>
            <input type="text" value="${escapeAttr(gameConfig.quiz?.wrongMessage ?? '')}" oninput="updateNested('quiz', 'wrongMessage', this.value)">
        </div>
        <div class="form-group">
            <label>힌트/안내 텍스트 (입력 박스 아래)</label>
            <input type="text" value="${escapeAttr(gameConfig.quiz?.hintText ?? '')}" oninput="updateNested('quiz', 'hintText', this.value)">
        </div>
        <div class="form-group">
            <label>대소문자 무시 (true/false)</label>
            <input type="text" value="${escapeAttr(String(gameConfig.quiz?.caseInsensitive ?? true))}" oninput="updateQuizCaseInsensitive(this.value)">
        </div>

        <hr style="margin: 30px 0; border-color: #333;">

        <h3>정답 화면(화면2) 설정</h3>
        <div class="form-group">
            <label>텍스트1</label>
            <textarea oninput="updateNested('resultScene', 'text1', this.value)">${gameConfig.resultScene?.text1 ?? ''}</textarea>
        </div>
        <div class="form-group">
            <label>돌아가기 버튼 텍스트</label>
            <input type="text" value="${escapeAttr(gameConfig.resultScene?.backButtonText ?? '')}" oninput="updateNested('resultScene', 'backButtonText', this.value)">
        </div>

        <hr style="margin: 30px 0; border-color: #333;">

        ${renderMovementSection()}
    `;
    updateCodePreview();
}

function updateConfig(prop, val) {
    gameConfig[prop] = val;
    refreshApp();
}

function updateNested(parent, prop, val) {
    if (parent === 'quiz') ensureQuiz();
    if (parent === 'resultScene') ensureResultScene();
    gameConfig[parent][prop] = val;
    refreshApp({ resetAnt: parent === 'movement' });
}

function updateNestedStyle(parent, prop, val) {
    gameConfig[parent].style[prop] = val;
    refreshApp();
}

function ensureAnt() {
    if (!gameConfig.ant || typeof gameConfig.ant !== 'object') {
        gameConfig.ant = { src: 'assets/순찰개미.png', sizePx: 60 };
    }
}

function updateAnt(prop, val) {
    ensureAnt();
    gameConfig.ant[prop] = val;
    refreshApp({ resetAnt: true });
}

function updateAntNumber(prop, val) {
    ensureAnt();
    const n = Number(val);
    if (Number.isFinite(n)) {
        gameConfig.ant[prop] = n;
        refreshApp({ resetAnt: true });
    }
}
function ensureQuiz() {
    if (!gameConfig.quiz || typeof gameConfig.quiz !== 'object') {
        gameConfig.quiz = { problem: '', placeholder: '', answer: '', caseInsensitive: true, wrongMessage: '', hintText: '' };
    }
}

function ensureResultScene() {
    if (!gameConfig.resultScene || typeof gameConfig.resultScene !== 'object') {
        gameConfig.resultScene = { text1: '', backButtonText: '돌아가기' };
    }
}

function updateQuizCaseInsensitive(val) {
    ensureQuiz();
    const t = String(val).trim().toLowerCase();
    gameConfig.quiz.caseInsensitive = !(t === 'false' || t === '0' || t === 'no');
    refreshApp();
}

function updateFadeOutSeconds(input) {
    const n = Number(input.value);
    gameConfig.movement.fadeOutSeconds = Number.isFinite(n) && n >= 0.05 ? n : 1;
    refreshApp();
}

function pointsToText(points) {
    if (!Array.isArray(points) || points.length === 0) return '(0,0)';
    return points
        .map((p) => {
            const x = Number(p?.xPercent);
            const y = Number(p?.yPercent);
            const xs = Number.isFinite(x) ? x : 0;
            const ys = Number.isFinite(y) ? y : 0;
            return `(${xs},${ys})`;
        })
        .join(',');
}

function parsePointsText(text) {
    const t = String(text || '');
    const re = /\(\s*([-+]?\d*\.?\d+)\s*,\s*([-+]?\d*\.?\d+)\s*\)/g;
    const pts = [];
    let m;
    while ((m = re.exec(t))) {
        const x = Number(m[1]);
        const y = Number(m[2]);
        if (Number.isFinite(x) && Number.isFinite(y)) {
            pts.push({ xPercent: x, yPercent: y });
        }
    }
    if (pts.length > 0) return pts;

    // also allow "x,y" per line
    const alt = t
        .split(/\r?\n/)
        .map((s) => s.trim())
        .filter(Boolean)
        .map((line) => line.split(',').map((v) => v.trim()));
    const pts2 = [];
    for (const [xRaw, yRaw] of alt) {
        const x = Number(xRaw);
        const y = Number(yRaw);
        if (Number.isFinite(x) && Number.isFinite(y)) {
            pts2.push({ xPercent: x, yPercent: y });
        }
    }
    return pts2.length > 0 ? pts2 : [{ xPercent: 0, yPercent: 0 }];
}

function updateSeqPointsText(index, val) {
    ensureMovementEditor();
    const seq = gameConfig.movement.sequences[index];
    if (!seq) return;
    seq.points = parsePointsText(val);
    refreshApp({ resetAnt: true });
}

function updateSeqNumber(index, key, input) {
    ensureMovementEditor();
    const seq = gameConfig.movement.sequences[index];
    if (!seq) return;
    const n = Number(input.value);
    if (key === 'speed') seq[key] = Number.isFinite(n) ? n : 0.6;
    else if (key === 'padding') seq[key] = Number.isFinite(n) ? n : 0.2;
    else if (key === 'blockPadding') seq[key] = Number.isFinite(n) ? n : 0.2;
    else seq[key] = Number.isFinite(n) ? n : 0;
    refreshApp({ resetAnt: true });
}

function addMovementBlock() {
    ensureMovementEditor();
    gameConfig.movement.sequences.push(defaultMovementBlock());
    renderForm();
    refreshApp({ resetAnt: true });
}

function removeMovementBlock(index) {
    ensureMovementEditor();
    if (gameConfig.movement.sequences.length <= 1) return;
    gameConfig.movement.sequences.splice(index, 1);
    renderForm();
    refreshApp({ resetAnt: true });
}

function refreshApp(opts = {}) {
    updateCodePreview();
    if (typeof window.applyGame2HintConfig === 'function') {
        window.applyGame2HintConfig(gameConfig);
    }
    if (opts.resetAnt && typeof window.game2HintResetAnt === 'function') {
        window.game2HintResetAnt();
    }
}

function updateCodePreview() {
    if (codePreview) {
        codePreview.textContent = `const gameConfig = ${JSON.stringify(gameConfig, null, 4)};`;
    }
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
        alert('서버 오류: run-editor-server.bat를 확인하세요.');
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
