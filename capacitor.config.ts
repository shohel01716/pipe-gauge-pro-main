import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.af3cbc00408246599dddbd995e8df98e',
  appName: 'PipeGauge Pro',
  webDir: 'dist',
  // Commented out for local native builds - uncomment for live reload during development
  // server: {
  //   url: 'https://af3cbc00-4082-4659-9ddd-bd995e8df98e.lovableproject.com?forceHideBadge=true',
  //   cleartext: true
  // },
  ios: {
    contentInset: 'automatic',
    preferredContentMode: 'mobile',
    scheme: 'PipeGauge Pro'
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#0F2A44',
      showSpinner: false,
      androidScaleType: 'CENTER_CROP',
      splashFullScreen: true,
      splashImmersive: true
    }
  }
};

export default config;
