import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { createRequire } from "node:module";
import { setTimeout as delay } from "node:timers/promises";
const require = createRequire(import.meta.url);
const port = 3113;
const base = `http://127.0.0.1:${port}`;
const server = spawn(
  process.execPath,
  [
    require.resolve("next/dist/bin/next"),
    "start",
    "--hostname",
    "127.0.0.1",
    "--port",
    String(port),
  ],
  {
    cwd: new URL("..", import.meta.url),
    windowsHide: true,
    stdio: ["ignore", "pipe", "pipe"],
  },
);
let output = "";
server.stdout.on("data", (chunk) => {
  output += chunk.toString();
});
server.stderr.on("data", (chunk) => {
  output += chunk.toString();
});
let exited = false;
server.once("exit", () => {
  exited = true;
});
try {
  let ready = false;
  for (let attempt = 0; attempt < 60; attempt++) {
    if (exited) throw new Error("Production server exited: " + output);
    if (output.includes("Ready in")) {
      ready = true;
      break;
    }
    await delay(500);
  }
  assert.ok(ready, "Production server did not become ready");
  for (const route of [
    "/",
    "/admin/login",
    "/admin/dashboard",
    "/projects/example-slug",
  ]) {
    const response = await fetch(base + route, {
      signal: AbortSignal.timeout(10000),
    });
    assert.equal(response.status, 200, route);
    const html = await response.text();
    if (route === "/") assert.ok(html.includes("data-cv-loading"));
    if (route.startsWith("/admin/")) {
      assert.ok(html.includes("noindex"), "Admin pages must not be indexed");
      assert.ok(
        !html.includes("data-admin-verified"),
        "Unverified server HTML must not render the dashboard shell",
      );
    }
    if (route.startsWith("/projects/")) {
      assert.ok(html.includes("/#projects"));
      assert.ok(!html.includes("data-cv-loading"));
    }
    assert.ok(!html.includes('href="/terminal"'));
    console.log("PASS " + route + " 200");
  }
  for (const route of [
    "/login",
    "/dashboard",
    "/api/route-auth",
    "/blogs",
    "/terminal",
    "/projects",
    "/skills",
    "/timeline",
  ]) {
    const response = await fetch(base + route, {
      signal: AbortSignal.timeout(10000),
    });
    assert.equal(response.status, 404, route);
    await response.text();
    console.log("PASS " + route + " 404");
  }
} finally {
  if (!exited) {
    server.kill();
    await delay(500);
  }
}
