import { useState } from "#imports";
import type { FeedbackModalProps } from "../types";

/**
 * Configuration handed from the `<FeedbackWidget />` trigger (light DOM) to
 * the modal custom element, which renders in a separate Vue app.
 */
const useFeedbackConfig = () =>
  useState<FeedbackModalProps>("feedback-widget-config", () => ({}));

export default useFeedbackConfig;
