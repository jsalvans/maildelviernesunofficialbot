import "std/dotenv/load.ts";
import { existsSync } from "std/fs/mod.ts";
import { getMdv } from "./scrapper.ts";
import { sendPhoto, sendText } from "./bot.ts";
import { Mdv } from "./types.d.ts";

const LAST_MDV = "./lastMdv";

const parseDate = (date: Date = new Date()): string => {
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  const dayStr = day < 10 ? `0${day}` : `${day}`;
  const monthStr = month < 10 ? `0${month}` : `${month}`;

  return `${dayStr}/${monthStr}/${year}`;
};

const MDV = async () => {
  const mdv: Mdv = await getMdv();
  if (mdv.seccions.length === 0) return;

  const date = mdv.data ? new Date(mdv.data) : undefined;
  if (date && existsSync(LAST_MDV)) {
    const lastMdv = Deno.readTextFileSync(LAST_MDV);
    if (!isNaN(Date.parse(lastMdv)) && date >= new Date(lastMdv)) return;
  }
  Deno.writeTextFileSync(LAST_MDV, mdv.data ?? "");

  await sendText(`#MDV ${parseDate(date)}`);
  for (const seccio of mdv.seccions) {
    await sendText(`== ${seccio.titol.toUpperCase()} ==`);
    for (const img of seccio.imatges) {
      await sendPhoto(img);
    }
  }
  await sendText(`¡Hasta la próxima!`);
};

export default MDV;
