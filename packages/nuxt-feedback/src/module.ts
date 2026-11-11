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
import { SUBMISSION_METHODS as METHODS } from './runtime/utils';

export type * from "./runtime/types";

export interface ModuleOptions {
  method: typeof METHODS[number]
  siteName?: string;
  customEndpoint?: string;
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name,
    version,
    configKey: "feedbackWidget",
    docs: "https://nuxt-feedback.minch.dev",
  },
  defaults: {
    siteName: "My Nuxt App",
  },
  async setup(options, nuxt) {
    const resolver = createResolver(import.meta.url);
    const logger = useLogger(name);

    nuxt.options.alias["#nuxt-feedback"] = resolver.resolve("./runtime");

    // Check nitro.options.static in the nitro:init hook

    // const isSSG = !!nuxt.options.nitro?.prerender || nuxt.options.nitro.static;

    // if (isSSG) {
    //   logger.warn(
    //     "[Feedback Widget]: The feedback widget requires a server to work properly.",
    //   );
    // }

    let handler: string;

    if (METHODS.includes(options.method)) {
      handler = resolver.resolve(`./runtime/server/api/feedback/${options.method}`);
    } else {
      logger.warn("[Feedback Widget]: Please set a default feedback method in your config.");

      handler = resolver.resolve("./runtime/server/api/feedback/error");
    }

    await import("@tailwindcss/vite").then((r) => addVitePlugin(r.default));

    addImports({
      name: "default",
      as: "useFeedbackWidget",
      from: resolver.resolve("./runtime/composables/use-feedback-widget"),
    });

    addComponent({
      name: "FeedbackWidget",
      filePath: resolver.resolve("./runtime/components/feedback-trigger.vue"),
    });

    addPlugin(resolver.resolve("./runtime/plugins/feedback-widget.client"));

    addServerHandler({
      route: "/api/submit-feedback",
      handler,
      method: "post",
    });

    const moduleRuntimeConfig: any =
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
