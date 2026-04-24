/**
 * 인트로 에디터용 로컬 서버: editor.html 정적 제공 + POST 시 js/config.js 덮어쓰기
 * 실행: node scripts/save-config-server.cjs
 * 브라우저: 표시된 주소의 /editor.html 로 접속 후 [저장하기] 사용
 */
/* eslint-disable no-console */
const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const INTRO_ROOT = path.resolve(__dirname, '..');
const CONFIG_PATH = path.join(INTRO_ROOT, 'js', 'config.js');
const PORT = Number(process.env.INTRO_EDITOR_PORT || 47541);

const MIME = {
    '.html': 'text/html; charset=utf-8',
    '.js': 'text/javascript; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.webp': 'image/webp',
    '.mp4': 'video/mp4',
    '.ttf': 'font/ttf',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.md': 'text/markdown; charset=utf-8',
};

function safeFilePath(requestPath) {
    const pathname = (requestPath || '/').split('?')[0];
    const decoded = decodeURIComponent(pathname);
    const rel = decoded.replace(/^\/+/, '');
    if (!rel || rel.includes('..')) return null;
    const full = path.resolve(INTRO_ROOT, rel);
    if (!full.startsWith(INTRO_ROOT)) return null;
    return full;
}

function isValidConfigPayload(body) {
    const t = String(body || '').trim();
    return t.startsWith('const gameConfig') && t.includes('scenes');
}

const server = http.createServer((req, res) => {
    const parsed = url.parse(req.url || '/', true);

    if (req.method === 'POST' && parsed.pathname === '/api/save-config') {
        let body = '';
        req.on('data', (chunk) => {
            body += chunk;
            if (body.length > 6 * 1024 * 1024) req.destroy();
        });
        req.on('end', () => {
            try {
                if (!isValidConfigPayload(body)) {
                    res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
                    res.end(JSON.stringify({ ok: false, error: 'Invalid config payload' }));
                    return;
                }
                fs.writeFileSync(CONFIG_PATH, body, 'utf8');
                res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                res.end(JSON.stringify({ ok: true, path: CONFIG_PATH }));
            } catch (e) {
                res.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' });
                res.end(JSON.stringify({ ok: false, error: String(e && e.message ? e.message : e) }));
            }
        });
        return;
    }

    if (req.method !== 'GET') {
        res.writeHead(405);
        res.end();
        return;
    }

    let pathname = parsed.pathname || '/';
    if (pathname === '/') pathname = '/editor.html';

    const filePath = safeFilePath(pathname);
    if (!filePath) {
        res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('Forbidden');
        return;
    }

    fs.readFile(filePath, (err, data) => {
        if (err) {
            res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
            res.end('Not found');
            return;
        }
        const ext = path.extname(filePath).toLowerCase();
        res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
        res.end(data);
    });
});

server.listen(PORT, '127.0.0.1', () => {
    console.log('');
    console.log('  [INTRO 에디터 서버 실행 중]');
    console.log(`  → http://127.0.0.1:${PORT}/editor.html`);
    console.log(`  → 저장 시 파일: ${CONFIG_PATH}`);
    console.log('  종료: Ctrl+C');
    console.log('');
});
