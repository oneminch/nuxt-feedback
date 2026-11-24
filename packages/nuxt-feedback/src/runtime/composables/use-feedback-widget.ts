import { useState } from "#imports";
import type { UseFeedbackWidget } from "../types";
import useFeedbackAvailability from "#nuxt-feedback/composables/use-feedback-availability";
import { getFeedbackWidgetStateKey } from "#nuxt-feedback/utils";

const useFeedbackWidget = (widgetId?: string): UseFeedbackWidget => {
  const isOpen = useState(getFeedbackWidgetStateKey(widgetId), () => false);
  const { isWidgetEnabled } = useFeedbackAvailability();

  const closeWidget = () => {
    isOpen.value = false;
  };

  const openWidget = () => {
    if (!isWidgetEnabled.value) return;
    isOpen.value = true;
  };

  return {
    isOpen,
    closeWidget,
    openWidget,
  };
};

export default useFeedbackWidget;
