const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const SCENE1_ROOT = path.resolve(__dirname, '..');
const CONFIG_PATH = path.join(SCENE1_ROOT, 'js', 'config.js');
const PORT = Number(process.env.SCENE1_EDITOR_PORT || 47542);

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
    '.mp3': 'audio/mpeg',
    '.ttf': 'font/ttf',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
};

function safeFilePath(requestPath) {
    const pathname = (requestPath || '/').split('?')[0];
    const decoded = decodeURIComponent(pathname);
    const rel = decoded.replace(/^\/+/, '');
    if (!rel || rel.includes('..')) return null;
    const full = path.resolve(SCENE1_ROOT, rel);
    if (!full.startsWith(SCENE1_ROOT)) return null;
    return full;
}

const server = http.createServer((req, res) => {
    const parsed = url.parse(req.url || '/', true);

    if (req.method === 'POST' && parsed.pathname === '/api/save-config') {
        let body = '';
        req.on('data', (chunk) => {
            body += chunk;
        });
        req.on('end', () => {
            try {
                if (!body.trim().startsWith('const gameConfig')) {
                    throw new Error('Invalid config payload');
                }
                fs.writeFileSync(CONFIG_PATH, body, 'utf8');
                res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                res.end(JSON.stringify({ ok: true, path: CONFIG_PATH }));
            } catch (e) {
                res.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' });
                res.end(JSON.stringify({ ok: false, error: String(e.message) }));
            }
        });
        return;
    }

    let pathname = parsed.pathname || '/';
    if (pathname === '/') pathname = '/editor.html';

    const filePath = safeFilePath(pathname);
    if (!filePath) {
        res.writeHead(403);
        res.end('Forbidden');
        return;
    }

    fs.readFile(filePath, (err, data) => {
        if (err) {
            res.writeHead(404);
            res.end('Not found');
            return;
        }
        const ext = path.extname(filePath).toLowerCase();
        res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
        res.end(data);
    });
});

server.listen(PORT, '127.0.0.1', () => {
    console.log(`SCENE1 Editor Server running at http://127.0.0.1:${PORT}/editor.html`);
});
