<script setup lang="ts">
import type { TocLink } from "@nuxt/content";

defineProps<{ links: TocLink[] }>();
</script>

<template>
  <ul class="pl-7 border-l border-neutral-500/20 list-none">
    <li v-for="link in links" :key="link.id">
      <nuxt-link
        :to="`#${link.id}`"
        class="text-[15px] underline decoration-1 decoration-dashed decoration-emerald-400"
      >
        {{ link.text }}
      </nuxt-link>

      <!-- Recursively render children if they exist -->
      <toc-root v-if="link.children" :links="link.children" class="pl-5!" />
    </li>
  </ul>
</template>
