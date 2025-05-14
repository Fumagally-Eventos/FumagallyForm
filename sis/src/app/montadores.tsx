"use client";
import { Badge, Button, Chip, TableCell } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import { ProductsType, MontadorType, TableItem } from "./types";
import {
  bonificacoesPorNivel,
  infoPorBarraca,
  situacaoDosMontadores,
} from "./utils";

import {
  bonificarPorNivel,
  estaDeMadrugada,
  extrairMontadoresDeHTML,
} from "./utils/functions";
import { Dispatch, useEffect } from "react";
const itemColor = {
  status: {
    Confirmado: "success" as const,
    Escalado: "primary" as const,
    Recusado: "error" as const,
  },
  name: {
    Confirmado: "green" as const,
    Escalado: "blue" as const,
    Recusado: "red" as const,
  },
  icon: {
    Confirmado: <CheckIcon />,
    Escalado: <RadioButtonUncheckedIcon />,
    Recusado: <CloseIcon />,
  },
};

export const Comissao = ({
  listaDeProdutos,
  consultaEspecificaFeita,
  tableItem,
}: {
  tableItem: TableItem;
  listaDeProdutos: ProductsType[];
  consultaEspecificaFeita: boolean;
}) => {
  const totalmontadoresConfirmados =
    tableItem.montadoresRegistrados &&
    tableItem.montadoresRegistrados.length > 0
      ? tableItem.montadoresRegistrados.filter(
          (montador) => montador.compromisso === "Confirmado"
        ).length
      : 0;
  console.log("asdf", tableItem);
  const precoTotalSomaBarracas = listaDeProdutos
    .map((item) =>
      item.tag === "produto"
        ? estaDeMadrugada(tableItem.data)
          ? infoPorBarraca[item.tipo].preco_noite * item.quantidade
          : infoPorBarraca[item.tipo].preco_dia * item.quantidade
        : 0
    )
    .reduce((acumulador, numero) => acumulador + numero, 0);

  const comissaoEstimadaPorMontador =
    precoTotalSomaBarracas / totalmontadoresConfirmados;

  let comissaoPorMontador = 0;

  if (comissaoEstimadaPorMontador < 30) {
    comissaoPorMontador = 30;
  }

  if (comissaoEstimadaPorMontador > 200) {
    comissaoPorMontador = 200;
  }

  if (comissaoEstimadaPorMontador < 200 && comissaoEstimadaPorMontador > 30) {
    comissaoPorMontador = comissaoEstimadaPorMontador;
  }
  if (consultaEspecificaFeita) {
    return (
      <TableCell style={{ padding: 0, height: "100%", minWidth: "120px" }}>
        <div
          style={{
            height: "100%",
            justifyContent: "space-around",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div>
            {tableItem.montadoresRegistrados
              ?.filter((montador) => montador.compromisso === "Confirmado")
              .map((montador) =>
                situacaoDosMontadores[montador.nome].nivel > 1 ? (
                  <Badge
                    key={montador.nome}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      background: "white",
                      marginBottom: "5px",
                      marginTop: "5px",
                      borderRadius: "15px",
                      padding: "5px",
                    }}
                    badgeContent={`+${
                      bonificacoesPorNivel[
                        situacaoDosMontadores[montador.nome].nivel
                      ] / 2
                    }`}
                    color="success"
                  >
                    <small>{montador.nome.split(" ")[0]}</small>{" "}
                    <small style={{ fontWeight: "bold" }}>
                      R$
                      {bonificarPorNivel({
                        comissao: comissaoPorMontador,
                        nomeMontador: montador.nome,
                      }).toFixed(2)}
                    </small>
                  </Badge>
                ) : (
                  <div
                    key={montador.nome}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      background: "white",
                      marginBottom: "5px",
                      marginTop: "5px",
                      borderRadius: "15px",
                      padding: "5px",
                    }}
                  >
                    <small>{montador.nome.split(" ")[0]}</small>{" "}
                    <small style={{ fontWeight: "bold" }}>
                      R$
                      {bonificarPorNivel({
                        comissao: comissaoPorMontador,
                        nomeMontador: montador.nome,
                      }).toFixed(2)}
                    </small>
                  </div>
                )
              )}
          </div>
          <p style={{ textAlign: "center", fontSize: "0.8rem" }}>
            Total:
            <b>
              {" "}
              R$
              {tableItem.montadoresRegistrados
                ?.filter((montador) => montador.compromisso === "Confirmado")
                .map((montador) =>
                  bonificarPorNivel({
                    comissao: comissaoPorMontador,
                    nomeMontador: montador.nome,
                  })
                )
                .reduce((acumulador, numero) => acumulador + numero, 0)
                .toFixed(2)}
            </b>
          </p>
        </div>
      </TableCell>
    );
  }
  return <TableCell />;
};

export const Montadores = ({
  tableItem,
  listaDeProdutos,
  consultaEspecificaFeita,
  setTableItemList,
}: {
  tableItem: TableItem;
  consultaEspecificaFeita: boolean;
  tableItemList: TableItem[];
  setTableItemList: Dispatch<React.SetStateAction<TableItem[]>>;
  listaDeProdutos: ProductsType[];
}) => {
  const atualizarMontadoresItemRow = (
    itemId: string,
    montadores?: MontadorType[]
  ) => {
    if (montadores && montadores?.length > 0) {
      setTableItemList((prev) =>
        prev.map((item) =>
          item.event_id === itemId && item.event_id === montadores[0].idevento
            ? { ...item, montadoresRegistrados: montadores }
            : item
        )
      );
    }
  };

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== "https://app6.meeventos.com.br") return;
      if (event.data?.type === "EQUIPE_RESULT") {
        const html = event.data.html;
        const listaDeMontadoresDoEvento = extrairMontadoresDeHTML(html);
        atualizarMontadoresItemRow(
          tableItem.event_id,
          listaDeMontadoresDoEvento
        );
      }
    };
    window.addEventListener("message", handleMessage);

    return () => window.removeEventListener("message", handleMessage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [consultaEspecificaFeita, JSON.stringify(tableItem)]);

  function abrirNovaAba(id: string) {
    const win = window.open(
      `https://app6.meeventos.com.br/fumagallyeventos/index.php?p=eventos&acao=visualizar&id=${id}`,
      "_blank"
    ); // abre a segunda aba

    // espera a aba carregar e manda a mensagem
    const timer = setInterval(() => {
      if (win && win.postMessage) {
        win.postMessage({ type: "executar", msg: "abrirequipe" }, "*");
        clearInterval(timer);
      }
    }, 500);
  }

  const numeroTotalDeItens = listaDeProdutos
    .map((item) => item.quantidade)
    .reduce((acumulador, numero) => acumulador + numero, 0);
  if (!consultaEspecificaFeita) {
    return <TableCell></TableCell>;
  }

  if (consultaEspecificaFeita) {
    return (
      <TableCell style={{ paddingTop: 0, verticalAlign: "top" }}>
        <div
          style={{
            justifyContent: "center",
            alignItems: "center",
            display: "flex",
            textAlign: "center",
            flexDirection: "column",
          }}
        >
          <p
            style={{
              fontSize: "0.7rem",
              textAlign: "center",
              marginBottom: "10px",
              color: "white",
              backgroundColor: "rgba(0,0,0,0.2)",
              borderBottomRightRadius: "15px",
              borderBottomLeftRadius: "15px",
              paddingLeft: "15px",
              paddingRight: "15px",
            }}
          >
            Recomenda-se{" "}
            <b style={{ color: "rgb(120,120,120)", fontSize: "0.8rem" }}>
              {Math.ceil(numeroTotalDeItens / 8.9)}
            </b>{" "}
            {Math.ceil(numeroTotalDeItens / 8.9) > 1
              ? "montadores"
              : "montador"}
          </p>
          {tableItem.montadoresRegistrados?.map((pessoa, index) => (
            <Chip
              key={pessoa.nome + index}
              style={{ marginBottom: "5px" }}
              size="small"
              color={itemColor.status[pessoa.compromisso]}
              icon={itemColor.icon[pessoa.compromisso]}
              label={pessoa.nome}
            />
          ))}
          <Button
            variant="text"
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              abrirNovaAba(tableItem.event_id);
            }}
          >
            ➕
          </Button>
        </div>
      </TableCell>
    );
  }
  return <TableCell></TableCell>;
};
