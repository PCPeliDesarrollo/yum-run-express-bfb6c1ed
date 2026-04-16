import { useEffect } from "react";
import { Capacitor } from "@capacitor/core";
import { StatusBar, Style } from "@capacitor/status-bar";
import { App } from "@capacitor/app";

export const useNativeApp = () => {
  useEffect(() => {
    const configureStatusBar = async () => {
      if (!Capacitor.isNativePlatform()) return;

      try {
        const isAndroid = Capacitor.getPlatform() === "android";
        await StatusBar.setOverlaysWebView({ overlay: !isAndroid });
        await StatusBar.setStyle({ style: Style.Light });
        if (isAndroid) {
          await StatusBar.setBackgroundColor({ color: "#DF3120" });
        }
      } catch (error) {
        console.warn("StatusBar configuration failed:", error);
      }
    };

    configureStatusBar();
  }, []);

  // Handle Android hardware back button
  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;

    const backHandler = App.addListener("backButton", ({ canGoBack }) => {
      if (canGoBack) {
        window.history.back();
      } else {
        // On root page, minimize app instead of closing
        App.minimizeApp();
      }
    });

    return () => {
      backHandler.then((h) => h.remove());
    };
  }, []);
};
