<script setup lang="ts">
useSeoMeta({
  title: "Nuxt Feedback · Docs",
  ogTitle: "Nuxt Feedback · Docs",
  description: "Docs for Nuxt Feedback Module.",
  ogDescription: "Docs for Nuxt Feedback Module.",
  twitterCard: "summary_large_image",
  ogImage: "/cover.png",
});
</script>

<template>
  <NuxtRouteAnnouncer />

  <NuxtPage />
</template>

<style>
@reference './assets/css/main.css';

html,
body {
  @apply bg-neutral-50 dark:bg-neutral-900;
}

#__nuxt {
  @apply max-w-4xl p-10 mx-auto;
}
</style>
