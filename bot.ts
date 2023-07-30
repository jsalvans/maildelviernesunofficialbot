import { Bot } from "https://deno.land/x/grammy@v1.17.2/mod.ts";
import { autoRetry } from "https://esm.sh/@grammyjs/auto-retry@1.1.1";

const APIKEY = Deno.env.get("TELEGRAM_API_KEY");
const CHATID = Deno.env.get("TELEGRAM_CHAT_ID");
if (!APIKEY || !CHATID) {
  console.error("APIKEY or CHATID not found");
  Deno.exit(1);
}

const bot = new Bot(APIKEY);
bot.api.config.use(autoRetry());

export const sendText = async (text: string) => {
  await bot.api.sendMessage(CHATID, text);
};

export const sendPhoto = async (photo: string) => {
  await bot.api.sendPhoto(CHATID, photo);
};
