import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.diplomatic.dictionary",
  appName: "Diplomatic Dictionary",
  webDir: "public", // ❌ only for static export
  server: {
    url: "https://dip-lugat.vercel.app", // ✅ point to hosted Next.js app
    cleartext: false, //https only
  },
};

export default config;
