//import { infoPorBarraca } from "../utils";

export const tentConfig: Record<string, TentType> = {
  "Barraca 1,5 X1,5 verde": {
    size: "1,5 x 1,5",
    color: "Verde",
    type: "barraca",
  },
  "Barraca 2x2 verde": { size: "2 x 2", color: "Verde", type: "barraca" },
  "Barraca 2X2 AZUL": { size: "2 x 2", color: "Azul", type: "barraca" },
  "Barraca 2x2 azul lisa": {
    size: "2 x 2",
    color: "Azul",
    type: "barraca",
    isLisa: true,
  },
  "Barraca 2x2 vermelha": { size: "2 x 2", color: "Vermelha", type: "barraca" },
  "Tenda 3x3": { size: "3 x 3", type: "tenda", color: "Tenda" },
  "Tenda 4x4": { size: "4 x 4", type: "tenda", color: "Tenda" },
  "TENDA 6X6": { size: "6 x 6", type: "tenda", color: "Tenda" },
  "Tenda branca 8x8": { size: "8 x 8", type: "tenda", color: "Tenda" },
  "Tenda 8x8": { size: "8 x 8", type: "tenda", color: "Tenda" },
  "OUTRO me pedir pra catalogar": {
    size: "0",
    type: "outro",
    color: "Avulso",
  },
};

export type searchedItemType = Record<
  string,
  { montadores: MontadorType[]; itens: ProductsType[] }
>;

export interface ProductsType {
  tipo:
    | "Barraca 1,5 X1,5 verde"
    | "Barraca 2x2 verde"
    | "Barraca 2X2 AZUL"
    | "Barraca 2x2 azul lisa"
    | "Barraca 2x2 vermelha"
    | "Tenda 3x3"
    | "Tenda 4x4"
    | "TENDA 6X6"
    | "Tenda branca 8x8"
    | "OUTRO me pedir pra catalogar";
  quantidade: number;
  idevento?: string | null;
  tag?: string;
}

//export type InfoPorBarracaType = typeof infoPorBarraca;

export interface MontadorType {
  nome: nomeMontadores;
  compromisso: "Confirmado" | "Escalado" | "Recusado";
  idevento?: string | null;
}

export type TableItemTypeType = "Montagem" | "Desmontagem" | "Parada";

export interface TableItem {
  id: string;
  event_id: string;
  data: string;
  nome: string;
  endereco: string;
  naRua?: boolean;
  horarioFinalEvento: string; //settar caso seja uma desmontagem
  horarioInicioEvento: string; //settar caso seja montagem
  tempoEstimadoMontagem?: string;
  tempoEstimadoDesmontagem?: string;
  tempoEstimadoViagem?: string;
  tempoEstimadoCarregarCaminhao?: string;
  tempoEstimadoDescarregarCaminhao?: string;
  horarioEstimadoLiberarCaminhao?: string;
  produtos?: ProductsType[];
  montadoresRegistrados?: MontadorType[];
  partidaCaminhao?: string;
  estimativaCaminhaoLiberado?: string;
  tipo: TableItemTypeType;
}

export type TentType = {
  size: string;
  color?: "Verde" | "Azul" | "Vermelha" | "Tenda" | string;
  type: "barraca" | "tenda" | "outro";
  isLisa?: boolean;
};

export interface FetchOptions {
  cookie: string;
  startDate: string;
  endDate: string;
}
export interface ExtraFieldsType {
  anotacoes: string | null;
  enderecolocal: string;
  localizacao: string[];
  tags: { nome: "Montagem" | "Desmontagem"; cor: string }[];
  title: string;
  vendedor: string;
}

export interface PureEventType {
  id: string;
  allDay: boolean;
  cliente: string;
  start: string;
  end: string;
  tipo: string;
  title: string;
  extraFields: ExtraFieldsType;
}

export interface Evento {
  montagem?: PureEventType;
  evento: PureEventType;
  desmontagem?: PureEventType;
}

export type nomeMontadores =
  | "Célio Rodrigues dos Santos"
  | "Frederico Santos de Jesus"
  | "Helbert Cristian de Souza"
  | "Humberto Brito de carvalho jr"
  | "Johnny Brendow Rocha da Costa";

export type situacaoDosMontadoresType = Record<
  nomeMontadores,
  { nivel: 1 | 2 | 3; vinculo: string; idMontador: string; numWhats: string }
>;
