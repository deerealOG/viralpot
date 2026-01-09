import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.viralpot.app',
  appName: 'ViralPot',
  webDir: 'dist',
  plugins: {
    SplashScreen: {
      backgroundColor: '#0B1120',
      launchShowDuration: 2000,
      launchAutoHide: true,
      showSpinner: true,
      androidSpinnerStyle: 'large',
      iosSpinnerStyle: 'small',
      spinnerColor: '#F97316',
      splashFullScreen: true,
      splashImmersive: true,
    }
  }
};

export default config;
