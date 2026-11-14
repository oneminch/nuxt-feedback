import { ref, type Ref } from "vue";
import { vi } from "vitest";

export {
  computed,
  nextTick,
  onMounted,
  onUnmounted,
  readonly,
  ref,
  watch,
  watchEffect,
} from "vue";

// Server helpers
export const defineEventHandler = <T>(handler: T) => handler;
export const readBody = vi.fn();
export const useRuntimeConfig = vi.fn();
export const createError = (
  opts: string | { statusCode?: number; message?: string }
) => {
  const o = typeof opts === "string" ? { message: opts } : opts;
  return Object.assign(new Error(o.message), { statusCode: o.statusCode });
};

// Client helpers: `useState` shares refs by key, like Nuxt's payload state.
const state = new Map<string, Ref<unknown>>();
export const useState = <T>(key: string, init: () => T): Ref<T> => {
  if (!state.has(key)) state.set(key, ref(init()));
  return state.get(key) as Ref<T>;
};
export const resetState = () => state.clear();

export const useRoute = vi.fn(() => ({
  fullPath: "/test?x=1",
  hash: "",
  query: { x: "1" },
  name: "test",
  path: "/test",
  redirectedFrom: undefined,
}));
