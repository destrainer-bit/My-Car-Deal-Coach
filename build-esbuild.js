#!/usr/bin/env node

import { build } from 'esbuild';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Read package.json to get dependencies
const pkg = JSON.parse(readFileSync(join(__dirname, 'package.json'), 'utf8'));

console.log('🔧 Building with esbuild...');

try {
  await build({
    entryPoints: ['src/main.jsx'],
    bundle: true,
    outdir: 'dist',
    format: 'esm',
    target: 'es2020',
    minify: true,
    sourcemap: true,
    jsx: 'automatic',
    external: [
      // Keep these external to avoid bundling issues
      ...Object.keys(pkg.dependencies || {}),
      ...Object.keys(pkg.peerDependencies || {})
    ],
    loader: {
      '.js': 'jsx',
      '.jsx': 'jsx',
      '.ts': 'tsx',
      '.tsx': 'tsx'
    },
    define: {
      'process.env.NODE_ENV': '"production"'
    }
  });
  
  console.log('✅ Build completed successfully!');
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}


