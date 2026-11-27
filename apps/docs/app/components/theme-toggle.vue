<script setup lang="ts">
const colorMode = useColorMode();

function toggle() {
  colorMode.preference = colorMode.value === "dark" ? "light" : "dark";
}
</script>

<template>
  <button
    type="button"
    class="size-9 cursor-pointer rounded-lg inline-flex items-center justify-center text-xl hover:bg-neutral-100 dark:hover:bg-neutral-800"
    @click="toggle"
  >
    {{ colorMode.value === "dark" ? "☀️" : "🌙" }}
  </button>
</template>
