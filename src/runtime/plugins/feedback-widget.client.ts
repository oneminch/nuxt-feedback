/// <reference types="vite/client" />
import { defineCustomElement } from "vue";
import { defineNuxtPlugin } from "#imports";
import FeedbackWidget from "#nuxt-feedback/components/FeedbackWidget.vue";
import { FEEDBACK_WIDGET_TAG } from "#nuxt-feedback/utils";
import widgetCss from "../assets/css/tailwind.css?inline";

/**
 * `@property` rules are ignored inside shadow roots, but Tailwind relies on
 * them for the initial values of its internal `--tw-*` variables. Register
 * just those rules on the document.
 */
const registerCssProperties = (css: string) => {
  const rules = css.match(/@property\s+--[\w-]+\s*\{[^}]*\}/g);
  if (!rules) return;

  const sheet = new CSSStyleSheet();
  sheet.replaceSync(rules.join("\n"));
  document.adoptedStyleSheets.push(sheet);
};

const DARK_MODE_TARGETS = () => [document.documentElement, document.body];

export default defineNuxtPlugin((nuxtApp) => {
  if (customElements.get(FEEDBACK_WIDGET_TAG)) return;

  const BaseElement = defineCustomElement(FeedbackWidget, {
    styles: [widgetCss],
    // The element renders in its own Vue app: share the Nuxt context so
    // composables like `useState` and `useRoute` keep working.
    configureApp(app) {
      app.$nuxt = nuxtApp;
    },
  });

  // Consumer apps toggle `.dark` on <html> or <body>, which can't reach into the
  // shadow root. Mirror it onto the host so the stylesheet can target
  // `:host([data-dark])`. An attribute is used instead of a class because Vue
  // owns the host's `class` and would overwrite it on re-render.
  class FeedbackWidgetElement extends BaseElement {
    #observer = new MutationObserver(() => this.#syncDarkMode());

    override connectedCallback() {
      super.connectedCallback();
      this.#syncDarkMode();
      for (const target of DARK_MODE_TARGETS()) {
        this.#observer.observe(target, {
          attributes: true,
          attributeFilter: ["class"],
        });
      }
    }

    override disconnectedCallback() {
      super.disconnectedCallback();
      this.#observer.disconnect();
    }

    #syncDarkMode() {
      this.toggleAttribute(
        "data-dark",
        DARK_MODE_TARGETS().some((el) => el.classList.contains("dark"))
      );
    }
  }

  registerCssProperties(widgetCss);
  customElements.define(FEEDBACK_WIDGET_TAG, FeedbackWidgetElement);
});
