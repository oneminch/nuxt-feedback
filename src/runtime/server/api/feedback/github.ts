import {
  createError,
  defineEventHandler,
  readBody,
  useRuntimeConfig,
} from "#imports";
import {
  generateFeedbackGitHubIssueMarkdown,
  logger,
} from "#nuxt-feedback/utils";
import type { FeedbackData } from "../../../types";

export default defineEventHandler(async (event) => {
  const {
    githubToken,
    githubRepo,
    githubOwner,
    public: {
      feedbackWidget: { siteName },
    },
  } = useRuntimeConfig();

  try {
    // Validate environment variables
    if (!githubToken.trim() || !githubRepo.trim() || !githubOwner.trim()) {
      logger.error("Missing GitHub environment variables for feedback widget.");

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

    // Prepare GitHub issue data
    const issueTitle = `[Feedback] ${siteName}`;
    const issueBody = generateFeedbackGitHubIssueMarkdown(body);

    // Submit issue to GitHub
    await $fetch(
      `https://api.github.com/repos/${githubOwner}/${githubRepo}/issues`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${githubToken}`,
          Accept: "application/vnd.github+json",
          "X-GitHub-Api-Version": "2022-11-28",
        },
        body: {
          title: issueTitle,
          body: issueBody,
          labels: ["feedback", ...(body.reaction ? [body.reaction] : [])],
        },
        onResponseError: () => {
          logger.error("GitHub API Error");

          throw createError({
            statusCode: 500,
            message: "A server error occurred while submitting feedback.",
          });
        },
      }
    );

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
