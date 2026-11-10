// @ts-check
import { createConfigForNuxt } from '@nuxt/eslint-config/flat'

// Run `npx @eslint/config-inspector` to inspect the resolved config interactively
export default createConfigForNuxt({
  features: {
    // Rules for module authors
    tooling: true,
    // Rules for formatting
    // stylistic: true,
  },
  dirs: {
    src: [
      './apps/docs',
      './packages/nuxt-feedback',
    ],
  },
})
  .append(
    {
      rules: {
        "vue/require-default-prop": "off",
        "vue/html-self-closing": "off",
        "vue/multi-word-component-names": "off",
        "@typescript-eslint/no-explicit-any": "off",
        "import/consistent-type-specifier-style": "off"
      }
    }
  )
