"use client";

import { useCallback, useEffect } from "react";

/**
 * Browser-notification helper ("It's your turn" toasts).
 * Falls back to nothing when the Notification API is unavailable.
 */
export function useNotifications(requestPermissionOnMount = false) {
  const supported =
    typeof window !== "undefined" && "Notification" in window;

  const requestPermission = useCallback(async () => {
    if (!supported) return "unsupported" as const;
    return Notification.requestPermission();
  }, [supported]);

  const notify = useCallback(
    (title: string, options?: NotificationOptions) => {
      if (!supported || Notification.permission !== "granted") return false;
      const notification = new Notification(title, options);
      setTimeout(() => notification.close(), 15000);
      return true;
    },
    [supported]
  );

  useEffect(() => {
    if (
      requestPermissionOnMount &&
      supported &&
      Notification.permission === "default"
    ) {
      void Notification.requestPermission();
    }
  }, [requestPermissionOnMount, supported]);

  return { supported, requestPermission, notify };
}