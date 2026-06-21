const fs = require('fs');
const path = require('path');

const historyFile = 'C:\\Users\\pc\\AppData\\Roaming\\Microsoft\\Windows\\PowerShell\\PSReadLine\\ConsoleHost_history.txt';

if (!fs.existsSync(historyFile)) {
  console.log("History file does not exist.");
  process.exit(0);
}

const content = fs.readFileSync(historyFile, 'utf8');
const lines = content.split('\n');

console.log(`Total history lines: ${lines.length}. Showing last 100 lines:`);
const start = Math.max(0, lines.length - 100);
for (let i = start; i < lines.length; i++) {
  console.log(`[Line ${i + 1}] ${lines[i].trim()}`);
}
