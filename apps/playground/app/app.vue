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
        <nuxt-link to="/">
          <img src="/logo.svg" alt="Widget Logo" class="" />
          <span>Nuxt Feedback</span>
        </nuxt-link>
      </h1>

      <nav>
        <nuxt-link class="btn demo-link" to="/demo">More Demos</nuxt-link>
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

header nav {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

h1 {
  font-size: 1.5rem;
  color: var(--color-logo-green);
  display: flex;
  align-items: center;
  justify-content: center;
}

a {
  color: #262626;
  text-decoration: none;
}

h1 a {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

h1 img {
  width: 3rem;
  height: 3rem;
}

.demo-link {
  height: 2rem;
  border-radius: 5rem;
}
</style>
