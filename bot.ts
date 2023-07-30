import { Bot } from "grammy/mod.ts";
import { autoRetry } from "autoRetry";

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
