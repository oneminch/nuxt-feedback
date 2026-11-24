import { beforeEach, describe, expect, it, vi } from "vitest";
import useFeedbackWidget from "../src/runtime/composables/use-feedback-widget";
import useFeedbackConfig from "../src/runtime/composables/use-feedback-config";
import { resetState, useRuntimeConfig } from "./mocks/imports";

beforeEach(() => {
  resetState();
  vi.restoreAllMocks();
  vi.mocked(useRuntimeConfig).mockReturnValue({});
});

describe("useFeedbackWidget", () => {
  it("starts closed", () => {
    const w = useFeedbackWidget();
    expect(w.isOpen.value).toBe(false);
  });

  it("opens and closes without a rendered trigger component", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const w = useFeedbackWidget();
    w.openWidget();
    expect(w.isOpen.value).toBe(true);
    w.closeWidget();
    expect(w.isOpen.value).toBe(false);
    expect(warn).not.toHaveBeenCalled();
  });

  it("shares state between callers", () => {
    const a = useFeedbackWidget();
    const b = useFeedbackWidget();
    a.openWidget();
    expect(b.isOpen.value).toBe(true);
  });

  it("isolates state by widget id", () => {
    const alpha = useFeedbackWidget("alpha");
    const beta = useFeedbackWidget("beta");

    alpha.openWidget();

    expect(alpha.isOpen.value).toBe(true);
    expect(beta.isOpen.value).toBe(false);
  });

  it("does not open when widget is disabled in runtime config", () => {
    vi.mocked(useRuntimeConfig).mockReturnValue({
      public: { feedbackWidget: { widgetEnabled: false } },
    });

    const w = useFeedbackWidget();
    w.openWidget();

    expect(w.isOpen.value).toBe(false);
  });
});

describe("useFeedbackConfig", () => {
  it("defaults to an empty object and is shared", () => {
    const a = useFeedbackConfig();
    expect(a.value).toEqual({});
    a.value = { title: "Hi" };
    expect(useFeedbackConfig().value).toEqual({ title: "Hi" });
  });

  it("isolates config by widget id", () => {
    const alpha = useFeedbackConfig("alpha");
    const beta = useFeedbackConfig("beta");

    alpha.value = { title: "Alpha title" };

    expect(alpha.value).toEqual({ title: "Alpha title" });
    expect(beta.value).toEqual({});
  });
});
