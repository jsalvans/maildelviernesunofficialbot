import { deno_dom as DOM } from "./deps.ts";
import type { deno_dom as DOMTypes } from "./deps.ts";
import { Seccio } from "./types.d.ts";

const url = "https://maildelviernes.es/mdv-de-la-semana-2/";

const DIC = {
  CONTAINER: ".templateContainer .bodyContainer",
  MCN_CODE_BLOCK: "mcnCodeBlock",
  MCN_IMAGE_BLOCK: "mcnImageBlock",
  HEADER_HEADLINES: ".HeaderHeadlines",
};

export const getMdv = async (): Promise<Seccio[]> => {
  const mdv = [];
  let seccio: Seccio = {
    titol: "",
    imatges: [],
  };
  let firstIteration = true;

  try {
    const res = await fetch(url);
    const html = await res.text();

    const document: DOMTypes.HTMLDocument | null = new DOM.DOMParser()
      .parseFromString(
        html,
        "text/html",
      );
    if (!document) Deno.exit(1);

    const contingut: DOMTypes.Element | null = document.querySelector(
      DIC.CONTAINER,
    );
    if (!contingut) Deno.exit(1);

    const tables = contingut.getElementsByTagName("table");
    tables.forEach((table: DOMTypes.Element) => {
      if (table.className === DIC.MCN_CODE_BLOCK) {
        if (!firstIteration && seccio.imatges.length > 0) mdv.push(seccio);
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
    mdv.push(seccio);
  } catch (error) {
    console.log(error);
  }

  return mdv;
};
