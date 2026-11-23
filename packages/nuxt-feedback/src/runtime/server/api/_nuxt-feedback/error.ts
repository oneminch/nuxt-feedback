import { defineEventHandler } from "h3";
import { logger } from "#nuxt-feedback/utils";

export default defineEventHandler(() => {
  logger.error("Missing feedback method for widget.");

  return {
    error: true,
    status: "failure",
    message: "A server error occurred. Please try again later.",
  };
});
