import { useEffect } from "react";
import { Capacitor } from "@capacitor/core";
import { StatusBar, Style } from "@capacitor/status-bar";

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

    let cleanup: (() => void) | undefined;

    import("@capacitor/app").then(({ App }) => {
      const promise = App.addListener("backButton", ({ canGoBack }) => {
        if (canGoBack) {
          window.history.back();
        } else {
          App.minimizeApp();
        }
      });

      promise.then((handle) => {
        cleanup = () => handle.remove();
      });
    }).catch((err) => {
      console.warn("@capacitor/app not available:", err);
    });

    return () => {
      cleanup?.();
    };
  }, []);
};
