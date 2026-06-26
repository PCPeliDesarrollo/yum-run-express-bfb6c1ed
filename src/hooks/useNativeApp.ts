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

  // Single ref bag keeps latest values for the back-button listener
  const stateRef = useRef({ cartOpen, path: location.pathname, setCartOpen, navigate });
  stateRef.current = { cartOpen, path: location.pathname, setCartOpen, navigate };

  // One-time native setup: status bar, notification permission, back button
  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;

    const isAndroid = Capacitor.getPlatform() === "android";

    (async () => {
      try {
        await StatusBar.setOverlaysWebView({ overlay: !isAndroid });
        await StatusBar.setStyle({ style: Style.Light });
        if (isAndroid) await StatusBar.setBackgroundColor({ color: "#DF3120" });
      } catch (e) {
        console.warn("StatusBar configuration failed:", e);
      }
    })();

    const permTimer = setTimeout(() => {
      ensureNotificationPermission().catch((e) =>
        console.warn("[Notifications] Permission request failed:", e),
      );
    }, 800);

    let removeBack: (() => void) | undefined;
    let cancelled = false;

    import("@capacitor/app")
      .then(({ App }) =>
        App.addListener("backButton", () => {
          const s = stateRef.current;
          if (s.cartOpen) {
            s.setCartOpen(false);
            return;
          }
          if (s.path === "/" || s.path === "/auth") {
            App.minimizeApp();
            return;
          }
          if (window.history.length > 1) window.history.back();
          else s.navigate("/");
        }).then((handle) => {
          if (cancelled) handle.remove();
          else removeBack = () => handle.remove();
        }),
      )
      .catch((err) => console.warn("@capacitor/app not available:", err));

    return () => {
      cancelled = true;
      clearTimeout(permTimer);
      removeBack?.();
    };
  }, []);
};
