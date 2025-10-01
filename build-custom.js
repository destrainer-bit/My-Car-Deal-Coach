#!/usr/bin/env node

import { build } from 'esbuild';
import { readFileSync, writeFileSync, mkdirSync, copyFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('🚀 Custom build starting (bypassing Rollup completely)...');

try {
  // Create dist directory
  if (!existsSync('dist')) {
    mkdirSync('dist', { recursive: true });
  }

  // Read and update index.html
  let html = readFileSync('index.html', 'utf8');
  
  // Replace the script src to point to the built file
  html = html.replace(
    '<script type="module" src="/src/main.jsx"></script>',
    '<script type="module" src="/main.js"></script>'
  );
  
  writeFileSync('dist/index.html', html);

  // Build with esbuild
  await build({
    entryPoints: ['src/main.jsx'],
    bundle: true,
    outdir: 'dist',
    format: 'esm',
    target: 'es2020',
    minify: true,
    sourcemap: false,
    jsx: 'automatic',
    jsxImportSource: 'react',
    define: {
      'process.env.NODE_ENV': '"production"'
    },
    loader: {
      '.js': 'jsx',
      '.jsx': 'jsx',
      '.ts': 'tsx',
      '.tsx': 'tsx',
      '.css': 'css'
    },
    external: [
      // Keep these external to avoid bundling issues
      'react',
      'react-dom'
    ]
  });

  console.log('✅ Custom build completed successfully!');
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}
