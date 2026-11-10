import { inject, provide, useShadowRoot, type InjectionKey } from "vue";

// Teleport accepts a ShadowRoot at runtime, but reka-ui types `to` as HTMLElement.
const portalTargetKey: InjectionKey<HTMLElement | undefined> = Symbol(
  "nuxt-feedback-portal-target"
);

/**
 * Call from the custom element's root component. Overlay content (dialogs,
 * drawers, popovers) must be teleported into the shadow root, otherwise it
 * renders in `<body>` and loses the widget's styles.
 * `useShadowRoot` only works in the root component, hence provide/inject.
 */
export const providePortalTarget = () => {
  provide(
    portalTargetKey,
    (useShadowRoot() ?? undefined) as unknown as HTMLElement | undefined
  );
};

export const usePortalTarget = () => inject(portalTargetKey, undefined);
