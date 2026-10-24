import type { FeedbackData, FeedbackFormState } from "./types";
import type { RouteLocationNormalizedLoadedGeneric } from "#vue-router";
import DOMPurify from "isomorphic-dompurify";

export const FEEDBACK_WIDGET_TAG = "nuxt-feedback-widget";

export const defaultReactions = [
  ["hate-it", "Hate it!"],
  ["not-great", "Not great."],
  ["its-okay", "It's okay."],
  ["love-it", "Love it!"],
] as const;

export type Reactions = typeof defaultReactions;

export const logger = {
  error: (...args: unknown[]) => console.error("[Feedback Widget]", ...args),
  info: (...args: unknown[]) => console.info("[Feedback Widget]", ...args),
  warn: (...args: unknown[]) => console.warn("[Feedback Widget]", ...args),
  log: (...args: unknown[]) => console.log("[Feedback Widget]", ...args),
};

export const createFormData = (
  route: RouteLocationNormalizedLoadedGeneric,
  formState: FeedbackFormState
): FeedbackData => {
  return {
    metadata: {
      route: {
        fullPath: route.fullPath,
        hash: route.hash,
        query: route.query,
        name: route.name,
        path: route.path,
        redirectedFrom: route.redirectedFrom,
      },
      time: {
        timestamp: new Date().toISOString(),
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      },
    },
    topic: formState.topic,
    reaction: formState.reaction,
    message: formState.message,
  } satisfies FeedbackData;
};

export function formatDateTime(timestamp: string) {
  return new Date(timestamp).toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    timeZoneName: "short",
  });
}

export function sanitizeUserInput(input: string, maxLength?: number): string {
  if (!input.trim()) return "N/A";

  const cleaned = DOMPurify.sanitize(input, {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: [],
  }).trim();

  const normalized = cleaned.replace(/\s+/g, " ");

  return maxLength ? normalized.slice(0, maxLength) : normalized;
}

export function generateFeedbackEmailHtml(
  data: FeedbackData,
  options?: { showRawJson?: boolean }
): string {
  const { topic, reaction, message, metadata } = data;
  const { route, time } = metadata;

  const sanitizedTopic = sanitizeUserInput(topic, 15);
  const sanitizedReaction = sanitizeUserInput(reaction, 100);
  const sanitizedMessage = sanitizeUserInput(message, 1000);

  const rawJson = JSON.stringify(data, null, 2);
  const showRaw = options?.showRawJson;

  return `
    <div style="font-family: Arial, sans-serif; color: #222;">
      <h2>New Feedback Received</h2>

      <div style="background: #fffbeb; border: 1px solid #fbbf24; padding: 12px 16px; margin-bottom: 1.5em; border-radius: 4px; color: #78350f; font-size: 0.95rem;">
        <strong>⚠️ Safety Notice:</strong>
        This feedback contains user-submitted content. Be cautious with any links or attachments, and avoid clicking unfamiliar URLs.
      </div>

      <table style="border: 1px solid #bbb; border-radius: 8px; border-collapse: separate; border-spacing: 0; margin-bottom: 1em; box-shadow: 0 2px 8px #0001; overflow: hidden;">
        <tbody>
          <tr>
            <td style="font-weight: bold; padding: 8px 12px; border-bottom: 1px solid #eee; border-right: 1px solid #eee; background: #f8fafc;">Topic:</td>
            <td style="padding: 8px 12px; border-bottom: 1px solid #eee;">${sanitizedTopic}</td>
          </tr>
          <tr>
            <td style="font-weight: bold; padding: 8px 12px; border-bottom: 1px solid #eee; border-right: 1px solid #eee; background: #f8fafc;">Reaction:</td>
            <td style="padding: 8px 12px; border-bottom: 1px solid #eee;">${sanitizedReaction}</td>
          </tr>
          <tr>
            <td style="font-weight: bold; padding: 8px 12px; border-bottom: 1px solid #eee; border-right: 1px solid #eee; background: #f8fafc;">Message:</td>
            <td style="padding: 8px 12px; border-bottom: 1px solid #eee; white-space: pre-line;">${sanitizedMessage}</td>
          </tr>
          <tr>
            <td style="font-weight: bold; padding: 8px 12px; border-bottom: 1px solid #eee; border-right: 1px solid #eee; background: #f8fafc;">Route:</td>
            <td style="padding: 8px 12px; border-bottom: 1px solid #eee;">
              <div><b>Path:</b> ${route.path}</div>
              <div><b>Full Path:</b> ${route.fullPath}</div>
              <div><b>Name:</b> ${route.name?.toString() ?? ""}</div>
              <div><b>Hash:</b> ${route.hash || "N/A"}</div>
              <div><b>Redirected From:</b> ${route.redirectedFrom
      ? JSON.stringify(route.redirectedFrom)
      : "N/A"
    }</div>
              <div><b>Query:</b> <code>${JSON.stringify(
      route.query
    )}</code></div>
            </td>
          </tr>
          <tr>
            <td style="font-weight: bold; padding: 8px 12px; background: #f8fafc; border-right: 1px solid #eee;">Timestamp:</td>
            <td style="padding: 8px 12px;">
              ${formatDateTime(time.timestamp)} (${time.timezone})
            </td>
          </tr>
        </tbody>
      </table>
      ${showRaw
      ? `<div style="margin-top:1em;">
              <div style="font-weight:bold; margin-bottom:0.5em;">Raw JSON</div>
              <pre style="background:#f4f4f4;padding:1em;border-radius:4px;overflow-x:auto;font-size:0.875rem">${rawJson}</pre>
            </div>`
      : ""
    }
    </div>
  `;
}

export function generateFeedbackGitHubIssueMarkdown(
  data: FeedbackData
): string {
  const { topic, reaction, message, metadata } = data;
  const { route, time } = metadata;

  const sanitizedTopic = sanitizeUserInput(topic, 15);
  const sanitizedReaction = sanitizeUserInput(reaction, 100);
  const sanitizedMessage = sanitizeUserInput(message, 1000);

  const rawJson = JSON.stringify(data, null, 2);

  return `
## New Feedback Received

| Field              | Value |
| ------------------ | ----- |
| **Topic**          | ${sanitizedTopic || "N/A"} |
| **Reaction**         | ${sanitizedReaction} |
| **Message**        | ${sanitizedMessage} |
| **Timestamp**      | ${formatDateTime(time.timestamp)} (${time.timezone}) |

### Metadata: Route Information

| Property           | Value |
| ------------------ | ----- |
| **Path**           | ${route.path} |
| **Full Path**      | ${route.fullPath} |
| **Name**           | ${route.name?.toString() ?? "N/A"} |
| **Hash**           | ${route.hash || "N/A"} |
| **Redirected From**| ${route.redirectedFrom ? `\`${JSON.stringify(route.redirectedFrom)}\`` : "N/A"
    } |
| **Query**          | \`${JSON.stringify(route.query)}\` |

---

<details>
<summary><strong>Show Raw JSON</strong></summary>

\`\`\`json
${rawJson}
\`\`\`

</details>
  `.trim();
}
