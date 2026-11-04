import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";
import { createRequire } from "node:module";
import ts from "typescript";
const require = createRequire(import.meta.url),
  exports = {};
vm.runInNewContext(
  ts.transpileModule(
    fs.readFileSync(
      new URL("../lib/validations/dashboard.ts", import.meta.url),
      "utf8",
    ),
    { compilerOptions: { module: ts.ModuleKind.CommonJS } },
  ).outputText,
  { exports, require },
);
const empty = {
  generatedAt: "2026-11-04T00:00:00.000Z",
  projects: { total: 0, published: 0, draft: 0, archived: 0 },
  messages: { total: 0, unread: 0, read: 0, replied: 0 },
  media: { files: 0, bytes: 0 },
  content: { skills: 0, categories: 0, timelineEntries: 0, credentials: 0 },
  recentProjects: [],
  recentMessages: [],
};
test("dashboard accepts real empty counts but rejects incomplete or negative totals", () => {
  assert.equal(exports.dashboardSchema.safeParse(empty).success, true);
  assert.equal(exports.dashboardSchema.safeParse({}).success, false);
  assert.equal(
    exports.dashboardSchema.safeParse({
      ...empty,
      media: { files: 1, bytes: -1 },
    }).success,
    false,
  );
});
test("a server-valid sender address cannot invalidate the whole overview", () => {
  assert.equal(
    exports.dashboardSchema.safeParse({
      ...empty,
      recentMessages: [
        {
          id: "message",
          name: "Sender",
          email: "sender?subject=test@example.com",
          subject: "Enquiry",
          status: "UNREAD",
          createdAt: empty.generatedAt,
        },
      ],
    }).success,
    true,
  );
});
