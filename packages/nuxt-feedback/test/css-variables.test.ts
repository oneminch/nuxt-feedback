import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const runtimeDir = fileURLToPath(new URL("../src/runtime/", import.meta.url));

describe("css variable namespacing", () => {
  it("uses prefixed theme variables in runtime tailwind css", async () => {
    const css = await readFile(
      `${runtimeDir}assets/css/tailwind.css`,
      "utf8",
    );

    expect(css).toContain("--nfw-background");
    expect(css).toContain("--nfw-border");
    expect(css).toContain("--nfw-ring");
    expect(css).toContain("var(--nfw-background)");
    expect(css).toContain("var(--nfw-radio-checked-border)");
    expect(css).not.toMatch(/--background\s*:/);
    expect(css).not.toMatch(/--border\s*:/);
    expect(css).not.toMatch(/--ring\s*:/);
  });

  it("uses prefixed trigger variables", async () => {
    const triggerComponent = await readFile(
      `${runtimeDir}components/feedback-trigger.vue`,
      "utf8",
    );

    expect(triggerComponent).toContain("--nfw-trigger-background");
    expect(triggerComponent).toContain("var(--nfw-trigger-border)");
    expect(triggerComponent).toContain("var(--nfw-trigger-ring)");
    expect(triggerComponent).not.toMatch(/--background\s*:/);
    expect(triggerComponent).not.toContain("var(--background)");
    expect(triggerComponent).not.toContain("var(--border)");
    expect(triggerComponent).not.toContain("var(--ring)");
  });
});
