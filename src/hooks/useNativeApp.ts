import { useEffect, useRef } from "react";
import { Capacitor } from "@capacitor/core";
import { StatusBar, Style } from "@capacitor/status-bar";
import { useNavigate, useLocation } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { ensureNotificationPermission } from "@/lib/notifications";

export const useNativeApp = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isOpen: cartOpen, setIsOpen: setCartOpen } = useCart();

  // Keep latest values in refs so a single back-button listener always reads fresh state.
  const cartOpenRef = useRef(cartOpen);
  const pathRef = useRef(location.pathname);
  const setCartOpenRef = useRef(setCartOpen);
  const navigateRef = useRef(navigate);

  useEffect(() => {
    cartOpenRef.current = cartOpen;
  }, [cartOpen]);
  useEffect(() => {
    pathRef.current = location.pathname;
  }, [location.pathname]);
  useEffect(() => {
    setCartOpenRef.current = setCartOpen;
    navigateRef.current = navigate;
  }, [setCartOpen, navigate]);

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

  // Request notification permission on app start (critical for Android 13+)
  useEffect(() => {
    const requestPerms = async () => {
      try {
        const granted = await ensureNotificationPermission();
        console.log("[Notifications] Permission granted:", granted);
      } catch (e) {
        console.warn("[Notifications] Permission request failed:", e);
      }
    };
    const t = setTimeout(requestPerms, 800);
    return () => clearTimeout(t);
  }, []);

  // Hardware back button (Android) — registered ONCE so it never misses an event
  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;

    let cleanup: (() => void) | undefined;
    let cancelled = false;

    import("@capacitor/app").then(({ App }) => {
      if (cancelled) return;
      App.addListener("backButton", () => {
        // 1. If cart drawer is open, close it
        if (cartOpenRef.current) {
          setCartOpenRef.current(false);
          return;
        }
        const path = pathRef.current;
        // 2. On root/login, minimize app instead of exiting
        if (path === "/" || path === "/auth") {
          App.minimizeApp();
          return;
        }
        // 3. Otherwise navigate back within the SPA
        if (window.history.length > 1) {
          window.history.back();
        } else {
          navigateRef.current("/");
        }
      }).then((handle) => {
        if (cancelled) {
          handle.remove();
          return;
        }
        cleanup = () => handle.remove();
      });
    }).catch((err) => {
      console.warn("@capacitor/app not available:", err);
    });

    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, []);

  // iOS swipe-back gesture support inside WKWebView
  useEffect(() => {
    if (!Capacitor.isNativePlatform() || Capacitor.getPlatform() !== "ios") return;
    // The WebView gesture only triggers real history navigation; ensure our SPA history is used.
    document.documentElement.style.setProperty("-webkit-overflow-scrolling", "touch");
  }, []);
};
