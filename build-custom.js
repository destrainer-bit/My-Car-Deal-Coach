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

  // Copy index.html
  copyFileSync('index.html', 'dist/index.html');

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
