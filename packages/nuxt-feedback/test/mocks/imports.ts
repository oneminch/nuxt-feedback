import { vi } from "vitest";

export const defineEventHandler = <T>(handler: T) => handler;
export const readBody = vi.fn();
export const useRuntimeConfig = vi.fn();
export const createError = (opts: { statusCode?: number; message?: string }) =>
  Object.assign(new Error(opts.message), { statusCode: opts.statusCode });
