import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.cardealcoach.app',
  appName: 'The Car Deal Coach',
  webDir: 'dist',
  bundledWebRuntime: false,
  server: {
    // during native debug with live reload you can set:
    // url: 'http://192.168.1.154:5173',
    // cleartext: true
  },
  ios: {
    contentInset: 'automatic',
    backgroundColor: '#0B0B0B',
  },
  android: {
    backgroundColor: '#0B0B0B',
    allowMixedContent: false
  }
};

export default config;
