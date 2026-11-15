import { computed, useRuntimeConfig } from "#imports";

type FeedbackWidgetRuntimeConfig =
  | {
      public?: {
        feedbackWidget?: {
          widgetEnabled?: boolean;
          serverAvailable?: boolean;
        };
      };
    }
  | undefined;

const useFeedbackAvailability = () => {
  const runtimeConfig = useRuntimeConfig() as FeedbackWidgetRuntimeConfig;

  const isWidgetEnabled = computed(() => {
    const config = runtimeConfig?.public?.feedbackWidget;

    if (config?.widgetEnabled !== undefined) {
      return config.widgetEnabled;
    }

    if (config?.serverAvailable !== undefined) {
      return config.serverAvailable;
    }

    return true;
  });

  return {
    isWidgetEnabled,
  };
};

export default useFeedbackAvailability;
