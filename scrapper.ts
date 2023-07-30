import { DOMParser, Element, HTMLDocument } from "denoDom/deno-dom-wasm.ts";
import { Mdv, Seccio } from "./types.d.ts";
import { MDV_URL, SCRAPPER_DIC } from "./constants.ts";

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

  const res = await fetch(MDV_URL);
  const html = await res.text();

  const document: HTMLDocument | null = new DOMParser()
    .parseFromString(
      html,
      "text/html",
    );
  if (!document) Deno.exit(1);

  const data = document.querySelector(
    SCRAPPER_DIC.DATE,
  )?.getAttribute("content") ?? undefined;

  const contingut: Element | null = document.querySelector(
    SCRAPPER_DIC.CONTAINER,
  );
  if (!contingut) Deno.exit(1);

  const tables = contingut.getElementsByTagName("table");
  tables.forEach((table: Element) => {
    if (table.className === SCRAPPER_DIC.MCN_CODE_BLOCK) {
      if (!firstIteration && seccio.imatges.length > 0) seccions.push(seccio);
      firstIteration = false;
      seccio = {
        titol: table.getElementsByClassName(SCRAPPER_DIC.HEADER_HEADLINES)[0]
          ?.textContent,
        imatges: [],
      };
    }

    if (table.className === SCRAPPER_DIC.MCN_IMAGE_BLOCK) {
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
