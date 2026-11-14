import { describe, it, expect, vi, beforeEach } from "vitest";
import { readBody, useRuntimeConfig } from "./mocks/imports";

const sendMock = vi.fn();
vi.mock("resend", () => ({
  Resend: class {
    emails = { send: sendMock };
  },
}));

const fetchMock = vi.fn();
vi.stubGlobal("$fetch", fetchMock);

const body = {
  topic: "t",
  reaction: "love-it",
  message: "hi",
  metadata: {
    route: {
      fullPath: "/",
      hash: "",
      query: {},
      name: "index",
      path: "/",
      redirectedFrom: undefined,
    },
    time: { timestamp: "2024-01-01T00:00:00.000Z", timezone: "UTC" },
  },
};

type Handler = (event: unknown) => Promise<Record<string, unknown>>;
const load = async (file: string) =>
  (await import(`../src/runtime/server/api/feedback/${file}.ts`))
    .default as Handler;

const baseConfig = {
  resendApiKey: "key",
  resendFrom: "from@x.dev",
  resendTo: "to@x.dev",
  githubToken: "tok",
  githubRepo: "repo",
  githubOwner: "owner",
  public: { feedbackWidget: { siteName: "Site", customEndpoint: "/hook" } },
};

beforeEach(() => {
  vi.clearAllMocks();
  vi.spyOn(console, "error").mockImplementation(() => {});
  vi.mocked(useRuntimeConfig).mockReturnValue(structuredClone(baseConfig));
  vi.mocked(readBody).mockResolvedValue(structuredClone(body));
});

describe("email handler", () => {
  it("sends email on success", async () => {
    sendMock.mockResolvedValue({ error: null });
    const res = await (await load("email"))({});
    expect(res.status).toBe("success");
    expect(sendMock).toHaveBeenCalledOnce();
    expect(sendMock.mock.calls[0]![0]).toMatchObject({
      from: "Site <from@x.dev>",
      to: "to@x.dev",
    });
  });

  it("fails when config is missing", async () => {
    vi.mocked(useRuntimeConfig).mockReturnValue({
      ...baseConfig,
      resendApiKey: " ",
    });
    const res = await (await load("email"))({});
    expect(res).toMatchObject({ error: true, status: "failure" });
    expect(sendMock).not.toHaveBeenCalled();
  });

  it("fails when reaction is empty", async () => {
    vi.mocked(readBody).mockResolvedValue({ ...body, reaction: " " });
    const res = await (await load("email"))({});
    expect(res.message).toBe("Please select a feedback option.");
  });

  it("fails on Resend error", async () => {
    sendMock.mockResolvedValue({ error: { message: "boom" } });
    const res = await (await load("email"))({});
    expect(res.status).toBe("failure");
  });
});

describe("github handler", () => {
  it("creates an issue with labels", async () => {
    fetchMock.mockResolvedValue({});
    const res = await (await load("github"))({});
    expect(res.status).toBe("success");
    const [url, opts] = fetchMock.mock.calls[0]!;
    expect(url).toBe("https://api.github.com/repos/owner/repo/issues");
    expect(opts.headers.Authorization).toBe("Bearer tok");
    expect(opts.body.labels).toEqual(["feedback", "love-it"]);
  });

  it("fails when token is missing", async () => {
    vi.mocked(useRuntimeConfig).mockReturnValue({
      ...baseConfig,
      githubToken: "",
    });
    const res = await (await load("github"))({});
    expect(res.status).toBe("failure");
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("fails when reaction is empty", async () => {
    vi.mocked(readBody).mockResolvedValue({ ...body, reaction: "" });
    const res = await (await load("github"))({});
    expect(res.status).toBe("failure");
    expect(fetchMock).not.toHaveBeenCalled();
  });
});

describe("custom-endpoint handler", () => {
  const withEndpoint = (customEndpoint: string) =>
    vi.mocked(useRuntimeConfig).mockReturnValue({
      ...baseConfig,
      public: { feedbackWidget: { siteName: "Site", customEndpoint } },
    });

  it("posts body with siteName to the endpoint", async () => {
    fetchMock.mockResolvedValue({});
    const res = await (await load("custom-endpoint"))({});
    expect(res.status).toBe("success");
    const [url, opts] = fetchMock.mock.calls[0]!;
    expect(url).toBe("/hook");
    expect(opts.body.siteName).toBe("Site");
  });

  it("accepts absolute http(s) URLs", async () => {
    withEndpoint("https://example.com/hook");
    fetchMock.mockResolvedValue({});
    const res = await (await load("custom-endpoint"))({});
    expect(res.status).toBe("success");
  });

  it.each(["", "ftp://x.com", "relative/path"])(
    "rejects invalid endpoint %j",
    async (endpoint) => {
      withEndpoint(endpoint);
      const res = await (await load("custom-endpoint"))({});
      expect(res.status).toBe("failure");
      expect(fetchMock).not.toHaveBeenCalled();
    }
  );

  it("fails when reaction is empty", async () => {
    vi.mocked(readBody).mockResolvedValue({ ...body, reaction: "" });
    const res = await (await load("custom-endpoint"))({});
    expect(res.status).toBe("failure");
  });
});

describe("error handler", () => {
  it("returns a failure response", async () => {
    const res = await (await load("error"))({});
    expect(res).toMatchObject({ error: true, status: "failure" });
  });
});
