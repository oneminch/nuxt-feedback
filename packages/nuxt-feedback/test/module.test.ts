import { beforeEach, describe, expect, it, vi } from "vitest";
import type { ModuleOptions } from "../src/module";
import feedbackModule from "../src/module";

const mocks = vi.hoisted(() => ({
  addServerHandler: vi.fn(),
  addVitePlugin: vi.fn(),
  addImports: vi.fn(),
  addComponent: vi.fn(),
  addPlugin: vi.fn(),
  warn: vi.fn(),
}));

vi.mock("@nuxt/kit", () => ({
  defineNuxtModule: (definition: unknown) => definition,
  createResolver: () => ({ resolve: (path: string) => `/resolved/${path}` }),
  useLogger: () => ({ warn: mocks.warn }),
  addServerHandler: mocks.addServerHandler,
  addVitePlugin: mocks.addVitePlugin,
  addImports: mocks.addImports,
  addComponent: mocks.addComponent,
  addPlugin: mocks.addPlugin,
}));

type NuxtLike = {
  options: {
    alias: Record<string, string>;
    nitro?: { static?: boolean };
    runtimeConfig: { public: Record<string, any> };
    _generate?: boolean;
  };
};

const createNuxt = (): NuxtLike => ({
  options: {
    alias: {},
    nitro: {},
    runtimeConfig: { public: {} },
  },
});

describe("module", () => {
  beforeEach(() => {
    Object.values(mocks).forEach((mock) => mock.mockClear());
  });

  it("skips the submission route and disables the widget when no server is available", async () => {
    const nuxt = createNuxt();
    nuxt.options.nitro = { static: true };

    await feedbackModule.setup({ method: "custom-endpoint" } as ModuleOptions, nuxt as any);

    expect(mocks.addServerHandler).not.toHaveBeenCalled();
    expect(mocks.warn).toHaveBeenCalledWith(expect.stringContaining("No server detected"));
    expect(nuxt.options.runtimeConfig.public.feedbackWidget.serverAvailable).toBe(false);
  });

  it("registers the submission route when a server is available", async () => {
    const nuxt = createNuxt();

    await feedbackModule.setup({ method: "custom-endpoint" } as ModuleOptions, nuxt as any);

    expect(mocks.addServerHandler).toHaveBeenCalledOnce();
    expect(mocks.addServerHandler).toHaveBeenCalledWith(
      expect.objectContaining({
        route: "/api/submit-feedback",
        method: "post",
        handler: expect.stringContaining("custom-endpoint"),
      }),
    );
    expect(nuxt.options.runtimeConfig.public.feedbackWidget.serverAvailable).toBe(true);
  });
});
