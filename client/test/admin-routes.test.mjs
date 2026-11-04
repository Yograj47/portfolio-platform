import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";
import ts from "typescript";
const exports = {};
vm.runInNewContext(
  ts.transpileModule(
    fs.readFileSync(new URL("../lib/admin-routes.ts", import.meta.url), "utf8"),
    { compilerOptions: { module: ts.ModuleKind.CommonJS } },
  ).outputText,
  { exports, URL },
);
test("admin redirects preserve only local dashboard destinations", () => {
  for (const value of [
    undefined,
    null,
    [],
    "/login",
    "//evil.example",
    "https://evil.example",
    "/admin/dashboard/../../login",
    "/admin/dashboard\\evil",
    "javascript:alert(1)",
  ])
    assert.equal(exports.adminDestination(value), "/admin/dashboard");
  assert.equal(
    exports.adminDestination("/admin/dashboard/projects?sort=title"),
    "/admin/dashboard/projects?sort=title",
  );
  assert.equal(
    exports.adminLoginHref("/admin/dashboard/projects"),
    "/admin/login?next=%2Fadmin%2Fdashboard%2Fprojects",
  );
});
