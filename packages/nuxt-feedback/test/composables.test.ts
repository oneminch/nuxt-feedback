import { beforeEach, describe, expect, it, vi } from "vitest";
import useFeedbackWidget from "../src/runtime/composables/use-feedback-widget";
import useFeedbackConfig from "../src/runtime/composables/use-feedback-config";
import { resetState } from "./mocks/imports";

beforeEach(() => {
  resetState();
  vi.restoreAllMocks();
});

describe("useFeedbackWidget", () => {
  it("starts closed and unmounted", () => {
    const w = useFeedbackWidget();
    expect(w.isOpen.value).toBe(false);
    expect(w.isWidgetMounted.value).toBe(false);
  });

  it("warns and stays closed when no widget is registered", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const w = useFeedbackWidget();
    w.openWidget();
    expect(w.isOpen.value).toBe(false);
    expect(warn).toHaveBeenCalledOnce();
  });

  it("opens and closes once registered", () => {
    const w = useFeedbackWidget();
    w.registerWidget();
    expect(w.isWidgetMounted.value).toBe(true);
    w.openWidget();
    expect(w.isOpen.value).toBe(true);
    w.closeWidget();
    expect(w.isOpen.value).toBe(false);
  });

  it("warns when closing without a registered widget", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    useFeedbackWidget().closeWidget();
    expect(warn).toHaveBeenCalledOnce();
  });

  it("unregisters the widget", () => {
    const w = useFeedbackWidget();
    w.registerWidget();
    w.unregisterWidget();
    expect(w.isWidgetMounted.value).toBe(false);
  });

  it("shares state between callers", () => {
    const a = useFeedbackWidget();
    const b = useFeedbackWidget();
    a.registerWidget();
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
