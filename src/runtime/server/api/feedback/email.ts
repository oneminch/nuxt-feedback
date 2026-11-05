import {
  createError,
  defineEventHandler,
  readBody,
  useRuntimeConfig,
} from "#imports";
import type { FeedbackData } from "../../../types";
import { generateFeedbackEmailHtml, logger } from "#nuxt-feedback/utils";
import { Resend } from "resend";

export default defineEventHandler(async (event) => {
  const {
    resendApiKey,
    resendFrom,
    resendTo,
    public: {
      feedbackWidget: { siteName },
    },
  } = useRuntimeConfig();

  try {
    // Validate environment variables
    if (!resendApiKey.trim() || !resendFrom.trim() || !resendTo.trim()) {
      logger.error("Missing email environment variables for feedback widget.");

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

    // Initialize Resend client
    const resend = new Resend(resendApiKey);

    // Generate and send email content
    const messageBody = generateFeedbackEmailHtml(body, { showRawJson: true });

    const { error } = await resend.emails.send({
      from: `${siteName} <${resendFrom}>`,
      to: resendTo,
      subject: `New Feedback Submission (${siteName})`,
      html: messageBody,
    });

    // Handle any errors from the Resend API
    if (error) {
      logger.error("Resend API error:", error);

      throw createError({
        statusCode: 500,
        message: "A server error occurred while submitting feedback.",
      });
    }

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
