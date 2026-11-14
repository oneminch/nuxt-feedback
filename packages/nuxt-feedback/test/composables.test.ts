import { beforeEach, describe, expect, it, vi } from "vitest";
import useFeedbackWidget from "../src/runtime/composables/use-feedback-widget";
import useFeedbackConfig from "../src/runtime/composables/use-feedback-config";
import { resetState } from "./mocks/imports";

beforeEach(() => {
  resetState();
  vi.restoreAllMocks();
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
});

describe("useFeedbackConfig", () => {
  it("defaults to an empty object and is shared", () => {
    const a = useFeedbackConfig();
    expect(a.value).toEqual({});
    a.value = { title: "Hi" };
    expect(useFeedbackConfig().value).toEqual({ title: "Hi" });
  });
});
