import { DEFAULT_CRON } from "./constants.ts";
import { Cron } from "croner/croner.js";
import MDV from "./mdv.ts";

const CRON_EXPRESSION = Deno.env.get("MDV_CRON") ?? DEFAULT_CRON;
new Cron(CRON_EXPRESSION, async () => await MDV());
console.log("MDV's cron started with the expression:", CRON_EXPRESSION);
