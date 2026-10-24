<script lang="ts" setup>
import type { DialogContentEmits, DialogContentProps } from "reka-ui";
import type { HTMLAttributes } from "vue";
import { reactiveOmit } from "@vueuse/core";
import { DialogContent, DialogPortal, useForwardPropsEmits } from "reka-ui";
import { cn } from "cn";
import { usePortalTarget } from "#nuxt-feedback/composables/usePortalTarget";
import DrawerOverlay from "./DrawerOverlay.vue";

const props = defineProps<
  DialogContentProps & { class?: HTMLAttributes["class"] }
>();
const emits = defineEmits<DialogContentEmits>();

const delegatedProps = reactiveOmit(props, "class");

const forwarded = useForwardPropsEmits(delegatedProps, emits);
const portalTarget = usePortalTarget();
</script>

<template>
  <DialogPortal :to="portalTarget">
    <DrawerOverlay />
    <DialogContent
      data-slot="drawer-content"
      v-bind="forwarded"
      :class="
        cn(
          'bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom fixed inset-x-0 bottom-0 z-50 mt-24 flex h-auto max-h-[80vh] flex-col rounded-t-lg duration-300',
          props.class,
        )
      "
    >
      <div
        class="bg-muted mx-auto mt-4 h-2 w-[100px] shrink-0 rounded-full"
      />
      <slot />
    </DialogContent>
  </DialogPortal>
</template>
