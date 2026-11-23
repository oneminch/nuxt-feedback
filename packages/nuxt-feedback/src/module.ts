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

declare module 'nuxt/schema' {
  interface RuntimeConfig {
    resendApiKey: string;
    resendFrom: string;
    resendTo: string;
    githubToken: string;
    githubRepo: string;
    githubOwner: string;
  }
  interface PublicRuntimeConfig {
    feedbackWidget: {
      siteName: string | undefined;
      customEndpoint: string | undefined;
      widgetEnabled: boolean
    }
  }
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
    const isStaticPreset = (() => {
      const preset = nuxt.options.nitro?.preset;
      return typeof preset === "string" &&
        (preset === "github-pages" || preset.includes("static"));
    })();
    const hasServer =
      !nuxt.options.nitro?.static && !(nuxt.options as any)._generate && !isStaticPreset;

    nuxt.options.alias["#nuxt-feedback"] = resolver.resolve("./runtime");

    if (!hasServer) {
      logger.warn(
        "[Feedback Widget]: No server detected (`nuxt generate` / static output preset). The widget trigger is disabled and feedback submissions are blocked.",
      );
    }

    let handler: string;

    if (METHODS.includes(options.method)) {
      handler = resolver.resolve(`./runtime/server/api/_nuxt-feedback/${options.method}`);
    } else {
      logger.warn("[Feedback Widget]: Please set a default feedback method in your config.");

      handler = resolver.resolve("./runtime/server/api/_nuxt-feedback/error");
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

    if (hasServer) {
      addServerHandler({
        route: "/api/_nuxt-feedback/submit",
        handler,
        method: "post",
      });
    }

    const moduleRuntimeConfig: any =
      nuxt.options.runtimeConfig.public.feedbackWidget;

    nuxt.options.runtimeConfig.public.feedbackWidget = defu(
      moduleRuntimeConfig,
      {
        siteName: options.siteName,
        customEndpoint: options.customEndpoint,
        widgetEnabled: hasServer,
      }
    );
  },
});
