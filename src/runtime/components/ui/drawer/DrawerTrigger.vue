<script lang="ts" setup>
import type { DialogTriggerProps } from "reka-ui";
import { DialogTrigger } from "reka-ui";

const props = defineProps<DialogTriggerProps>();
</script>

<template>
  <DialogTrigger data-slot="drawer-trigger" v-bind="props">
    <slot />
  </DialogTrigger>
</template>
