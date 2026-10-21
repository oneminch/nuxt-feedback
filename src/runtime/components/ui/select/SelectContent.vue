<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import { reactiveOmit } from "@vueuse/core";
import {
  SelectContent,
  type SelectContentEmits,
  type SelectContentProps,
  SelectPortal,
  SelectViewport,
  useForwardPropsEmits,
} from "reka-ui";
import { cn } from "#nuxt-feedback/utils";
import { usePortalTarget } from "#nuxt-feedback/composables/usePortalTarget";
import { SelectScrollDownButton, SelectScrollUpButton } from ".";

defineOptions({
  inheritAttrs: false,
});

const props = withDefaults(
  defineProps<SelectContentProps & { class?: HTMLAttributes["class"] }>(),
  {
    position: "popper",
  }
);
const emits = defineEmits<SelectContentEmits>();

const delegatedProps = reactiveOmit(props, "class");

const forwarded = useForwardPropsEmits(delegatedProps, emits);
const portalTarget = usePortalTarget();
</script>

<template>
  <SelectPortal :to="portalTarget">
    <SelectContent
      data-slot="select-content"
      v-bind="{ ...forwarded, ...$attrs }"
      :class="
        cn(
          'preflight',
          'nfw:bg-popover nfw:text-popover-foreground nfw:data-[state=open]:animate-in nfw:data-[state=closed]:animate-out nfw:data-[state=closed]:fade-out-0 nfw:data-[state=open]:fade-in-0 nfw:data-[state=closed]:zoom-out-95 nfw:data-[state=open]:zoom-in-95 nfw:data-[side=bottom]:slide-in-from-top-2 nfw:data-[side=left]:slide-in-from-right-2 nfw:data-[side=right]:slide-in-from-left-2 nfw:data-[side=top]:slide-in-from-bottom-2 nfw:relative nfw:z-50 nfw:max-h-(--reka-select-content-available-height) nfw:min-w-[8rem] nfw:overflow-x-hidden nfw:overflow-y-auto nfw:rounded-md nfw:border nfw:shadow-md',
          position === 'popper' &&
            'nfw:data-[side=bottom]:translate-y-1 nfw:data-[side=left]:-translate-x-1 nfw:data-[side=right]:translate-x-1 nfw:data-[side=top]:-translate-y-1',
          props.class
        )
      "
    >
      <SelectScrollUpButton />
      <SelectViewport
        :class="
          cn(
            'nfw:p-1',
            position === 'popper' &&
              'nfw:h-[var(--reka-select-trigger-height)] nfw:w-full nfw:min-w-[var(--reka-select-trigger-width)] nfw:scroll-my-1'
          )
        "
      >
        <slot />
      </SelectViewport>
      <SelectScrollDownButton />
    </SelectContent>
  </SelectPortal>
</template>
