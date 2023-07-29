import { deno_dom as DOM } from "./deps.ts";
import type { deno_dom as DOMTypes } from "./deps.ts";
import { Seccio } from "./types.d.ts";

const url = "https://maildelviernes.es/mdv-de-la-semana-2/";

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
      ".templateContainer .bodyContainer",
    );
    if (!contingut) Deno.exit(1);

    const tables = contingut.getElementsByTagName("table");
    tables.forEach((table: DOMTypes.Element) => {
      if (table.className === "mcnCodeBlock") {
        if (!firstIteration && seccio.imatges.length > 0) mdv.push(seccio);
        firstIteration = false;
        seccio = {
          titol: table.getElementsByClassName("HeaderHeadlines")[0]
            ?.textContent,
          imatges: [],
        };
      }

      if (table.className === "mcnImageBlock") {
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
