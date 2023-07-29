import { autoRetry, Cron, grammy } from "./deps.ts";
import { getMdv } from "./mdv.ts";
import { Seccio } from "./types.d.ts";

const APIKEY = Deno.env.get("TELEGRAM_API_KEY");
const CHATID = Deno.env.get("TELEGRAM_CHAT_ID");
if (!APIKEY || !CHATID) Deno.exit(1);

const CRON_EXPRESSION =
  "0 0 8 ? JAN,FEB,MAR,APR,MAY,JUN,JUL,AUG,OCT,NOV,DEC FRI *";
const bot = new grammy.Bot(APIKEY);
bot.api.config.use(autoRetry());

const today = () => {
  const date = new Date();
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  const dayStr = day < 10 ? `0${day}` : `${day}`;
  const monthStr = month < 10 ? `0${month}` : `${month}`;

  return `${dayStr}/${monthStr}/${year}`;
};

const main = async () => {
  const mdv: Seccio[] = await getMdv();
  await bot.api.sendMessage(
    CHATID,
    `#MDV ${today()}`,
  );
  for (const seccio of mdv) {
    await bot.api.sendMessage(
      CHATID,
      `== ${seccio.titol.toUpperCase()} ==`,
    );
    for (const img of seccio.imatges) {
      await bot.api.sendPhoto(CHATID, img);
    }
  }
  await bot.api.sendMessage(
    CHATID,
    `¡Hasta la próxima!`,
  );
};

new Cron(CRON_EXPRESSION, async () => await main());
//await main();
