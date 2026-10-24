<script lang="ts" setup>
import type { DialogDescriptionProps } from "reka-ui";
import type { HTMLAttributes } from "vue";
import { reactiveOmit } from "@vueuse/core";
import { DialogDescription } from "reka-ui";
import { cn } from "cn";

const props = defineProps<
  DialogDescriptionProps & { class?: HTMLAttributes["class"] }
>();

const delegatedProps = reactiveOmit(props, "class");
</script>

<template>
  <DialogDescription
    data-slot="drawer-description"
    v-bind="delegatedProps"
    :class="cn('text-muted-foreground text-sm', props.class)"
  >
    <slot />
  </DialogDescription>
</template>
