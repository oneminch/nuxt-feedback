<script setup lang="ts">
import SuccessIcon from "#nuxt-feedback/components/icons/Success.vue";
import FailureIcon from "#nuxt-feedback/components/icons/Failure.vue";
import type { SubmissionStatus } from "../types";

defineProps<{
  status: SubmissionStatus;
  message: string;
}>();
</script>

<template>
  <div
    class="flex flex-col items-center justify-center gap-6 p-6"
    role="status"
    aria-live="polite"
  >
    <SuccessIcon
      v-if="status === 'success'"
      class="size-16 text-green-500"
    />
    <FailureIcon v-else class="size-16 text-rose-500" />
    <h3
      class="text-xl text-center text-zinc-900 dark:text-zinc-50 font-medium"
    >
      {{ message }}
    </h3>
  </div>
</template>
