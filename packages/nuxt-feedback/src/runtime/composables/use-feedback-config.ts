import { useState } from "#imports";
import type { FeedbackModalProps } from "../types";
import { getFeedbackWidgetConfigKey } from "#nuxt-feedback/utils";

/**
 * Configuration handed from the `<FeedbackWidget />` trigger (light DOM) to
 * the modal custom element, which renders in a separate Vue app.
 */
const useFeedbackConfig = (widgetId?: string) =>
  useState<FeedbackModalProps>(getFeedbackWidgetConfigKey(widgetId), () => ({}));

export default useFeedbackConfig;
