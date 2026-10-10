import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.afrangeneralhospital.feedback',
  appName: 'Afran General Hospital',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
  },
};

export default config;
