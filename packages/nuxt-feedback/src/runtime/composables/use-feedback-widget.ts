import { useState } from "#imports";
import type { UseFeedbackWidget } from "../types";

const useFeedbackWidget = (): UseFeedbackWidget => {
  const isOpen = useState("feedback-widget-state", () => false);

  const closeWidget = () => {
    isOpen.value = false;
  };

  const openWidget = () => {
    isOpen.value = true;
  };

  return {
    isOpen,
    closeWidget,
    openWidget,
  };
};

export default useFeedbackWidget;
