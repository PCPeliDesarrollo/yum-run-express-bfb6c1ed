import { useEffect } from "react";
import { Capacitor } from "@capacitor/core";
import { StatusBar, Style } from "@capacitor/status-bar";

export const useNativeApp = () => {
  useEffect(() => {
    const configureStatusBar = async () => {
      if (Capacitor.isNativePlatform()) {
        try {
          // Make status bar overlay the WebView
          await StatusBar.setOverlaysWebView({ overlay: true });
          
          // Set status bar style (light content for dark backgrounds)
          await StatusBar.setStyle({ style: Style.Light });
          
          // Set background color to transparent
          if (Capacitor.getPlatform() === "android") {
            await StatusBar.setBackgroundColor({ color: "#00000000" });
          }
        } catch (error) {
          console.warn("StatusBar configuration failed:", error);
        }
      }
    };

    configureStatusBar();
  }, []);
};
