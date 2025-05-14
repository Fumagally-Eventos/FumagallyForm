import { TableCell } from "@mui/material";
import { Dispatch, useEffect } from "react";
import { TableItem } from "./types";
import { extrairInfoEventoDeHTML } from "./utils/functions";

interface EnderecoType {
  endereco: string;
  consultaEspecificaFeita: boolean;
  setTableItemList: Dispatch<React.SetStateAction<TableItem[]>>;
  tableItem: TableItem;
}
export const Endereco = ({
  endereco,
  consultaEspecificaFeita,
  setTableItemList,
  tableItem,
}: EnderecoType) => {
  const IconeDeRua = (naRua: boolean) => {
    if (!consultaEspecificaFeita) {
      return "";
    }
    if (naRua) {
      return (
        <div
          style={{
            paddingLeft: "10px",
            paddingRight: "10px",
            border: "1px solid rgba(0, 0, 0, 0.1)",
            borderRadius: "15px",
            background: "white",
            display: "flex",
            flexDirection: "column",
            marginBottom: "10px",
            width: "110px",
          }}
        >
          <p style={{ fontSize: "3.5rem" }}>🏘</p>
          Na Rua
        </div>
      );
    }
    return (
      <div
        style={{
          paddingLeft: "10px",
          paddingRight: "10px",
          border: "1px solid rgba(0, 0, 0, 0.1)",
          borderRadius: "15px",
          background: "white",
          display: "flex",
          flexDirection: "column",
          marginBottom: "10px",
          width: "110px",
        }}
      >
        <p style={{ fontSize: "3.5rem" }}>🏟</p>
        Local Privado
      </div>
    );
  };

  const atualizarEnderecoItemRow = (
    itemId: string | null,
    endereco: string | null,
    naRua: boolean | null,
    idEvento: string | null
  ) => {
    if (endereco) {
      setTableItemList((prev) =>
        prev.map((item) =>
          item.event_id === itemId && item.event_id === idEvento
            ? {
                ...item,
                ...(typeof naRua === "boolean" ? { naRua } : {}),
                endereco: endereco ?? "",
              }
            : item
        )
      );
    }
  };

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== "https://app6.meeventos.com.br") return;
      if (event.data?.type === "EVENT_EDIT_INFOS_RESULT") {
        const html = event.data.html;
        const { idEvento, naRua, endereco } = extrairInfoEventoDeHTML(html);
        atualizarEnderecoItemRow(tableItem.event_id, endereco, naRua, idEvento);
      }
    };
    window.addEventListener("message", handleMessage);

    return () => window.removeEventListener("message", handleMessage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [consultaEspecificaFeita, JSON.stringify(tableItem)]);

  return (
    <TableCell sx={{ minWidth: 200 }}>
      <div
        style={{
          justifyContent: "space-evenly",
          flexDirection: "column",
          alignItems: "center",
          display: "flex",
          textAlign: "center",
          height: "100%",
          msFlexDirection: "column",
        }}
      >
        {tableItem.naRua != null &&
          tableItem.naRua !== undefined &&
          IconeDeRua(tableItem.naRua)}
        {endereco}
      </div>
    </TableCell>
  );
};
