const fs = require('fs');
const path = require('path');

const projectDir = __dirname;
const outputFilePath = 'C:\\Users\\DELL\\.gemini\\antigravity\\brain\\a2477d90-7d99-46de-9b05-9e69d1810a30\\frontend_bundle.md';

const excludeDirs = ['node_modules', 'dist', '.git', 'public', 'assets', 'supabase'];

function walkDir(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        let isDirectory = fs.statSync(dirPath).isDirectory();
        if (isDirectory && !excludeDirs.includes(f)) {
            walkDir(dirPath, callback);
        } else if (!isDirectory && f !== 'bundle.js' && f !== 'bundle.cjs' && f !== 'package-lock.json') {
            callback(path.join(dir, f));
        }
    });
}

let tree = '';
function buildTree(dir, prefix = '') {
    const files = fs.readdirSync(dir);
    const validFiles = files.filter(f => !excludeDirs.includes(f) && f !== 'bundle.js' && f !== 'bundle.cjs' && f !== 'package-lock.json');
    validFiles.forEach((f, index) => {
        let isLast = index === validFiles.length - 1;
        tree += `${prefix}${isLast ? '└── ' : '├── '}${f}\n`;
        let dirPath = path.join(dir, f);
        if (fs.statSync(dirPath).isDirectory()) {
            buildTree(dirPath, prefix + (isLast ? '    ' : '│   '));
        }
    });
}

buildTree(projectDir);

let markdown = '# Frontend Project Bundle\n\n## File Tree\n```\n' + tree + '```\n\n## Files\n\n';

walkDir(projectDir, (filePath) => {
    const ext = path.extname(filePath).slice(1) || 'txt';
    let content = '';
    try {
        content = fs.readFileSync(filePath, 'utf-8');
    } catch (e) {
        content = '// Could not read file or binary file.';
    }
    const relativePath = path.relative(projectDir, filePath).replace(/\\/g, '/');
    markdown += `### ${relativePath}\n\`\`\`${ext}\n${content}\n\`\`\`\n\n`;
});

fs.writeFileSync(outputFilePath, markdown);
console.log('Bundle created at', outputFilePath);
