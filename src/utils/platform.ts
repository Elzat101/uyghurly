// Extend the global Window interface to include Capacitor
declare global {
  interface Window {
    Capacitor?: {
      getPlatform(): string;
    };
  }
}

// Platform detection utility
export const isIOS = () => {
  if (typeof window === "undefined") return false;

  // Check for Capacitor
  if (window.Capacitor) {
    return window.Capacitor.getPlatform() === "ios";
  }

  // Check for iOS user agent
  return /iPad|iPhone|iPod/.test(navigator.userAgent);
};

export const isNative = () => {
  if (typeof window === "undefined") return false;

  // Check for Capacitor
  if (window.Capacitor) {
    return ["ios", "android"].includes(window.Capacitor.getPlatform());
  }

  return false;
};

export const isWeb = () => {
  return !isNative();
};

export const isStaticExport = () => {
  return process.env.BUILD_TARGET === "ios";
};

// Storage utilities that work on both web and native
export const getStorage = (key: string): string | null => {
  if (typeof window === "undefined") return null;

  try {
    if (isNative()) {
      // Use Capacitor Preferences for native storage
      return localStorage.getItem(key);
    } else {
      return localStorage.getItem(key);
    }
  } catch (error) {
    console.warn("Storage access failed:", error);
    return null;
  }
};

export const setStorage = (key: string, value: string): void => {
  if (typeof window === "undefined") return;

  try {
    if (isNative()) {
      // Use Capacitor Preferences for native storage
      localStorage.setItem(key, value);
    } else {
      localStorage.setItem(key, value);
    }
  } catch (error) {
    console.warn("Storage access failed:", error);
  }
};

export const removeStorage = (key: string): void => {
  if (typeof window === "undefined") return;

  try {
    if (isNative()) {
      // Use Capacitor Preferences for native storage
      localStorage.removeItem(key);
    } else {
      localStorage.removeItem(key);
    }
  } catch (error) {
    console.warn("Storage access failed:", error);
  }
};
