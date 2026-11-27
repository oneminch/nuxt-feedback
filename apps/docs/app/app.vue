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
