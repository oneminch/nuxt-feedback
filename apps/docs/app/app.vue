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
          Playground for <span>Nuxt Feedback</span>
        </nuxt-link>
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

    <FeedbackWidget
      aria-label="Share Feedback"
      trigger-label="💬"
      trigger-class="btn--icon btn--fixed"
      :with-topics="false"
    />
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
}

a {
  color: #262626;
  text-decoration: none;
}

h1 {
  font-size: 1.5rem;
}

h1 span {
  color: var(--color-logo-green);
}

.btn {
  height: 2.25rem;
  padding: 0.25rem 1.25rem;
  border-radius: 5rem;
  box-sizing: border-box;
  background-color: #fff;
  color: #262626;
  border: 1px solid oklch(92.5% 0.005 214.3);
  box-shadow: none;
  font-size: 1rem;
  &:hover {
    @media (hover: hover) {
      background-color: oklch(96.3% 0.002 197.1);
    }
  }
}

.btn--primary {
  background-color: oklch(89.7% 0.196 126.665);
  color: #262626;
  border: 1px solid oklch(76.8% 0.233 130.85);
  box-shadow: none;
  &:hover {
    @media (hover: hover) {
      background-color: oklch(84.1% 0.238 128.85);
    }
  }
}

.btn--icon {
  width: 2.25rem;
  height: 2.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  /* line-height: 1.2; */
  border-radius: 50rem;
  padding: 0.5rem;
  font-size: 1rem;
}

.btn--fixed {
  width: 3rem;
  height: 3rem;
  position: fixed;
  right: 2.5rem;
  bottom: 2.5rem;
  &:hover {
    @media (hover: hover) {
      background-color: oklch(96.3% 0.002 197.1);
    }
  }
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
