<script setup lang="ts">
import { nextTick, onMounted, onUnmounted, ref, watch, watchEffect } from "#imports";
import type { FeedbackUIProps } from "../types";
import useFeedbackWidget from "#nuxt-feedback/composables/use-feedback-widget";
import useFeedbackConfig from "#nuxt-feedback/composables/use-feedback-config";

const props = withDefaults(defineProps<FeedbackUIProps>(), {
  triggerLabel: "Share Feedback",
  triggerClass: "",
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
:where(.feedback-trigger) {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem 1rem;
  border: 1px solid #e5e5e5;
  border-radius: 0.375rem;
  background: #fff;
  color: #262626;
  font: inherit;
  font-size: 0.875rem;
  font-weight: 500;
  line-height: 1.25rem;
  cursor: pointer;
}

:where(.feedback-trigger:hover) {
  background: #fafafa;
}

:where(.feedback-trigger:focus-visible) {
  outline: 2px solid #737373;
  outline-offset: 2px;
}
</style>
