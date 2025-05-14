"use client";
import FestivalRoundedIcon from "@mui/icons-material/FestivalRounded";
import FestivalIcon from "@mui/icons-material/Festival";
import { Chip, TableCell } from "@mui/material";
import { ProductsType, TableItem, tentConfig } from "./types";
import { Dispatch, useEffect } from "react";
import { extrairProdutosDeHTML } from "./utils/functions";

const TentBox = ({ item }: { item: ProductsType }) => {
  if (item.tipo === "OUTRO me pedir pra catalogar")
    return <div>Item não catalogado</div>;

  const config =
    item.tag === "produto"
      ? tentConfig[item.tipo]
      : tentConfig["OUTRO me pedir pra catalogar"];
  const color = config.color || "grey";
  const Icon = config.type === "barraca" ? FestivalRoundedIcon : FestivalIcon;

  const iconColor =
    config.type === "barraca"
      ? color === "Verde"
        ? "success"
        : color === "Azul"
        ? "primary"
        : "error"
      : "disabled";

  const iconColor2 =
    config.type === "barraca"
      ? color === "Verde"
        ? "green"
        : color === "Azul"
        ? "blue"
        : "red"
      : "grey";

  return (
    <div
      style={{
        border: "1px solid  rgba(0,0,0,0.1)",
        background: "white",
        borderRadius: "15px",
        display: "flex",
        padding: "3px",
        alignItems: "center",
        flexDirection: "row",

        marginBottom: "5px",
      }}
    >
      <div
        style={{
          flexDirection: "column",
          paddingLeft: "10px",
          paddingRight: "10px",
        }}
      >
        <p
          style={{
            fontSize: "1.2rem",
            fontWeight: "bold",
          }}
        >
          {item.quantidade}
        </p>

        <p style={{ color: iconColor2 }}>
          {config.color} {config.isLisa ? " lisa" : ""}
        </p>
      </div>
      <div>
        <p>{!Object.keys(tentConfig).includes(item.tipo) && item.tipo}</p>
      </div>
      {Object.keys(tentConfig).includes(item.tipo) && (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "right",
          }}
        >
          <Chip icon={<Icon color={iconColor} />} label={config.size} />
        </div>
      )}
    </div>
  );
};

export const ListaDeProdutosComp = ({
  listaDeProdutos,
  consultaEspecificaFeita,
  tableItem,
  setTableItemList,
}: {
  consultaEspecificaFeita: boolean;
  tableItem: TableItem;
  setTableItemList: Dispatch<React.SetStateAction<TableItem[]>>;
  listaDeProdutos: ProductsType[];
}) => {
  const atualizarProdutosItemRow = (
    itemId: string,
    products: ProductsType[]
  ) => {
    setTableItemList((prev) =>
      prev.map((item) =>
        item.event_id === itemId && item.event_id === products[0].idevento
          ? { ...item, produtos: products }
          : item
      )
    );
  };

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== "https://app6.meeventos.com.br") return;
      if (event.data?.type === "PRODUCTS_RESULT") {
        const html = event.data.html;
        const listaDeProdutosDoEvento = extrairProdutosDeHTML(html);
        atualizarProdutosItemRow(tableItem.event_id, listaDeProdutosDoEvento);
      }
    };
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [consultaEspecificaFeita, JSON.stringify(tableItem)]);

  if (!consultaEspecificaFeita) {
    return <TableCell></TableCell>;
  }
  if (consultaEspecificaFeita) {
    return (
      <TableCell>
        <div
          style={{
            justifyContent: "center",
            alignItems: "center",
            display: "flex",
            textAlign: "center",
            flexDirection: "column",
          }}
        >
          {listaDeProdutos.map((tent, index) => (
            <TentBox key={tent.tipo + tent.quantidade + index} item={tent} />
          ))}
        </div>
      </TableCell>
    );
  }
  return <TableCell></TableCell>;
};
