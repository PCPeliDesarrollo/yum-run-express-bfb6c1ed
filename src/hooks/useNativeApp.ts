import { useEffect } from "react";
import { Capacitor } from "@capacitor/core";
import { StatusBar, Style } from "@capacitor/status-bar";
import { useNavigate, useLocation } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";

export const useNativeApp = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isOpen: cartOpen, setIsOpen: setCartOpen } = useCart();

  // Status bar config
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

  // Android hardware back button
  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;

    let cleanup: (() => void) | undefined;

    import("@capacitor/app").then(({ App }) => {
      const promise = App.addListener("backButton", () => {
        // 1. If cart drawer is open, close it
        if (cartOpen) {
          setCartOpen(false);
          return;
        }
        // 2. If on home or auth, minimize app
        const path = location.pathname;
        if (path === "/" || path === "/auth") {
          App.minimizeApp();
          return;
        }
        // 3. If we have history, go back; otherwise go home
        if (window.history.length > 1) {
          window.history.back();
        } else {
          navigate("/");
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
  }, [cartOpen, setCartOpen, location.pathname, navigate]);
};
