import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

export default defineConfig({
  base: "./",
  plugins: [react()],
  optimizeDeps: {
    exclude: ["skara-player"],
  },
  build: {
    manifest: "manifest.json",
    terserOptions: {
      compress: {
        drop_console: true,
      },
    },
  },
});
