import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import ts from "typescript";
const require = createRequire(import.meta.url);
const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
function moduleExports(file, overrides = {}) {
  const code = ts.transpileModule(
    fs.readFileSync(path.join(root, file), "utf8"),
    {
      compilerOptions: {
        module: ts.ModuleKind.CommonJS,
        target: ts.ScriptTarget.ES2022,
      },
    },
  ).outputText;
  const exports = {};
  vm.runInNewContext(code, {
    exports,
    require: (id) => overrides[id] ?? require(id),
    setTimeout,
    clearTimeout,
    AbortController,
    DOMException,
    process: { env: {} },
    fetch,
  });
  return exports;
}
const validation = moduleExports("lib/validations/cv.ts");
const { loadPortfolio } = moduleExports("lib/portfolio-loader.ts", {
  "./validations/cv": validation,
});
const cv = {
  profile: {
    name: "Test Developer",
    email: "test@example.com",
    isAvailable: true,
  },
  projects: [],
  skills: [],
  timelines: [],
};
const health = { success: true, data: { status: "ok" } };
const json = (body, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
function setup(fetcher, settings = {}) {
  let clock = 0;
  const calls = [];
  const sleeps = [];
  const options = {
    baseUrl: "https://api.example.com/api/",
    timeoutMs: 5000,
    requestTimeoutMs: 1000,
    retryDelayMs: 2500,
    now: () => clock,
    sleep: async (ms) => {
      sleeps.push(ms);
      clock += ms;
    },
    fetcher: async (url, init) => {
      calls.push(url);
      return fetcher(url, init);
    },
    ...settings,
  };
  return { load: () => loadPortfolio(options), calls, sleeps };
}
test("a warm backend fetches health then the entire CV with no artificial wait", async () => {
  const app = setup(async (url) =>
    json(url.endsWith("/health") ? health : { success: true, data: cv }),
  );
  assert.equal((await app.load()).profile.name, "Test Developer");
  assert.deepEqual(app.calls, [
    "https://api.example.com/api/health",
    "https://api.example.com/api/portfolio",
  ]);
  assert.deepEqual(app.sleeps, []);
});
test("cold-start health failures retry before any CV request", async () => {
  let attempts = 0;
  const app = setup(async (url) =>
    url.endsWith("/health")
      ? ++attempts === 1
        ? json({}, 503)
        : json(health)
      : json({ success: true, data: cv }),
  );
  await app.load();
  assert.equal(app.calls.length, 3);
  assert.ok(
    app.calls[0].endsWith("/health") && app.calls[1].endsWith("/health"),
  );
  assert.deepEqual(app.sleeps, [2500]);
});
test("a temporary content failure retries without returning partial content", async () => {
  let attempts = 0;
  const app = setup(async (url) =>
    url.endsWith("/health")
      ? json(health)
      : ++attempts === 1
        ? json({}, 502)
        : json({ success: true, data: cv }),
  );
  assert.equal((await app.load()).profile.name, cv.profile.name);
  assert.equal(attempts, 2);
  assert.equal(app.calls.length, 4);
});
test("the startup budget ends with a retryable error rather than an infinite skeleton", async () => {
  const app = setup(async () => json({}, 503));
  await assert.rejects(app.load(), /taking too long/);
  assert.equal(app.calls.length, 2);
  assert.deepEqual(app.sleeps, [2500, 2500]);
});
test("missing routes fail immediately instead of polling for minutes", async () => {
  const app = setup(async () => json({}, 404));
  await assert.rejects(app.load(), /request failed/);
  assert.equal(app.calls.length, 1);
  assert.equal(app.sleeps.length, 0);
});
test("malformed CV data is never revealed", async () => {
  const app = setup(async (url) =>
    json(
      url.endsWith("/health")
        ? health
        : { success: true, data: { name: "Incomplete" } },
    ),
  );
  await assert.rejects(app.load(), /incomplete/);
  assert.equal(app.sleeps.length, 0);
});
test("navigation away aborts the in-flight probe and stops further retries", async () => {
  const controller = new AbortController();
  const app = setup(
    (_url, init) =>
      new Promise((_resolve, reject) => {
        init.signal.addEventListener(
          "abort",
          () => reject(new DOMException("Aborted", "AbortError")),
          { once: true },
        );
        queueMicrotask(() => controller.abort());
      }),
    { signal: controller.signal },
  );
  await assert.rejects(app.load(), (error) => error.name === "AbortError");
  assert.equal(app.calls.length, 1);
  assert.equal(app.sleeps.length, 0);
});

test("unresponsive health requests are aborted within the request budget", async () => {
  const app = setup(
    (_url, init) =>
      new Promise((_resolve, reject) => {
        init.signal.addEventListener(
          "abort",
          () => reject(new DOMException("Timed out", "AbortError")),
          { once: true },
        );
      }),
    { requestTimeoutMs: 1 },
  );
  await assert.rejects(app.load(), /taking too long/);
  assert.equal(app.calls.length, 2);
});
