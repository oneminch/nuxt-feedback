<script setup lang="ts">
const themeIcon = ref<"🔆" | "🌙">("🌙");

const toggleColorMode = () => {
  if (document.documentElement.classList.contains("dark")) {
    document.documentElement.classList.remove("dark");
    themeIcon.value = "🌙";
  } else {
    document.documentElement.classList.add("dark");
    themeIcon.value = "🔆";
  }
};

useSeoMeta({
  title: "Nuxt Feedback - Playground",
  ogTitle: "Nuxt Feedback - Playground",
  description: "Demo of Nuxt Feedback Module.",
  ogDescription: "Demo of Nuxt Feedback Module.",
  twitterCard: "summary_large_image",
  ogImage: "/cover.png",
});
</script>

<template>
  <div class="container">
    <header>
      <h1>
        <nuxt-link to="/">Nuxt Feedback</nuxt-link>
      </h1>

      <nav>
        <button
          :class="['btn btn--icon', { 'btn--dark': themeIcon === '🔆' }]"
          @click="toggleColorMode"
        >
          {{ themeIcon }}
        </button>
      </nav>
    </header>

    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<style>
* {
  font-family: sans-serif;
}

:root {
  --color-logo-green: #38c26b;
}

#__nuxt {
  position: absolute;
  inset: 0;
  padding: 1rem 2rem;
  background-color: oklch(98.4% 0.003 247.86);
}

.container {
  max-width: 1024px;
  margin: 0 auto;
  width: 100%;
  height: 100%;
}

header {
  display: flex;
  margin-bottom: 1rem;
  align-items: center;
  justify-content: space-between;
  padding: 0 0.5rem;
}

a {
  color: #262626;
  text-decoration: none;
}

h1 {
  font-size: 1.5rem;
  color: var(--color-logo-green);
}

.btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  height: 2.25rem;
  padding: 0.25rem 1.25rem;
  border-radius: 0.5rem;
  background-color: #fff;
  color: #262626;
  border: 1px solid oklch(92.5% 0.005 214.3);
  box-shadow: none;
  font-size: 0.95rem;
  cursor: pointer;
  &:hover {
    @media (hover: hover) {
      background-color: oklch(96.3% 0.002 197.1);
    }
  }
}

.btn > span {
  line-height: 1rem;
}

.btn--icon {
  width: 2.5rem;
  height: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50rem;
  font-size: 1rem;
}

.btn--fixed {
  position: fixed;
  right: 2.5rem;
  bottom: 2.5rem;
}

.btn--dark {
  background-color: #262626;
  color: #fff;
  border: 1px solid #3f3f3f;
  box-shadow: none;
  &:hover {
    @media (hover: hover) {
      background-color: #3f3f3f;
    }
  }
}
</style>
