import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

const r = (p: string) => fileURLToPath(new URL(p, import.meta.url));

export default defineConfig({
  resolve: {
    alias: {
      "#imports": r("./test/mocks/imports.ts"),
      "#nuxt-feedback/utils": r("./src/runtime/utils.ts"),
    },
  },
});
