<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "#imports";
import { providePortalTarget } from "#nuxt-feedback/composables/usePortalTarget";
import FeedbackWidgetContent from "#nuxt-feedback/components/FeedbackWidgetContent.vue";

defineOptions({ inheritAttrs: false });

const PROPERTIES_STYLE_ID = "nuxt-feedback-properties";

const host = ref<HTMLElement>();
const container = ref<HTMLElement>();
providePortalTarget(container);

let observer: MutationObserver | undefined;

// `@property` rules are ignored inside shadow roots, so they are registered on
// the document. They only define `--tw-*` internals and don't affect the page.
const registerProperties = (widgetCss: string) => {
  if (document.getElementById(PROPERTIES_STYLE_ID)) return;
  const rules = widgetCss.match(/@property\s+--[\w-]+\s*\{[^}]*\}/g);
  if (!rules) return;
  const style = document.createElement("style");
  style.id = PROPERTIES_STYLE_ID;
  style.textContent = rules.join("\n");
  document.head.appendChild(style);
};

onMounted(async () => {
  // Client-only import so the CSS never ends up in the SSR-rendered document.
  const { default: widgetCss } = await import(
    "../assets/css/tailwind.css?inline"
  );

  const root = host.value!.attachShadow({ mode: "open" });

  const style = document.createElement("style");
  style.textContent = widgetCss;

  const element = document.createElement("div");
  element.className = "preflight";

  const syncDarkMode = () => {
    const isDark =
      document.documentElement.classList.contains("dark") ||
      document.body.classList.contains("dark");
    element.classList.toggle("dark", isDark);
  };
  syncDarkMode();

  observer = new MutationObserver(syncDarkMode);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class"],
  });
  observer.observe(document.body, {
    attributes: true,
    attributeFilter: ["class"],
  });

  registerProperties(widgetCss);
  root.append(style, element);
  container.value = element;
});

onBeforeUnmount(() => {
  observer?.disconnect();
});
</script>

<template>
  <div ref="host" style="display: contents">
    <Teleport v-if="container" :to="container">
      <FeedbackWidgetContent v-bind="$attrs" />
    </Teleport>
  </div>
</template>
