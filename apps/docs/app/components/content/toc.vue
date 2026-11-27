<script setup lang="ts">
import type { TocLink } from "@nuxt/content";

defineProps<{ links: TocLink[] | undefined }>();
</script>

<template>
  <nav v-if="links">
    <details
      class="border border-emerald-600/25 bg-emerald-500/10 px-4 py-2 rounded-lg not-prose text-neutral-900 dark:text-neutral-50"
    >
      <summary class="cursor-pointer list-none appearance-none font-semibold">
        <span class="text-emerald-500 text-xl mr-2 arrow-right">&plus;</span>
        <span class="text-emerald-500 text-xl mr-2 arrow-down">&minus;</span>
        <h2 class="inline-block text-base">Table of Contents</h2>
      </summary>

      <toc-root
        :links="links"
        class="ml-1.5 text-neutral-700 dark:text-neutral-200"
      />
    </details>
  </nav>
</template>

<style scoped>
details > summary::marker,
details > summary::-webkit-details-marker {
  @apply hidden;
}

/* Collapsed */
details > summary .arrow-right {
  @apply inline-block;
}
details > summary .arrow-down {
  @apply hidden;
}

/* Expanded */
details[open] > summary .arrow-down {
  @apply inline-block;
}
details[open] > summary .arrow-right {
  @apply hidden;
}
</style>
