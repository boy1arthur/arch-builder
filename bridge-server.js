const http = require('http');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const PORT = process.env.PORT || 9012;
const DEFAULT_BASE_DIR = process.env.TARGET_DIR || 'C:\\xampp\\htdocs\\mysite';

const DNA_TEMPLATES = {
    'react-ts': (name) => `import React from 'react';\n\nexport const ${name} = () => {\n  return <div>${name} Component</div>;\n};\n`,
    'index-html': (title) => `<!DOCTYPE html>\n<html><head><title>${title}</title></head><body><div id="root"></div></body></html>`,
    'package-json': (name) => JSON.stringify({ name: name.toLowerCase(), version: "1.0.0" }, null, 2),
    'next-page': () => `export default function Page() { return <main>Page Generated</main>; }`,
    'next-layout': () => `export default function Layout({ children }) { return <section>{children}</section>; }`
};

const server = http.createServer((req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') { res.writeHead(200); res.end(); return; }

    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
        try {
            const urlPath = req.url.split('?')[0];
            if (urlPath === '/api/scaffold' && req.method === 'POST') {
                const data = JSON.parse(body);
                const { structure, projectName, customPath } = data;
                
                if (!Array.isArray(structure)) throw new Error('Structure is not an array');

                const targetDir = customPath ? path.resolve(customPath, projectName.trim()) : path.join(DEFAULT_BASE_DIR, projectName.trim());
                if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir, { recursive: true });

                structure.forEach(item => {
                    const fullPath = path.join(targetDir, item.path);
                    const dir = path.dirname(fullPath);
                    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

                    if (item.type === 'directory') {
                        if (!fs.existsSync(fullPath)) fs.mkdirSync(fullPath, { recursive: true });
                    } else {
                        let content = item.content || '';
                        if (item.template && DNA_TEMPLATES[item.template]) {
                            content = DNA_TEMPLATES[item.template](path.basename(fullPath, path.extname(fullPath)));
                        }
                        fs.writeFileSync(fullPath, content, 'utf8');
                    }
                });

                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: true, targetPath: targetDir }));
            } else {
                res.writeHead(404); res.end();
            }
        } catch (err) {
            console.error('[500 ERROR]', err.message);
            res.writeHead(500);
            res.end(JSON.stringify({ success: false, error: err.message }));
        }
    });
});

server.listen(PORT, () => {
    console.log(`[STABLE BRIDGE] Active on ${PORT}`);
});
