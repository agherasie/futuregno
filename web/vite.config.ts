import { defineConfig } from "vite";
import { nodePolyfills } from "vite-plugin-node-polyfills";
import preact from "@preact/preset-vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [preact(), nodePolyfills()],
});
