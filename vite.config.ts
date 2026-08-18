import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

export default defineConfig({
  base: "./",
  plugins: [react()],
  optimizeDeps: {
    exclude: ["skara-player"],
  },
  build: {
    terserOptions: {
      compress: {
        drop_console: true,
      },
    },
  },
});
