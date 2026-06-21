const fs = require('fs');
const path = require('path');

const srcDir = 'c:/Users/pc/OneDrive/Documents/Pharmacy Training Management System Front/ptms';
const destDir = 'c:/Users/pc/OneDrive/Documents/Pharmacy Training Management System/ptms';

const files = [
  'utils/api.js',
  'context/AuthContext.js'
];

files.forEach(file => {
  const src = path.join(srcDir, file);
  const dest = path.join(destDir, file);
  fs.copyFileSync(src, dest);
  console.log(`Copied ${file}`);
});
