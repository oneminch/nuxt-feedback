<script setup lang="ts">
import { cn } from "cn";

defineProps<{
  errorMessage?: string;
}>();
</script>

<template>
  <p
    aria-live="polite"
    :class="
      cn(
        'text-xs mt-1.5 mb-2.5 h-3 leading-3 transition-all duration-150 translate-y-0.25 opacity-0 invisible text-rose-500',
        {
          'translate-y-0 opacity-100 visible': errorMessage,
        },
      )
    "
  >
    {{ errorMessage }}
  </p>
</template>
