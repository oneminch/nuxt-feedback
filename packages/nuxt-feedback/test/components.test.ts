// @vitest-environment jsdom
import { beforeEach, describe, expect, it, vi } from "vitest";
import { flushPromises, mount } from "@vue/test-utils";
import FeedbackTrigger from "../src/runtime/components/feedback-trigger.vue";
import FeedbackStatus from "../src/runtime/components/feedback-status.vue";
import FeedbackForm from "../src/runtime/components/feedback-form.vue";
import useFeedbackConfig from "../src/runtime/composables/use-feedback-config";
import { FEEDBACK_WIDGET_TAG } from "../src/runtime/utils";
import { resetState, useRuntimeConfig } from "./mocks/imports";

const fetchMock = vi.fn();
vi.stubGlobal("$fetch", fetchMock);

beforeEach(() => {
  resetState();
  vi.clearAllMocks();
  document.body.innerHTML = "";
  vi.mocked(useRuntimeConfig).mockReturnValue({});
});

describe("FeedbackTrigger", () => {
  it("renders the default label", () => {
    const w = mount(FeedbackTrigger);
    expect(w.get("button").text()).toBe("Share Feedback");
    expect(w.get("button").attributes("aria-haspopup")).toBe("dialog");
  });

  it("applies custom label and class", () => {
    const w = mount(FeedbackTrigger, {
      props: { triggerLabel: "Tell us", triggerClass: "custom" },
    });
    expect(w.get("button").text()).toBe("Tell us");
    expect(w.get("button").classes()).toContain("custom");
  });

  it("opens the widget on click", async () => {
    const w = mount(FeedbackTrigger);
    await w.get("button").trigger("click");
    expect(w.get("button").attributes("aria-expanded")).toBe("true");
  });

  it("shares modal props (but not trigger props) via config state", async () => {
    mount(FeedbackTrigger, {
      props: { widgetId: "shared", title: "T", triggerLabel: "x", topics: ["a"] },
    });
    await flushPromises();
    const cfg = useFeedbackConfig("shared").value;
    expect(cfg).toMatchObject({ title: "T", topics: ["a"], withTopics: true });
    expect(cfg).not.toHaveProperty("triggerLabel");
    expect(cfg).not.toHaveProperty("widgetId");
    expect(cfg).not.toHaveProperty("description");
  });

  it("isolates modal props by widget id", async () => {
    mount(FeedbackTrigger, {
      props: { widgetId: "alpha", title: "Alpha", topics: ["a"] },
    });
    mount(FeedbackTrigger, {
      props: { widgetId: "beta", title: "Beta", topics: ["b"] },
    });
    await flushPromises();

    expect(useFeedbackConfig("alpha").value).toMatchObject({
      title: "Alpha",
      topics: ["a"],
      withTopics: true,
    });
    expect(useFeedbackConfig("beta").value).toMatchObject({
      title: "Beta",
      topics: ["b"],
      withTopics: true,
    });
  });

  it("mounts one modal host per trigger instance by default", () => {
    const a = mount(FeedbackTrigger);
    const b = mount(FeedbackTrigger);

    const hosts = [...document.querySelectorAll(FEEDBACK_WIDGET_TAG)];
    const ids = hosts.map((host) => host.getAttribute("widget-id") || "");

    expect(hosts).toHaveLength(2);
    expect(new Set(ids).size).toBe(2);
    expect(ids.every((id) => id.startsWith("instance-"))).toBe(true);

    a.unmount();
    expect(document.querySelectorAll(FEEDBACK_WIDGET_TAG)).toHaveLength(1);

    b.unmount();
    expect(document.querySelectorAll(FEEDBACK_WIDGET_TAG)).toHaveLength(0);
  });

  it("mounts one modal host for duplicate explicit widget ids", () => {
    const a = mount(FeedbackTrigger, { props: { widgetId: "shared" } });
    const b = mount(FeedbackTrigger, { props: { widgetId: "shared" } });

    const hosts = [...document.querySelectorAll(FEEDBACK_WIDGET_TAG)];
    const ids = hosts.map((host) => host.getAttribute("widget-id"));

    expect(hosts).toHaveLength(1);
    expect(ids).toEqual(["shared"]);

    a.unmount();
    expect(document.querySelectorAll(FEEDBACK_WIDGET_TAG)).toHaveLength(1);

    b.unmount();
    expect(document.querySelectorAll(FEEDBACK_WIDGET_TAG)).toHaveLength(0);
  });

  it("opens only the clicked trigger by default", async () => {
    const a = mount(FeedbackTrigger);
    const b = mount(FeedbackTrigger);

    await a.get("button").trigger("click");

    expect(a.get("button").attributes("aria-expanded")).toBe("true");
    expect(b.get("button").attributes("aria-expanded")).toBe("false");
  });

  it("disables the trigger when no server is available", async () => {
    vi.mocked(useRuntimeConfig).mockReturnValue({
      public: { feedbackWidget: { widgetEnabled: false } },
    });
    const w = mount(FeedbackTrigger);
    expect(w.get("button").attributes("disabled")).toBeDefined();
    await w.get("button").trigger("click");
    expect(w.get("button").attributes("aria-expanded")).toBe("false");
  });
});

describe("FeedbackStatus", () => {
  it("shows the message for success", () => {
    const w = mount(FeedbackStatus, {
      props: { status: "success", message: "Thanks!" },
    });
    expect(w.get("[role=status]").text()).toBe("Thanks!");
  });

  it("shows the message for failure", () => {
    const w = mount(FeedbackStatus, {
      props: { status: "failure", message: "Nope" },
    });
    expect(w.text()).toContain("Nope");
  });
});

describe("FeedbackForm", () => {
  const props = { submitLabel: "Send", withTopics: false, topics: [] };

  it("renders reactions and the submit label", () => {
    const w = mount(FeedbackForm, { props });
    expect(w.findAll("[role=radio]")).toHaveLength(4);
    expect(w.get("button[type=submit], form > button").text()).toBe("Send");
  });

  it("validates that a reaction is selected", async () => {
    const w = mount(FeedbackForm, { props });
    await w.get("form").trigger("submit");
    expect(w.text()).toContain("Please select an option.");
    expect(fetchMock).not.toHaveBeenCalled();
    expect(w.emitted("after-submit")).toBeUndefined();
  });

  it("submits and emits success", async () => {
    fetchMock.mockResolvedValue({ status: "success", message: "Thanks" });
    const w = mount(FeedbackForm, { props });
    await w.findAll("[role=radio]")[3]!.trigger("click");
    await w.get("textarea").setValue("nice");
    await w.get("form").trigger("submit");
    await flushPromises();

    expect(fetchMock).toHaveBeenCalledOnce();
    const [url, opts] = fetchMock.mock.calls[0]!;
    expect(url).toBe("/api/_nuxt-feedback/submit");
    expect(opts.method).toBe("POST");
    expect(opts.body).toMatchObject({
      reaction: "Love it!",
      message: "nice",
      metadata: { route: { path: "/test" } },
    });
    expect(w.emitted("after-submit")![0]).toEqual(["success", "Thanks"]);
  });

  it("emits failure when the server reports an error", async () => {
    fetchMock.mockResolvedValue({
      error: true,
      status: "failure",
      message: "Bad",
    });
    const w = mount(FeedbackForm, { props });
    await w.findAll("[role=radio]")[0]!.trigger("click");
    await w.get("form").trigger("submit");
    await flushPromises();
    expect(w.emitted("after-submit")![0]).toEqual(["failure", "Bad"]);
  });

  it("emits failure when the request throws", async () => {
    fetchMock.mockRejectedValue(new Error("network"));
    const w = mount(FeedbackForm, { props });
    await w.findAll("[role=radio]")[0]!.trigger("click");
    await w.get("form").trigger("submit");
    await flushPromises();
    expect(w.emitted("after-submit")![0]).toEqual(["failure", "network"]);
  });

  it("requires a topic when topics are enabled", async () => {
    const w = mount(FeedbackForm, {
      props: { ...props, withTopics: true, topics: ["A"] },
    });
    await w.get("form").trigger("submit");
    expect(w.text()).toContain("Please select a topic.");
  });
});
