<script setup lang="ts">
import {
  nextTick,
  onMounted,
  onUnmounted,
  ref,
  watch,
  watchEffect,
} from "#imports";
import type { FeedbackUIProps } from "../types";
import useFeedbackWidget from "#nuxt-feedback/composables/use-feedback-widget";
import useFeedbackConfig from "#nuxt-feedback/composables/use-feedback-config";

const props = withDefaults(defineProps<FeedbackUIProps>(), {
  triggerLabel: "Share Feedback",
  triggerClass: "",
  // Boolean props default to false when absent; keep the modal default.
  withTopics: true,
});

const { isOpen, openWidget, registerWidget, unregisterWidget } =
  useFeedbackWidget();
const config = useFeedbackConfig();
const trigger = ref<HTMLButtonElement>();
let openedByThis = false;

// The modal lives in a separate Vue app; share its content via Nuxt state.
// The most recently updated widget wins.
watchEffect(() => {
  const { triggerLabel, triggerClass, ...modalProps } = props;
  config.value = Object.fromEntries(
    Object.entries(modalProps).filter(([, value]) => value !== undefined),
  );
});

const open = () => {
  openedByThis = true;
  openWidget();
};

// Reka restores focus to its own trigger; there is none here, so do it manually.
watch(isOpen, (value) => {
  if (value || !openedByThis) return;
  openedByThis = false;
  nextTick(() => trigger.value?.focus());
});

onMounted(registerWidget);
onUnmounted(unregisterWidget);
</script>

<template>
  <button
    ref="trigger"
    type="button"
    class="feedback-trigger"
    :class="triggerClass"
    aria-haspopup="dialog"
    :aria-expanded="isOpen"
    @click="open"
  >
    {{ triggerLabel }}
  </button>
</template>

<style>
/* Zero specificity so any consumer styles override these defaults. */
@layer base {
  :where(.feedback-trigger) {
    --background: oklch(1 0 0);
    --foreground: oklch(0.145 0 0);
    --accent: oklch(0.97 0 0);
    --accent-foreground: oklch(0.205 0 0);
    --destructive: oklch(0.577 0.245 27.325);
    --border: oklch(0.922 0 0);
    --ring: oklch(0.708 0 0);

    box-sizing: border-box;
    display: inline-flex;
    flex-shrink: 0;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    height: 2.25rem;
    padding-block: 0.5rem;
    padding-inline: 1rem;
    border: 1px solid var(--border);
    border-radius: 0.375rem;
    background-color: var(--background);
    color: var(--foreground);
    font-size: 0.875rem;
    font-weight: 500;
    line-height: 1.25rem;
    white-space: nowrap;
    box-shadow: 0 1px 2px 0 rgb(0 0 0 / 5%);
    cursor: pointer;
    outline-style: none;
    transition: all 150ms cubic-bezier(0.4, 0, 0.2, 1);
  }

  @media (hover: hover) {
    :where(.feedback-trigger:hover) {
      background-color: var(--accent);
      color: var(--accent-foreground);
    }
  }

  :where(.feedback-trigger:focus-visible) {
    border-color: var(--ring);
    box-shadow:
      0 0 0 3px mix(in oklab, var(--ring) 50%, transparent),
      0 1px 2px 0 rgb(0 0 0 / 5%);
  }

  :where(.feedback-trigger:disabled) {
    pointer-events: none;
    opacity: 0.5;
  }

  :where(.feedback-trigger:has(> svg)) {
    padding-inline: 0.75rem;
  }

  :where(.feedback-trigger[aria-invalid="true"]) {
    border-color: var(--destructive);
  }

  :where(.feedback-trigger[aria-invalid="true"]:focus-visible) {
    box-shadow:
      0 0 0 3px mix(in oklab, var(--destructive) 20%, transparent),
      0 1px 2px 0 rgb(0 0 0 / 5%);
  }

  :where(.feedback-trigger svg) {
    flex-shrink: 0;
    pointer-events: none;
  }

  :where(.feedback-trigger svg:not([class*="size-"])) {
    width: 1rem;
    height: 1rem;
  }
}
</style>
