import { fileURLToPath } from "node:url";
import vue from "@vitejs/plugin-vue";
import { defineConfig } from "vitest/config";

const r = (p: string) => fileURLToPath(new URL(p, import.meta.url));

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      "#imports": r("./test/mocks/imports.ts"),
      "#nuxt-feedback": r("./src/runtime"),
    },
  },
});
