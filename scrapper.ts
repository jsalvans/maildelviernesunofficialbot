import { DOMParser } from "https://deno.land/x/deno_dom@v0.1.38/deno-dom-wasm.ts";
import type {
  Element,
  HTMLDocument,
} from "https://deno.land/x/deno_dom@v0.1.38/deno-dom-wasm.ts";
import { Mdv, Seccio } from "./types.d.ts";

const url = "https://maildelviernes.es/mdv-de-la-semana-2/";

const DIC = {
  CONTAINER: ".templateContainer .bodyContainer",
  MCN_CODE_BLOCK: "mcnCodeBlock",
  MCN_IMAGE_BLOCK: "mcnImageBlock",
  HEADER_HEADLINES: ".HeaderHeadlines",
};

export const getMdv = async (): Promise<Mdv> => {
  try {
    return await scrapMdv();
  } catch (error) {
    console.error(error);
  }

  return {
    seccions: [],
  };
};

const scrapMdv = async (): Promise<Mdv> => {
  const seccions = [];
  let firstIteration = true;
  let seccio: Seccio = {
    titol: "",
    imatges: [],
  };

  const res = await fetch(url);
  const html = await res.text();

  const document: HTMLDocument | null = new DOMParser()
    .parseFromString(
      html,
      "text/html",
    );
  if (!document) Deno.exit(1);

  const data = document.querySelector(
    'meta[property="article:modified_time"]',
  )?.getAttribute("content") ?? undefined;

  const contingut: Element | null = document.querySelector(
    DIC.CONTAINER,
  );
  if (!contingut) Deno.exit(1);

  const tables = contingut.getElementsByTagName("table");
  tables.forEach((table: Element) => {
    if (table.className === DIC.MCN_CODE_BLOCK) {
      if (!firstIteration && seccio.imatges.length > 0) seccions.push(seccio);
      firstIteration = false;
      seccio = {
        titol: table.getElementsByClassName(DIC.HEADER_HEADLINES)[0]
          ?.textContent,
        imatges: [],
      };
    }

    if (table.className === DIC.MCN_IMAGE_BLOCK) {
      const img = table.getElementsByTagName("img")[0]?.getAttribute("src");
      if (img) seccio.imatges.push(img);
    }
  });
  seccions.push(seccio);

  return {
    data,
    seccions,
  };
};
