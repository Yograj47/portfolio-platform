import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
import vm from "node:vm";
import ts from "typescript";
function setup({ failRefresh = false } = {}) {
  const state = {
    accessToken: "old",
    loggedOut: false,
    setAccessToken(token) {
      this.accessToken = token;
    },
    logout() {
      this.accessToken = null;
      this.loggedOut = true;
    },
  };
  let handler;
  let refreshes = 0;
  const http = (config) => Promise.resolve(config);
  http.post = async () => {
    refreshes++;
    await new Promise((resolve) => setTimeout(resolve, 5));
    if (failRefresh) throw new Error("expired");
    return { data: { data: { accessToken: "new" } } };
  };
  http.interceptors = {
    request: { use() {} },
    response: {
      use(_success, error) {
        handler = error;
      },
    },
  };
  const axios = {
    create: () => http,
    isAxiosError: (error) => error.axios === true,
  };
  const source = fs.readFileSync(
    path.join(__dirname, "../lib/http.ts"),
    "utf8",
  );
  const code = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS },
  }).outputText;
  vm.runInNewContext(code, {
    exports: {},
    process: { env: {} },
    require: (id) =>
      id === "axios"
        ? { __esModule: true, default: axios, ...axios }
        : { useAuthStore: { getState: () => state } },
  });
  const error = () => ({
    axios: true,
    response: { status: 401 },
    config: {
      url: "/users/me",
      headers: {
        value: "Bearer old",
        get() {
          return this.value;
        },
        set(_key, value) {
          this.value = value;
        },
      },
    },
  });
  return {
    handle: (value) => handler(value),
    error,
    state,
    refreshes: () => refreshes,
  };
}
test("concurrent 401s share one refresh and retry with the rotated token", async () => {
  const app = setup();
  const requests = await Promise.all([
    app.handle(app.error()),
    app.handle(app.error()),
  ]);
  assert.equal(app.refreshes(), 1);
  assert.equal(app.state.accessToken, "new");
  for (const request of requests)
    assert.equal(request.headers.value, "Bearer new");
});
test("a late stale-token 401 reuses the token already refreshed by another request", async () => {
  const app = setup();
  app.state.accessToken = "new";
  const result = await app.handle(app.error());
  assert.equal(app.refreshes(), 0);
  assert.equal(result.headers.value, "Bearer new");
});
test("failed refresh clears auth without accessing browser navigation", async () => {
  const app = setup({ failRefresh: true });
  await assert.rejects(app.handle(app.error()), /expired/);
  assert.equal(app.state.accessToken, null);
  assert.equal(app.state.loggedOut, true);
});
test("auth endpoints and requests already retried do not refresh recursively", async () => {
  const app = setup();
  const auth = app.error();
  auth.config.url = "/auth/logout";
  await assert.rejects(app.handle(auth));
  const retried = app.error();
  retried.config._retry = true;
  await assert.rejects(app.handle(retried));
  assert.equal(app.refreshes(), 0);
});

function loadPayloadNormalizer() {
  const source = fs.readFileSync(
    path.join(__dirname, "../lib/api-payload.ts"),
    "utf8",
  );
  const code = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS },
  }).outputText;
  const exports = {};
  vm.runInNewContext(code, { exports });
  return exports.normalizeOptionalFields;
}
test("clearing optional form fields produces null without mutating form state", () => {
  const normalize = loadPayloadNormalizer();
  const form = { liveUrl: "", title: "Project", featured: false };
  const payload = normalize(form, ["liveUrl"]);
  assert.equal(payload.liveUrl, null);
  assert.equal(payload.title, "Project");
  assert.equal(payload.featured, false);
  assert.equal(form.liveUrl, "");
});
test("partial updates preserve omitted fields rather than clearing them", () => {
  const normalize = loadPayloadNormalizer();
  const payload = normalize({ title: "Renamed" }, ["liveUrl", "githubUrl"]);
  assert.equal(Object.hasOwn(payload, "liveUrl"), false);
  assert.equal(Object.hasOwn(payload, "githubUrl"), false);
});
