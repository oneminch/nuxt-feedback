import { readonly, useState } from "#imports";
import type { UseFeedbackWidget } from "../types";

const useFeedbackWidget = (): UseFeedbackWidget => {
  const isWidgetMounted = useState("feedback-widget-mounted", () => false);
  const isOpen = useState("feedback-widget-state", () => false);

  const closeWidget = () => {
    if (!isWidgetMounted.value) {
      console.warn(
        "Widget component is not detected. Make sure to include <FeedbackWidget /> in your layout, page, or component."
      );
      return;
    }

    isOpen.value = false;
  };

  const openWidget = () => {
    if (!isWidgetMounted.value) {
      console.warn(
        "Widget component is not detected. Make sure to include <FeedbackWidget /> in your layout, page, or component."
      );
      return;
    }

    isOpen.value = true;
  };

  const registerWidget = () => {
    isWidgetMounted.value = true;
  };

  const unregisterWidget = () => {
    isWidgetMounted.value = false;
  };

  return {
    isOpen,
    closeWidget,
    openWidget,
    isWidgetMounted: readonly(isWidgetMounted),
    registerWidget,
    unregisterWidget,
  };
};

export default useFeedbackWidget;
