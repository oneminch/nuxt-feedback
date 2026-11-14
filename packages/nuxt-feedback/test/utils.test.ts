import { describe, it, expect } from "vitest";
import {
  createFormData,
  generateFeedbackEmailHtml,
  generateFeedbackGitHubIssueMarkdown,
  sanitizeUserInput,
  defaultReactions,
  SUBMISSION_METHODS,
} from "../src/runtime/utils";
import type { FeedbackData } from "../src/runtime/types";

const makeData = (overrides: Partial<FeedbackData> = {}): FeedbackData => ({
  topic: "Bug",
  reaction: "love-it",
  message: "Great stuff",
  metadata: {
    route: {
      fullPath: "/docs?a=1#top",
      hash: "#top",
      query: { a: "1" },
      name: "docs",
      path: "/docs",
      redirectedFrom: undefined,
    },
    time: { timestamp: "2024-01-02T03:04:05.000Z", timezone: "UTC" },
  },
  ...overrides,
});

describe("constants", () => {
  it("exposes submission methods and reactions", () => {
    expect(SUBMISSION_METHODS).toEqual(["email", "github", "custom-endpoint"]);
    expect(defaultReactions.map(([id]) => id)).toEqual([
      "hate-it",
      "not-great",
      "its-okay",
      "love-it",
    ]);
  });
});

describe("sanitizeUserInput", () => {
  it("returns N/A for blank input", () => {
    expect(sanitizeUserInput("   ")).toBe("N/A");
    expect(sanitizeUserInput("")).toBe("N/A");
  });

  it("strips HTML tags and scripts", () => {
    const out = sanitizeUserInput("<b>hi</b><script>alert(1)</script>");
    expect(out).toBe("hi");
  });

  it("collapses whitespace", () => {
    expect(sanitizeUserInput("a   b\n\n c")).toBe("a b c");
  });

  it("truncates to maxLength", () => {
    expect(sanitizeUserInput("abcdefghij", 4)).toBe("abcd");
  });
});

describe("createFormData", () => {
  it("builds payload from route and form state", () => {
    const route = {
      fullPath: "/x?y=1",
      hash: "",
      query: { y: "1" },
      name: "x",
      path: "/x",
      redirectedFrom: undefined,
    };
    const data = createFormData(route as any, {
      topic: "t",
      reaction: "r",
      message: "m",
    });
    expect(data.topic).toBe("t");
    expect(data.reaction).toBe("r");
    expect(data.message).toBe("m");
    expect(data.metadata.route).toEqual(route);
    expect(new Date(data.metadata.time.timestamp).toString()).not.toBe(
      "Invalid Date"
    );
    expect(typeof data.metadata.time.timezone).toBe("string");
  });
});

describe("generateFeedbackEmailHtml", () => {
  it("includes fields and sanitizes user content", () => {
    const html = generateFeedbackEmailHtml(
      makeData({ message: "<img src=x onerror=alert(1)>hello" })
    );
    expect(html).toContain("New Feedback Received");
    expect(html).toContain("love-it");
    expect(html).toContain("hello");
    expect(html).not.toContain("onerror");
    expect(html).toContain("/docs");
  });

  it("only shows raw JSON when requested", () => {
    expect(generateFeedbackEmailHtml(makeData())).not.toContain("Raw JSON");
    expect(
      generateFeedbackEmailHtml(makeData(), { showRawJson: true })
    ).toContain("Raw JSON");
  });

  it("limits message length to 1000 chars", () => {
    const html = generateFeedbackEmailHtml(
      makeData({ message: "a".repeat(2000) })
    );
    expect(html).toContain("a".repeat(1000));
    expect(html).not.toContain("a".repeat(1001));
  });
});

describe("generateFeedbackGitHubIssueMarkdown", () => {
  it("renders route info and raw JSON", () => {
    const md = generateFeedbackGitHubIssueMarkdown(makeData());
    expect(md).toContain("## New Feedback Received");
    expect(md).toContain("| **Topic**          | Bug |");
    expect(md).toContain("| **Path**           | /docs |");
    expect(md).toContain("| **Redirected From**| N/A |");
    expect(md).toContain("```json");
  });

  it("truncates topic to 15 chars", () => {
    const md = generateFeedbackGitHubIssueMarkdown(
      makeData({ topic: "x".repeat(40) })
    );
    expect(md).toContain(`| ${"x".repeat(15)} |`);
  });
});
