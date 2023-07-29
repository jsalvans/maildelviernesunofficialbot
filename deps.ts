// Telegram dependencies
export * as grammy from "https://deno.land/x/grammy@v1.17.2/mod.ts";
export { autoRetry } from "https://esm.sh/@grammyjs/auto-retry@1.1.1";

// Scraping dependencies
export * as deno_dom from "https://deno.land/x/deno_dom@v0.1.38/deno-dom-wasm.ts";

// Cron dependencies
export { Cron } from "https://deno.land/x/croner@6.0.7/dist/croner.js";

// Dotenv dependencies
const status = await Deno.permissions.querySync({ name: "read", path: "." });
if (status.state === "granted") {
  await import("https://deno.land/std@0.196.0/dotenv/load.ts");
}
