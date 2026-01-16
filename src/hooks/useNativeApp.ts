import { useEffect } from "react";
import { Capacitor } from "@capacitor/core";
import { StatusBar, Style } from "@capacitor/status-bar";

export const useNativeApp = () => {
  useEffect(() => {
    const configureStatusBar = async () => {
      if (!Capacitor.isNativePlatform()) return;

      try {
        const isAndroid = Capacitor.getPlatform() === "android";

        // Android WebView often reports safe-area insets as 0, so overlays cause UI under the clock.
        // Use non-overlay on Android to guarantee content starts below the status bar.
        await StatusBar.setOverlaysWebView({ overlay: !isAndroid });

        // Light content for our dark/primary header
        await StatusBar.setStyle({ style: Style.Light });

        // Match the app header color on Android when not overlaying
        if (isAndroid) {
          await StatusBar.setBackgroundColor({ color: "#DF3120" });
        }
      } catch (error) {
        console.warn("StatusBar configuration failed:", error);
      }
    };

    configureStatusBar();
  }, []);
};
