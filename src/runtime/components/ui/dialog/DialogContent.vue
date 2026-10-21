<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import { reactiveOmit } from "@vueuse/core";
import { X } from "lucide-vue-next";
import {
  DialogClose,
  DialogContent,
  type DialogContentEmits,
  type DialogContentProps,
  DialogPortal,
  useForwardPropsEmits,
} from "reka-ui";
import { cn } from "#nuxt-feedback/utils";
import { usePortalTarget } from "#nuxt-feedback/composables/usePortalTarget";
import DialogOverlay from "#nuxt-feedback/components/ui/dialog/DialogOverlay.vue";

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
    <DialogOverlay />
    <DialogContent
      data-slot="dialog-content"
      v-bind="forwarded"
      :class="
        cn(
          'preflight',
          'nfw:bg-background nfw:data-[state=open]:animate-in nfw:data-[state=closed]:animate-out nfw:data-[state=closed]:fade-out-0 nfw:data-[state=open]:fade-in-0 nfw:data-[state=closed]:zoom-out-95 nfw:data-[state=open]:zoom-in-95 nfw:fixed nfw:top-[50%] nfw:left-[50%] nfw:z-50 nfw:grid nfw:w-full nfw:max-w-[calc(100%-2rem)] nfw:translate-x-[-50%] nfw:translate-y-[-50%] nfw:gap-4 nfw:rounded-lg nfw:border nfw:p-4 nfw:shadow-lg nfw:duration-200 nfw:sm:max-w-lg',
          props.class
        )
      "
    >
      <slot />

      <DialogClose
        class="nfw:ring-offset-background nfw:focus:ring-ring nfw:data-[state=open]:bg-accent nfw:data-[state=open]:text-muted-foreground nfw:absolute nfw:top-4 nfw:right-6 nfw:rounded-xs nfw:opacity-70 nfw:transition-opacity nfw:hover:opacity-100 nfw:focus:ring-2 nfw:focus:ring-offset-2 nfw:focus:outline-hidden nfw:disabled:pointer-events-none nfw:[&_svg]:pointer-events-none nfw:[&_svg]:shrink-0 nfw:[&_svg:not([class*='nfw:size-'])]:size-4 nfw:p-0.5!"
      >
        <X />
        <span class="nfw:sr-only">Close</span>
      </DialogClose>
    </DialogContent>
  </DialogPortal>
</template>
