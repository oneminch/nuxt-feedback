import { inject, provide, type InjectionKey, type Ref } from "#imports";

const portalTargetKey: InjectionKey<Ref<HTMLElement | undefined>> =
  Symbol("nuxt-feedback-portal-target");

export const providePortalTarget = (target: Ref<HTMLElement | undefined>) => {
  provide(portalTargetKey, target);
};

export const usePortalTarget = () => inject(portalTargetKey, undefined);
