<script lang="ts" setup>
import type { DialogContentEmits, DialogContentProps } from "reka-ui";
import type { HTMLAttributes } from "vue";
import { useForwardPropsEmits } from "reka-ui";
import { DrawerContent, DrawerPortal } from "vaul-vue";
import { cn } from "#nuxt-feedback/utils";
import { usePortalTarget } from "#nuxt-feedback/composables/usePortalTarget";
import DrawerOverlay from "./DrawerOverlay.vue";

const props = defineProps<
  DialogContentProps & { class?: HTMLAttributes["class"] }
>();
const emits = defineEmits<DialogContentEmits>();

const forwarded = useForwardPropsEmits(props, emits);
const portalTarget = usePortalTarget();
</script>

<template>
  <DrawerPortal :to="portalTarget">
    <DrawerOverlay />
    <DrawerContent
      data-slot="drawer-content"
      v-bind="forwarded"
      :class="
        cn(
          'preflight',
          `nfw:group/drawer-content nfw:bg-background nfw:fixed nfw:z-50 nfw:flex nfw:h-auto nfw:flex-col`,
          `nfw:data-[vaul-drawer-direction=top]:inset-x-0 nfw:data-[vaul-drawer-direction=top]:top-0 nfw:data-[vaul-drawer-direction=top]:mb-24 nfw:data-[vaul-drawer-direction=top]:max-h-[80vh] nfw:data-[vaul-drawer-direction=top]:rounded-b-lg`,
          `nfw:data-[vaul-drawer-direction=bottom]:inset-x-0 nfw:data-[vaul-drawer-direction=bottom]:bottom-0 nfw:data-[vaul-drawer-direction=bottom]:mt-24 nfw:data-[vaul-drawer-direction=bottom]:max-h-[80vh] nfw:data-[vaul-drawer-direction=bottom]:rounded-t-lg`,
          `nfw:data-[vaul-drawer-direction=right]:inset-y-0 nfw:data-[vaul-drawer-direction=right]:right-0 nfw:data-[vaul-drawer-direction=right]:w-3/4 nfw:data-[vaul-drawer-direction=right]:sm:max-w-sm`,
          `nfw:data-[vaul-drawer-direction=left]:inset-y-0 nfw:data-[vaul-drawer-direction=left]:left-0 nfw:data-[vaul-drawer-direction=left]:w-3/4 nfw:data-[vaul-drawer-direction=left]:sm:max-w-sm`,
          props.class
        )
      "
    >
      <div
        class="nfw:bg-muted nfw:mx-auto nfw:mt-4 nfw:hidden nfw:h-2 nfw:w-[100px] nfw:shrink-0 nfw:rounded-full nfw:group-data-[vaul-drawer-direction=bottom]/drawer-content:block"
      />
      <slot />
    </DrawerContent>
  </DrawerPortal>
</template>
