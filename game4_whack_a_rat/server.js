const http = require('http');
const fs = require('fs');
const path = require('path');

const port = 8080;

http.createServer((req, res) => {
  let filePath = '.' + req.url;
  if (filePath === './' || filePath === './editor') filePath = './index.html';
  if (req.url === '/editor.html') filePath = './editor.html';

  const extname = String(path.extname(filePath)).toLowerCase();
  const mimeTypes = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.wav': 'audio/wav',
    '.mp3': 'audio/mpeg',
    '.mp4': 'video/mp4'
  };

  const contentType = mimeTypes[extname] || 'application/octet-stream';

  fs.readFile(filePath, (error, content) => {
    if (error) {
      if (error.code == 'ENOENT') {
        res.writeHead(404);
        res.end('File not found');
      } else {
        res.writeHead(500);
        res.end('Error: ' + error.code);
      }
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
    }
  });

}).listen(port);

console.log(`Server running at http://localhost:${port}/`);
console.log(`Editor available at http://localhost:${port}/editor.html`);
