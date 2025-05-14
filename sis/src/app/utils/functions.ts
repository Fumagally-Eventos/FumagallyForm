import { bonificacoesPorNivel, situacaoDosMontadores } from ".";
import { MontadorType, nomeMontadores, ProductsType } from "../types";
import type { NextApiRequest, NextApiResponse } from "next";
export const getHoursFromISO = (isoString: string) => {
  return isoString.split("T")[1].slice(0, 5);
};

export const bonificarPorNivel = ({
  nomeMontador,
  comissao,
}: {
  nomeMontador: nomeMontadores;
  comissao: number;
}) => {
  const quantiaAReceber =
    comissao + bonificacoesPorNivel[situacaoDosMontadores[nomeMontador].nivel];
  return quantiaAReceber / 2;
};
export const converterMinutosParaHoras = (minutos: number) => {
  const horas = Math.floor(minutos / 60);
  const minutosRestantes = minutos % 60;
  return `
  ${horas.toString().padStart(2, "0")}:${Math.round(minutosRestantes)
    .toString()
    .padStart(2, "0")}
`;
};

const ORS_API_KEY = process.env.ORS_API_KEY!;
export async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { origem, destino } = req.query;

  if (!origem || !destino) {
    return res.status(400).json({ error: "Parâmetros inválidos" });
  }

  try {
    // Geocoding
    const geo = async (endereco: string) => {
      const geoRes = await fetch(
        `https://api.openrouteservice.org/geocode/search?api_key=${ORS_API_KEY}&text=${encodeURIComponent(
          endereco as string
        )}`
      );
      const geoData = await geoRes.json();
      const [lon, lat] = geoData.features[0].geometry.coordinates;
      return [lat, lon];
    };

    const [lat1, lon1] = await geo(origem as string);
    const [lat2, lon2] = await geo(destino as string);

    // Rota
    const rotaRes = await fetch(
      `https://api.openrouteservice.org/v2/directions/driving-car`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: ORS_API_KEY,
        },
        body: JSON.stringify({
          coordinates: [
            [lon1, lat1],
            [lon2, lat2],
          ],
        }),
      }
    );

    const rotaData = await rotaRes.json();
    const duracao = rotaData.routes[0].segments[0].duration;
    const hh = String(Math.floor(duracao / 3600)).padStart(2, "0");
    const mm = String(Math.floor((duracao % 3600) / 60)).padStart(2, "0");

    return res.status(200).json({ tempo: `${hh}:${mm}` });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Erro ao calcular rota" });
  }
}

export const compararDatas = (data1Str: string, data2Str: string): string => {
  //dataselecionada deve ser eviada como segundo parametrod data2Str
  const parseData = (data: string): Date => {
    const [dia, mes, ano] = data.split("/").map(Number);
    return new Date(ano, mes - 1, dia); // mês começa do zero
  };

  const data1 = parseData(data1Str);
  const data2 = parseData(data2Str);

  // Zera horas para comparar só a data
  data1.setHours(0, 0, 0, 0);
  data2.setHours(0, 0, 0, 0);

  const diffMs = data2.getTime() - data1.getTime();
  const diffDias = diffMs / (1000 * 60 * 60 * 24);

  if (diffDias === 1) {
    return `do dia anterior`;
  } else if (diffDias > 1) {
    return `${diffDias} dias antes`;
  } else if (diffDias === -1) {
    return `do dia seguinte`;
  } else if (diffDias < -1) {
    return `${Math.abs(diffDias)} dias depois`;
  } else {
    return `nesse mesmo dia`;
  }
};
export function formatarData(isoStr?: string): string {
  if (isoStr) {
    const [ano, mes, dia] = isoStr.split("-");
    return `${dia}/${mes}/${ano}`;
  }
  return "asdf";
}

export function calcularDiferencaHorarios(
  horarioA: string,
  horarioB: string
): string {
  // Converte "hh:mm" para minutos desde a meia-noite
  const paraMinutos = (horario: string): number => {
    const [h, m] = horario.split(":").map(Number);
    return h * 60 + m;
  };

  // Converte minutos desde a meia-noite para "hh:mm", mantendo 24h
  const paraHorario = (minutos: number): string => {
    const minutosNormalizados = (minutos + 1440) % 1440;
    const horas = Math.floor(minutosNormalizados / 60);
    const mins = minutosNormalizados % 60;
    return `${horas.toString().padStart(2, "0")}:${mins
      .toString()
      .padStart(2, "0")}`;
  };

  const minutosA = paraMinutos(horarioA);
  const minutosB = paraMinutos(horarioB);
  const diferenca = minutosA - minutosB;

  return paraHorario(diferenca);
}
export function subtrairHorarios(horarioA: string, horarioB: string): string {
  function paraMinutos(horario: string): number {
    const [h, m] = horario.split(":").map(Number);
    return h * 60 + m;
  }

  function paraHorario(minutos: number): string {
    const totalMinutos = (minutos + 1440) % 1440;
    const h = Math.floor(totalMinutos / 60);
    const m = totalMinutos % 60;
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
  }

  const minutosA: number = paraMinutos(horarioA);
  const minutosB: number = paraMinutos(horarioB);
  const resultado: number = minutosA - minutosB;

  return paraHorario(resultado);
}
export function somarHorarios(horarioA: string, horarioB: string): string {
  function paraMinutos(horario: string): number {
    const [h, m] = horario.split(":").map(Number);
    return h * 60 + m;
  }

  function paraHorario(minutos: number): string {
    const totalMinutos = (minutos + 1440) % 1440;
    const h = Math.floor(totalMinutos / 60);
    const m = totalMinutos % 60;
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
  }

  const minutosA: number = paraMinutos(horarioA);
  const minutosB: number = paraMinutos(horarioB);
  const resultado: number = minutosA + minutosB;

  return paraHorario(resultado);
}

export function extrairMontadoresDeHTML(tbodyHTML: string): MontadorType[] {
  const montadores: MontadorType[] = [];

  const parser = new DOMParser();
  const doc = parser.parseFromString(tbodyHTML, "text/html");

  const match = tbodyHTML.match(/idevento=(\d+)/);

  const idevento = match ? match[1] : null;

  const tds = doc.querySelectorAll("td");

  tds.forEach((td) => {
    const link = td.querySelector("a[href*='?p=casting']");
    const statusSpan = td.querySelector(".alterar-status span");

    if (link && statusSpan) {
      const nome = link.textContent?.trim();
      const statusTexto = statusSpan.textContent?.trim();

      const statusMap = {
        Confirmado: "Confirmado",
        Escalado: "Escalado",
        Recusado: "Recusado",
      } as const;

      const compromisso = statusMap[statusTexto as keyof typeof statusMap];

      if (nome && compromisso) {
        montadores.push({
          nome: nome as nomeMontadores,
          compromisso,
          idevento,
        });
      }
    }
  });

  return montadores;
}

export function extrairProdutosDeHTML(bodyHTML: string): ProductsType[] {
  const parser = new DOMParser();

  const doc = parser.parseFromString(bodyHTML, "text/html");

  const itens = Array.from(doc.querySelectorAll("div[id]")).filter((div) => {
    const style = div.getAttribute("style") || "";
    return style.includes("cursor:move") && style.includes("padding: 5px");
  });

  const match = bodyHTML.match(/idevento=(\d+)/);
  const idevento = match ? match[1] : null;

  const produtos: ProductsType[] = [];

  itens.forEach((div) => {
    const style = (div.getAttribute("style") ?? "") as string;
    let tag: "produto" | "avulso" | null = null;

    if (style.includes("#37bd00")) tag = "produto";
    else if (style.includes("#555555")) tag = "avulso";
    else return;

    const el = div as HTMLElement;
    const nome = el.querySelector("b")?.innerText.trim();

    if (!nome) return;
    if (nome.toLowerCase().includes("venda")) return;

    const qtdMatch = el.innerText.match(/Quantidade:\s*(\d+)\s*un/i);
    const quantidade = qtdMatch ? parseInt(qtdMatch[1], 10) : 1;

    const existente = produtos.find((item) => item.tipo === nome);
    if (!existente) {
      produtos.push({
        tipo: nome as ProductsType["tipo"],
        quantidade,
        tag,
        idevento,
      });
    } else if (quantidade > existente.quantidade) {
      existente.quantidade = quantidade;
    }
  });

  return produtos;
}

export function extrairInfoEventoDeHTML(bodyHTML: string): {
  idEvento: string | null;
  naRua: boolean | null;
  endereco: string | null;
} {
  const parser = new DOMParser();
  const doc = parser.parseFromString(bodyHTML, "text/html");

  // Extrai o ID do evento via regex
  const match = bodyHTML.match(/idevento=(\d+)/);
  const idEvento = match ? match[1] : null;

  // Campo "caracteristicaevento"
  const selectNaRua = doc.getElementById(
    "caracteristicaevento"
  ) as HTMLSelectElement | null;
  let naRua: boolean | null = null;

  if (selectNaRua) {
    const valor = selectNaRua.value;
    if (valor === "105") naRua = false;
    else if (valor === "107") naRua = true;
  }

  // Endereço: tenta input primeiro
  const inputNomeEvento = doc.getElementById(
    "localdoevento"
  ) as HTMLInputElement | null;
  let endereco: string | null = null;

  if (inputNomeEvento && inputNomeEvento.value.trim() !== "") {
    endereco = inputNomeEvento.value.trim();
  } else {
    // Fallback: select#localeventoantigo
    const selectEndereco = doc.getElementById(
      "localeventoantigo"
    ) as HTMLSelectElement | null;
    if (selectEndereco) {
      const selectedOption = selectEndereco.selectedOptions[0];
      const selectedValue = selectedOption?.value;
      const selectedText = selectedOption?.textContent?.trim();

      if (selectedValue && selectedValue !== "0" && selectedText) {
        endereco = selectedText;
      }
    }
  }

  return { idEvento, naRua, endereco };
}

export function estaDeMadrugada(dataHoraStr: string): boolean {
  const data = new Date(dataHoraStr);
  const horas = data.getHours();

  return horas >= 0 && horas < 6;
}
