import { Cron } from "https://deno.land/x/croner@6.0.7/dist/croner.js";
import MDV from "./mdv.ts";

const CRON_EXPRESSION = Deno.env.get("MDV_CRON") ?? "0 0 8 ? 1-7,9-12 5";
new Cron(CRON_EXPRESSION, async () => await MDV());
