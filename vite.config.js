import { defineConfig, splitVendorChunkPlugin } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), splitVendorChunkPlugin()],
  base: "/",
  optimizeDeps: {
    include: ["linked-dep"],
  },
  server: {
    host: "0.0.0.0",
    port: 3001,
  },
  build: {
    sourcemap: true,
    commonjsOptions: {
      include: [/linked-dep/, /node_modules/],
    },
    ssrManifest: true,
  },
});
