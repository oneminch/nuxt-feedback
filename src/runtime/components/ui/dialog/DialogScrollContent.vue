<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import { reactiveOmit } from "@vueuse/core";
import { X } from "lucide-vue-next";
import {
  DialogClose,
  DialogContent,
  type DialogContentEmits,
  type DialogContentProps,
  DialogOverlay,
  DialogPortal,
  useForwardPropsEmits,
} from "reka-ui";
import { cn } from "#nuxt-feedback/utils";
import { usePortalTarget } from "#nuxt-feedback/composables/usePortalTarget";

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
    <DialogOverlay
      class="nfw:fixed nfw:inset-0 nfw:z-50 nfw:grid nfw:place-items-center nfw:overflow-y-auto nfw:bg-black/80 nfw:data-[state=open]:animate-in nfw:data-[state=closed]:animate-out nfw:data-[state=closed]:fade-out-0 nfw:data-[state=open]:fade-in-0"
    >
      <DialogContent
        :class="
          cn(
            'preflight',
            'nfw:relative nfw:z-50 nfw:grid nfw:w-full nfw:max-w-lg nfw:my-8 nfw:gap-4 nfw:border nfw:border-border nfw:bg-background nfw:p-6 nfw:shadow-lg nfw:duration-200 nfw:sm:rounded-lg nfw:md:w-full',
            props.class
          )
        "
        v-bind="forwarded"
        @pointer-down-outside="
          (event) => {
            const originalEvent = event.detail.originalEvent;
            const target = originalEvent.target as HTMLElement;
            if (
              originalEvent.offsetX > target.clientWidth ||
              originalEvent.offsetY > target.clientHeight
            ) {
              event.preventDefault();
            }
          }
        "
      >
        <slot />

        <DialogClose
          class="nfw:absolute nfw:top-4 nfw:right-4 nfw:p-0.5 nfw:transition-colors nfw:rounded-md nfw:hover:bg-secondary"
        >
          <X class="nfw:w-4 nfw:h-4" />
          <span class="nfw:sr-only">Close</span>
        </DialogClose>
      </DialogContent>
    </DialogOverlay>
  </DialogPortal>
</template>
