#!/usr/bin/env node
/**
 * PQ-KMS React UI Offline Ahead-of-Time Compiler
 * Compiles JSX using vendored Babel and produces a self-contained dist/ bundle.
 */
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = __dirname;
const SRC_DIR = path.join(ROOT, 'src');
const VENDOR_DIR = path.join(ROOT, 'assets', 'vendor');
const DIST_DIR = path.join(ROOT, 'dist');
const DIST_ASSETS = path.join(DIST_DIR, 'assets');
const DIST_VENDOR = path.join(DIST_ASSETS, 'vendor');

console.log('[Build] Initializing Ahead-of-Time JSX Compiler...');

fs.mkdirSync(DIST_VENDOR, { recursive: true });

// Copy vendor libraries
console.log('[Build] Copying vendored libraries to dist...');
const vendorFiles = ['react.production.min.js', 'react-dom.production.min.js', 'chart.umd.min.js'];
for (const vf of vendorFiles) {
  const srcP = path.join(VENDOR_DIR, vf);
  const dstP = path.join(DIST_VENDOR, vf);
  if (fs.existsSync(srcP)) {
    fs.copyFileSync(srcP, dstP);
    console.log(`  ✓ Copied ${vf}`);
  } else {
    console.error(`  ✗ Missing ${vf}`);
  }
}

// Copy styles
console.log('[Build] Copying stylesheets...');
fs.copyFileSync(path.join(SRC_DIR, 'index.css'), path.join(DIST_ASSETS, 'index.css'));
console.log('  ✓ Copied index.css');

// Load Babel in VM
console.log('[Build] Loading vendored Babel compiler...');
const babelCode = fs.readFileSync(path.join(VENDOR_DIR, 'babel.min.js'), 'utf8');
const context = { window: {}, console: console };
vm.createContext(context);
vm.runInContext(babelCode, context);
const Babel = context.Babel || context.window.Babel;

// Transform App.jsx
console.log('[Build] Compiling App.jsx...');
const appSource = fs.readFileSync(path.join(SRC_DIR, 'App.jsx'), 'utf8');

// Strip ES module imports/exports for direct browser script execution
let processed = appSource
  .replace(/import\s+React.*?from\s+['"][^'"]+['"];?/g, '')
  .replace(/export\s+default\s+function\s+App/g, 'function App');

const transformed = Babel.transform(processed, {
  presets: ['react'],
  plugins: [],
});

// Render bootstrap script
const bundleJs = `
// PQ-KMS Modern React Bundle
(function() {
  const { useState, useEffect, useRef, useMemo } = React;
  
  ${transformed.code}

  // Mount root
  const rootElement = document.getElementById('root');
  if (rootElement) {
    const root = ReactDOM.createRoot(rootElement);
    root.render(React.createElement(App));
  }
})();
`;

fs.writeFileSync(path.join(DIST_ASSETS, 'app.bundle.js'), bundleJs, 'utf8');
console.log('  ✓ Generated dist/assets/app.bundle.js');

// Generate production index.html
const indexHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>PQ-KMS — Post-Quantum Key Management Console</title>
  <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🔐</text></svg>">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="/assets/index.css">
  <script src="/assets/vendor/react.production.min.js"></script>
  <script src="/assets/vendor/react-dom.production.min.js"></script>
  <script src="/assets/vendor/chart.umd.min.js"></script>
</head>
<body>
  <div id="root"></div>
  <script src="/assets/app.bundle.js"></script>
</body>
</html>
`;

fs.writeFileSync(path.join(DIST_DIR, 'index.html'), indexHtml, 'utf8');
console.log('  ✓ Generated dist/index.html');
console.log('[Build] Build complete! Standalone dist/ is ready.');
