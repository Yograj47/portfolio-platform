import { spawn } from "node:child_process";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const args = process.argv.slice(2);
const hasPort = args.some(
  (arg) =>
    arg === "--port" ||
    arg === "-p" ||
    arg.startsWith("--port=") ||
    /^-p[=\d]/.test(arg),
);
// Polling avoids repeated rebuilds from cloud-synced filesystem notifications.
const server = spawn(
  process.execPath,
  [
    require.resolve("next/dist/bin/next"),
    "dev",
    "--webpack",
    ...args,
    ...(hasPort ? [] : ["--port", "3000"]),
  ],
  {
    stdio: "inherit",
    windowsHide: true,
    env: {
      ...process.env,
      WATCHPACK_POLLING: process.env.WATCHPACK_POLLING || "1000",
    },
  },
);
server.once("error", (error) => {
  console.error(error.message);
  process.exitCode = 1;
});
server.once("exit", (code) => {
  process.exitCode = code ?? 1;
});
for (const signal of ["SIGINT", "SIGTERM"]) {
  process.once(signal, () => server.kill(signal));
}
