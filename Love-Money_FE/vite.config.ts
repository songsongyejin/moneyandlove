import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tsconfigPaths from "vite-tsconfig-paths";
import tailwindcss from "tailwindcss";
import path from "path";
import nodePolyfills from "rollup-plugin-polyfill-node";
import { nodeModulesPolyfillPlugin } from "esbuild-plugins-node-modules-polyfill";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tsconfigPaths(), tailwindcss()],
  optimizeDeps: {
    esbuildOptions: {
      // Enable esbuild polyfill plugins
      plugins: [nodeModulesPolyfillPlugin()],
    },
  },
  build: {
    rollupOptions: {
      plugins: [nodePolyfills()],
    },
  },
});
// 플러그인에 tailwindcss()을 내용을 추가해줍니다
