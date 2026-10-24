import {
  defineNuxtModule,
  addVitePlugin,
  createResolver,
  addComponent,
  addServerHandler,
  useLogger,
  addImports,
  addPlugin,
} from "@nuxt/kit";
import { defu } from "defu";
import { name, version } from "../package.json";

export interface ModuleOptions {
  method: "email" | "github" | "custom-endpoint";
  siteName?: string;
  customEndpoint?: string;
}

export type * from "./runtime/types";

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name,
    version,
    configKey: "feedbackWidget",
    docs: "https://github.com/oneminch/nuxt-feedback/#readme",
  },
  defaults: {
    siteName: "My Nuxt App",
  },
  async setup(options, nuxt) {
    const resolver = createResolver(import.meta.url);
    const logger = useLogger("feedback-widget");

    nuxt.options.alias["#nuxt-feedback"] = resolver.resolve("./runtime");

    // Check nitro.options.static in the nitro:init hook

    // const isSSG = !!nuxt.options.nitro?.prerender || nuxt.options.nitro.static;

    // if (isSSG) {
    //   logger.warn(
    //     "[Feedback Widget]: The feedback widget requires a server to work properly.",
    //   );
    // }

    if (!options.method) {
      logger.warn("[Feedback Widget]: Please Pick a Default Feedback Method.");
    }

    await import("@tailwindcss/vite").then((r) => addVitePlugin(r.default));

    addImports({
      name: "default",
      as: "useFeedbackWidget",
      from: resolver.resolve("./runtime/composables/useFeedbackWidget"),
    });

    addComponent({
      name: "FeedbackWidget",
      filePath: resolver.resolve("./runtime/components/FeedbackWidgetElement.vue"),
    });

    addPlugin(resolver.resolve("./runtime/plugins/feedback-widget.client"));

    if (options.method === "email") {
      addServerHandler({
        route: "/api/submit-feedback",
        handler: resolver.resolve("./runtime/server/api/feedback/email"),
        method: "post",
      });
    } else if (options.method === "github") {
      addServerHandler({
        route: "/api/submit-feedback",
        handler: resolver.resolve("./runtime/server/api/feedback/github"),
        method: "post",
      });
    } else if (options.method === "custom-endpoint") {
      addServerHandler({
        route: "/api/submit-feedback",
        handler: resolver.resolve("./runtime/server/api/feedback/custom"),
        method: "post",
      });
    } else {
      addServerHandler({
        route: "/api/submit-feedback",
        handler: resolver.resolve("./runtime/server/api/feedback/error"),
        method: "post",
      });
    }

    const moduleRuntimeConfig =
      nuxt.options.runtimeConfig.public.feedbackWidget;

    nuxt.options.runtimeConfig.public.feedbackWidget = defu(
      moduleRuntimeConfig,
      {
        siteName: options.siteName,
        customEndpoint: options.customEndpoint,
      }
    );
  },
});
