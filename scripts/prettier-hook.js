const fs = require('fs');
const path = require('path');

const hookSource = path.join(__dirname, '..', 'git', 'pre-commit');
const gitHooksDir = path.join(__dirname, '..', '.git', 'hooks');
const hookDest = path.join(gitHooksDir, 'pre-commit');

// Garante que a pasta .git/hooks existe
if (!fs.existsSync(gitHooksDir)) {
  console.log('⚠️  Pasta .git/hooks não encontrada. Pulando instalação do hook.');
  process.exit(0);
}

// Lê o hook fonte e força line endings LF (remove CRLF caso o Git tenha convertido)
let content = fs.readFileSync(hookSource, 'utf8');
content = content.replace(/\r\n/g, '\n');

// Escreve o hook no destino
fs.writeFileSync(hookDest, content, { mode: 0o755 });

console.log('✅ Git hook pre-commit instalado com sucesso.');
