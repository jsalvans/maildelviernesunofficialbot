export interface Seccio {
  titol: string;
  imatges: string[];
}

export interface Mdv {
  data?: string;
  seccions: Seccio[];
}
