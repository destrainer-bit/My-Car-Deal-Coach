#!/usr/bin/env node

// Custom build script to bypass Rollup issues
import { execSync } from 'child_process';

console.log('🔧 Custom build script starting...');

try {
  // Set environment variables
  process.env.NODE_OPTIONS = '--max-old-space-size=4096';
  process.env.NPM_CONFIG_IGNORE_OPTIONAL = 'false';
  
  console.log('🏗️  Building with Vite...');
  execSync('npx vite build', { stdio: 'inherit' });
  
  console.log('✅ Build completed successfully!');
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}
