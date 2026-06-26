import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.a524d70777ce4b4eabfda0c221e22b0a',
  appName: 'Tryb Burger',
  webDir: 'dist',
  ios: {
    // Enable native swipe-back gesture inside the WebView (iOS "back" UX)
    preferredContentMode: 'mobile',
    handleApplicationNotifications: false,
  },
  server: {
    androidScheme: 'https',
  },
};

export default config;
