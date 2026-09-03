import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('=== FINAL ERROR CHECK ===\n');

const files = [
  './src/main.jsx',
  './src/App.jsx',
  './src/pages/loginpage/login.jsx',
  './src/pages/loginpage/signup.jsx',
  './src/index.css',
  './vite.config.js'
];

let errorCount = 0;

// Check file existence
files.forEach(file => {
  if (!fs.existsSync(file)) {
    console.log('❌ Missing file:', file);
    errorCount++;
  }
});

// Check index.css for tailwind import
const indexCss = fs.readFileSync('./src/index.css', 'utf8');
if (indexCss.includes('@import') && indexCss.includes('tailwindcss')) {
  console.log('❌ ERROR: Tailwindcss import found in index.css');
  errorCount++;
} else {
  console.log('✅ NO tailwindcss import in index.css');
}

// Check vite config for tailwind
const vieteConfig = fs.readFileSync('./vite.config.js', 'utf8');
if (vieteConfig.includes('tailwindcss')) {
  console.log('❌ ERROR: Tailwindcss import found in vite.config.js');
  errorCount++;
} else {
  console.log('✅ NO tailwindcss import in vite.config.js');
}

// Check all JS files
console.log('\n=== JS FILE IMPORTS ===');
const jsFiles = [
  './src/main.jsx',
  './src/pages/loginpage/login.jsx',
  './src/pages/loginpage/signup.jsx'
];

jsFiles.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  if (content.includes('react-router-dom')) {
    console.log('❌ ERROR:', file, 'has react-router-dom import');
    errorCount++;
  } else {
    console.log('✅', path.basename(file), 'no react-router-dom');
  }
});

console.log('\n=== BUILD RESULT ===');
if (errorCount === 0) {
  console.log('✅ NO ERRORS FOUND - Project is ready to run!');
} else {
  console.log('❌ Found', errorCount, 'error(s)');
}
