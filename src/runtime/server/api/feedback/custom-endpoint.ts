import {
  createError,
  defineEventHandler,
  readBody,
  useRuntimeConfig,
} from "#imports";
import { logger } from "#nuxt-feedback/utils";
import type { FeedbackData } from "../../../types";

export default defineEventHandler(async (event) => {
  const {
    public: {
      feedbackWidget: { siteName, customEndpoint },
    },
  } = useRuntimeConfig();

  try {
    const endpoint = customEndpoint.trim();

    // Validate environment variables
    if (!endpoint) {
      logger.error("Missing custom endpoint for feedback widget.");

      throw createError({
        statusCode: 500,
        message:
          "A server configuration error occurred. Please try again later.",
      });
    }

    // Validate that custom endpoint is a valid URL or path
    if (!/^https?:\/\//.test(endpoint) && !endpoint.startsWith("/")) {
      logger.error("Invalid custom endpoint format:", customEndpoint);

      throw createError({
        statusCode: 500,
        message:
          "A server configuration error occurred. Please try again later.",
      });
    }

    // Read and validate request body
    const body = await readBody<FeedbackData>(event);

    if (!body.reaction.trim()) {
      throw createError({
        statusCode: 400,
        message: "Please select a feedback option.",
      });
    }

    // Send data to custom endpoint
    await $fetch(customEndpoint, {
      method: "POST",
      body: { ...body, siteName },
      onResponseError: () => {
        logger.error("Custom API Endpoint Error");

        throw createError({
          statusCode: 500,
          message: "A server error occurred while submitting feedback.",
        });
      },
    });

    return {
      status: "success",
      message: "Thank you for your feedback!",
    };
  } catch (error) {
    return {
      error: true,
      status: "failure",
      message:
        error instanceof Error
          ? error.message
          : "An unknown error occurred. Please try again later.",
    };
  }
});
