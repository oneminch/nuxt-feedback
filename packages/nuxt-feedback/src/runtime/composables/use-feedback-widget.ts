import { useState } from "#imports";
import type { UseFeedbackWidget } from "../types";
import useFeedbackAvailability from "#nuxt-feedback/composables/use-feedback-availability";

const useFeedbackWidget = (): UseFeedbackWidget => {
  const isOpen = useState("feedback-widget-state", () => false);
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
