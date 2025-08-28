import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.elzatparhat.uyghurly",
  appName: "uyghurly",
  webDir: "out", // Changed from "public" to "out" for static export
  server: {
    url: "https://uyghur-language-app.vercel.app",
    cleartext: false,
  },
  ios: {
    scheme: "uyghurly",
    contentInset: "always",
    limitsNavigationsToAppBoundDomains: true,
    webContentsDebuggingEnabled: false,
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 3000,
      backgroundColor: "#ffffff",
      showSpinner: true,
      spinnerColor: "#999999",
    },
    StatusBar: {
      style: "dark",
      backgroundColor: "#ffffff",
    },
  },
};

export default config;
