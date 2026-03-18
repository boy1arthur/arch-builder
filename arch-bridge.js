#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

/**
 * ASURADA ARCH-FLOW BRIDGE
 * CLI 및 IDE 연동을 위한 아키텍처 스캐폴딩 엔진
 */

const args = process.argv.slice(2);
const command = args[0];

const DEFAULT_TARGET = 'C:\\xampp\\htdocs\\mysite';

const UI = {
    info: (msg) => console.log(`\x1b[36m[ARCH-FLOW]\x1b[0m ${msg}`),
    success: (msg) => console.log(`\x1b[32m[SUCCESS]\x1b[0m ${msg}`),
    error: (msg) => console.log(`\x1b[31m[ERROR]\x1b[0m ${msg}`)
};

function scaffold(structure, targetDir) {
    UI.info(`Scaffolding architecture at: ${targetDir}`);
    
    structure.forEach(item => {
        const fullPath = path.join(targetDir, item.path);
        if (item.type === 'directory') {
            if (!fs.existsSync(fullPath)) {
                fs.mkdirSync(fullPath, { recursive: true });
                UI.info(`Created folder: ${item.path}`);
            }
        } else if (item.type === 'file') {
            fs.writeFileSync(fullPath, item.content || '', 'utf8');
            UI.info(`Created file: ${item.path}`);
        }
    });
}

// CLI Command Handling
if (command === '--apply') {
    const filePath = args[1];
    if (!filePath || !fs.existsSync(filePath)) {
        UI.error("Architecture JSON file not found.");
        process.exit(1);
    }
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    scaffold(data.structure, data.target || DEFAULT_TARGET);
    UI.success("Architecture applied successfully.");
} else if (command === '--ui') {
    UI.info("Starting Visual Arch-Builder UI...");
    // TODO: Launch React Dev Server or Build Output
} else {
    console.log(`
    Asurada Arch-Flow CLI
    Usage:
      asura-arch --ui           Open visual builder
      asura-arch --apply [file] Apply architecture from JSON
    `);
}
