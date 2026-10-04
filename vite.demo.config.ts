import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "node:path";

export default defineConfig({
  plugins: [react()],
  base: "./",
  root: "demo",
  build: {
    outDir: "../dist-demo",
    emptyOutDir: true,
    rollupOptions: {
      input: {
        playground: resolve("demo/index.html"),
        docs: resolve("demo/docs/index.html"),
      },
    },
  },
});
