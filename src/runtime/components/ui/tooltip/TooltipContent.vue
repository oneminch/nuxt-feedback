<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import { reactiveOmit } from "@vueuse/core";
import {
  TooltipContent,
  type TooltipContentEmits,
  type TooltipContentProps,
  TooltipPortal,
  useForwardPropsEmits,
} from "reka-ui";
import { cn } from "#nuxt-feedback/utils";
import { usePortalTarget } from "#nuxt-feedback/composables/usePortalTarget";

defineOptions({
  inheritAttrs: false,
});

const props = withDefaults(
  defineProps<TooltipContentProps & { class?: HTMLAttributes["class"] }>(),
  {
    class: "",
    sideOffset: 4,
  }
);

const emits = defineEmits<TooltipContentEmits>();

const delegatedProps = reactiveOmit(props, "class");
const forwarded = useForwardPropsEmits(delegatedProps, emits);
const portalTarget = usePortalTarget();
</script>

<template>
  <TooltipPortal :to="portalTarget">
    <TooltipContent
      data-slot="tooltip-content"
      v-bind="{ ...forwarded, ...$attrs }"
      :class="
        cn(
          'preflight',
          'nfw:bg-primary nfw:text-primary-foreground nfw:animate-in nfw:fade-in-0 nfw:zoom-in-95 nfw:data-[state=closed]:animate-out nfw:data-[state=closed]:fade-out-0 nfw:data-[state=closed]:zoom-out-95 nfw:data-[side=bottom]:slide-in-from-top-2 nfw:data-[side=left]:slide-in-from-right-2 nfw:data-[side=right]:slide-in-from-left-2 nfw:data-[side=top]:slide-in-from-bottom-2 nfw:z-50 nfw:w-fit nfw:rounded-md nfw:px-3 nfw:py-1.5 nfw:text-xs nfw:text-balance',
          props.class
        )
      "
    >
      <slot />

      <!-- <TooltipArrow
        class="nfw:bg-primary nfw:fill-primary nfw:z-50 nfw:size-2.5 nfw:translate-y-[calc(-50%_-_2px)] nfw:rotate-45 nfw:rounded-[2px]"
      /> -->
    </TooltipContent>
  </TooltipPortal>
</template>
