<script setup lang="ts">
import { FEEDBACK_WIDGET_TAG } from "#nuxt-feedback/utils";

defineOptions({ inheritAttrs: false });
</script>

<template>
  <ClientOnly>
    <!-- Registered by the `feedback-widget.client` plugin; resolves to a plain tag. -->
    <component :is="FEEDBACK_WIDGET_TAG" v-bind="$attrs" />
  </ClientOnly>
</template>
