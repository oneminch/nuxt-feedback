import { computed, useRuntimeConfig } from "#imports";
import type { FeedbackWidgetRuntimeConfig } from '../types';

const useFeedbackAvailability = () => {
  const runtimeConfig = useRuntimeConfig() as FeedbackWidgetRuntimeConfig | undefined;

  const isWidgetEnabled = computed(() => {
    const config = runtimeConfig?.public?.feedbackWidget;

    if (config?.widgetEnabled !== undefined) {
      return config.widgetEnabled;
    }

    return true;
  });

  return {
    isWidgetEnabled,
  };
};

export default useFeedbackAvailability;
