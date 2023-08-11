import { resolve } from "path";
import { defineConfig, externalizeDepsPlugin } from "electron-vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()]
  },
  preload: {
    plugins: [externalizeDepsPlugin()]
  },
  renderer: {
    resolve: {
      alias: {
        "@renderer": resolve("src/renderer/src"),
        "@components": resolve("src/renderer/src/components"),
        "@hooks": resolve("src/renderer/src/hooks"),
        "@pages": resolve("src/renderer/src/pages"),
        "@assets": resolve("src/renderer/src/assets")
      }
    },
    plugins: [react()]
  }
});
