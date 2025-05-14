import { TableCell } from "@mui/material";
//import { getHoursFromISO } from "./utils/functions";
import { Dayjs } from "dayjs";
import { infoPorBarraca } from "./utils";

import {
  ProductsType,
  TableItem,
  TableItemTypeType,
  // TableItem,
} from "./types";
import {
  compararDatas,
  converterMinutosParaHoras,
  formatarData,
  somarHorarios,
  subtrairHorarios,
} from "./utils/functions";
import { CustomTimePicker } from "./components/inputHours";
import { Dispatch, useEffect, useState } from "react";

const HorarioCombinado = ({
  tipo,
  horarioPartida,
  horarioCombinado,
  horarioCaminhaoLiberado,
}: {
  tipo: TableItemTypeType;
  horarioPartida: string;
  horarioCombinado: string;
  horarioCaminhaoLiberado: string;
}) => {
  return (
    <>
      <div style={{ display: "flex" }}>
        <div
          style={{
            border: "1px solid",
            borderColor: "rgba(0, 0, 0, 0.2)",
            paddingInline: "8px",
            borderRadius: "4px",
            fontFamily: "monospace",
            marginRight: "5px",
            marginLeft: "5px",
          }}
        >
          {horarioPartida}
        </div>
        (🚛 horário de partida)
      </div>
      <div style={{ display: "flex" }}>
        <div
          style={{
            border: "1px solid",
            borderColor: "rgba(0, 0, 0, 0.2)",
            paddingInline: "8px",
            borderRadius: "4px",
            fontFamily: "monospace",
            marginRight: "5px",
            marginLeft: "5px",
          }}
        >
          {horarioCombinado}
        </div>
        (horário combinado {tipo.slice(0, 4)}.)
      </div>{" "}
      <div style={{ display: "flex" }}>
        <div
          style={{
            border: "1px solid",
            borderColor: "rgba(0, 0, 0, 0.2)",
            paddingInline: "8px",
            borderRadius: "4px",
            fontFamily: "monospace",
            marginRight: "5px",
            marginLeft: "5px",
          }}
        >
          {horarioCaminhaoLiberado}
        </div>
        (🚛{" "}
        {tipo === "Desmontagem"
          ? "desmontado e carregado"
          : "descarregado e montado"}
        )
      </div>{" "}
    </>
  );
};

const TempoMontagem = ({
  tempoPorFuncionario,
}: {
  tempoPorFuncionario: number;
}) => {
  return (
    <div style={{ display: "flex" }}>
      <div
        style={{
          border: "1px solid",
          borderColor: "rgba(0, 0, 0, 0.2)",
          paddingInline: "8px",
          borderRadius: "4px",
          fontFamily: "monospace",
          marginRight: "5px",
          marginLeft: "5px",
        }}
      >
        {converterMinutosParaHoras(tempoPorFuncionario)}
      </div>
      para montar
    </div>
  );
};
const TempoDesmontagem = ({
  tempoPorFuncionario,
}: {
  tempoPorFuncionario: number;
}) => {
  return (
    <div style={{ display: "flex" }}>
      <div
        style={{
          border: "1px solid",
          borderColor: "rgba(0, 0, 0, 0.2)",
          paddingInline: "8px",
          borderRadius: "4px",
          fontFamily: "monospace",
          marginRight: "5px",
          marginLeft: "5px",
        }}
      >
        {converterMinutosParaHoras(tempoPorFuncionario)}
      </div>{" "}
      para desmontar
    </div>
  );
};
const TempoCarregamento = ({
  tempoPorFuncionario,
}: {
  tempoPorFuncionario: number;
}) => {
  return (
    <div style={{ display: "flex" }}>
      <div
        style={{
          border: "1px solid",
          borderColor: "rgba(0, 0, 0, 0.2)",
          paddingInline: "8px",
          borderRadius: "4px",
          fontFamily: "monospace",
          marginRight: "5px",
          marginLeft: "5px",
        }}
      >
        {converterMinutosParaHoras(tempoPorFuncionario)}
      </div>{" "}
      para carregar
    </div>
  );
};
const TempoDescarregamento = ({
  tempoPorFuncionario,
}: {
  tempoPorFuncionario: number;
}) => {
  return (
    <div style={{ display: "flex" }}>
      <div
        style={{
          border: "1px solid",
          borderColor: "rgba(0, 0, 0, 0.2)",
          paddingInline: "8px",
          borderRadius: "4px",
          fontFamily: "monospace",
          marginRight: "5px",
          marginLeft: "5px",
        }}
      >
        {converterMinutosParaHoras(tempoPorFuncionario)}
      </div>{" "}
      para descarregar
    </div>
  );
};

const TempoViajem = ({
  setTempoDeRota,
}: {
  setTempoDeRota: (tempo: string) => void;
}) => {
  return (
    <div style={{ display: "flex", minWidth: "200px" }}>
      <CustomTimePicker onChange={(val) => setTempoDeRota(val)} /> {` `}
      para ir até o local.
    </div>
  );
};

const HorarioSaida = () => {
  return <></>;
};

export const Estimativas = ({
  tableItem,
  listaDeProdutos,
  selectedDate,
  setTableItemList,
  consultaEspecificaFeita,
}: {
  tableItem: TableItem;
  listaDeProdutos: ProductsType[];
  tableItemList: TableItem[];
  setTableItemList: Dispatch<React.SetStateAction<TableItem[]>>;
  selectedDate: Dayjs | null;
  consultaEspecificaFeita: boolean;
}) => {
  const [tempoDeRota, setTempoDeRota] = useState("00:00");

  const atualizarEstimativasItemRow = ({
    itemId,
    horarioEstimadoLiberarCaminhao,
    tempoEstimadoCarregarCaminhao,
    tempoEstimadoDescarregarCaminhao,
    partidaCaminhao,
    tempoEstimadoDesmontagem,
    tempoEstimadoMontagem,
    tempoEstimadoViagem,
  }: {
    itemId: string;
    horarioEstimadoLiberarCaminhao: string;
    tempoEstimadoCarregarCaminhao: string;
    tempoEstimadoDescarregarCaminhao: string;
    partidaCaminhao: string;
    tempoEstimadoDesmontagem: string;
    tempoEstimadoMontagem: string;
    tempoEstimadoViagem: string;
  }) => {
    setTableItemList((prev) =>
      prev.map((item) =>
        item.event_id === itemId
          ? {
              ...item,
              estimativaCaminhaoLiberado: horarioEstimadoLiberarCaminhao,
              tempoEstimadoCarregarCaminhao,
              tempoEstimadoDescarregarCaminhao,
              partidaCaminhao,
              tempoEstimadoDesmontagem,
              tempoEstimadoMontagem,
              tempoEstimadoViagem,
            }
          : item
      )
    );
  };

  const totalmontadoresRegistrados =
    tableItem.montadoresRegistrados &&
    tableItem.montadoresRegistrados?.length > 0
      ? tableItem.montadoresRegistrados.filter(
          (montador) => montador.compromisso === "Confirmado"
        ).length
      : 0;

  const getTempoMontagem = () => {
    if (totalmontadoresRegistrados <= 0) return 0;

    let tempoTotal = 0;

    for (const item of listaDeProdutos) {
      const dados =
        item.tag === "produto"
          ? infoPorBarraca[item.tipo]
          : infoPorBarraca["OUTRO me pedir pra catalogar"];
      if (!dados) continue;

      tempoTotal += item.quantidade * dados.tempo_estimado_montagem;
    }

    const tempoPorFuncionario = tempoTotal / totalmontadoresRegistrados;
    return tempoPorFuncionario;
  };
  const getTempoDescarregamento = () => {
    if (totalmontadoresRegistrados <= 0) return 0;

    let tempoTotal = 0;

    for (const item of listaDeProdutos) {
      const dados =
        item.tag === "produto"
          ? infoPorBarraca[item.tipo]
          : infoPorBarraca["OUTRO me pedir pra catalogar"];
      if (!dados) continue;

      tempoTotal += item.quantidade * dados.tempo_estimado_descarregamento;
    }

    const tempoPorFuncionario = tempoTotal / (totalmontadoresRegistrados / 2);
    return tempoPorFuncionario;
  };
  const getTempoCarregamento = () => {
    if (totalmontadoresRegistrados <= 0) return 0;

    let tempoTotal = 0;

    for (const item of listaDeProdutos) {
      const dados =
        item.tag === "produto"
          ? infoPorBarraca[item.tipo]
          : infoPorBarraca["OUTRO me pedir pra catalogar"];
      if (!dados) continue;

      tempoTotal += item.quantidade * dados.tempo_estimado_carregamento;
    }

    const tempoPorFuncionario = tempoTotal / (totalmontadoresRegistrados / 2);
    return tempoPorFuncionario;
  };

  const getTempoDesmontagem = () => {
    if (totalmontadoresRegistrados <= 0) return 0;

    let tempoTotal = 0;

    for (const item of listaDeProdutos) {
      const dados =
        item.tag === "produto"
          ? infoPorBarraca[item.tipo]
          : infoPorBarraca["OUTRO me pedir pra catalogar"];
      if (!dados) continue;

      tempoTotal += item.quantidade * dados.tempo_estimado_desmontagem;
    }

    const tempoPorFuncionario = tempoTotal / totalmontadoresRegistrados;
    return tempoPorFuncionario;
  };

  const horarioCombinado = tableItem.data.split("T")[1].slice(0, -3);

  const getTempoCaminhaoLiberado = ({
    tipo,
    tempoCarregamento,
    tempoDescarregamento,
    tempoMontDesm,
  }: {
    tipo: TableItemTypeType;
    tempoDescarregamento: string;
    tempoCarregamento: string;
    tempoMontDesm: string;
  }) => {
    const somaHCombinadoTMontagemTDescarregamento = somarHorarios(
      somarHorarios(horarioCombinado, tempoDescarregamento),
      tempoMontDesm
    );
    const somaHCombinadoTDesmontagemTCarregamento = somarHorarios(
      somarHorarios(horarioCombinado, tempoCarregamento),
      tempoMontDesm
    );
    if (tipo === "Desmontagem") {
      return somaHCombinadoTDesmontagemTCarregamento;
    }
    if (tipo === "Montagem") {
      return somaHCombinadoTMontagemTDescarregamento;
    }
    return "erro getTempoCaminhaoLiberado";
  };

  useEffect(() => {
    if (consultaEspecificaFeita) {
      atualizarEstimativasItemRow({
        itemId: tableItem.event_id,
        horarioEstimadoLiberarCaminhao:
          tableItem.tipo === "Desmontagem"
            ? getTempoCaminhaoLiberado({
                tempoCarregamento: converterMinutosParaHoras(
                  getTempoCarregamento()
                ).trim(),
                tempoDescarregamento: "00:00",
                tempoMontDesm: converterMinutosParaHoras(
                  getTempoDesmontagem()
                ).trim(),
                tipo: tableItem.tipo,
              })
            : getTempoCaminhaoLiberado({
                tempoCarregamento: "00:00",
                tempoDescarregamento: converterMinutosParaHoras(
                  getTempoDescarregamento()
                ).trim(),
                tempoMontDesm: converterMinutosParaHoras(
                  getTempoMontagem()
                ).trim(),
                tipo: tableItem.tipo,
              }),
        partidaCaminhao: subtrairHorarios(horarioCombinado, tempoDeRota),
        tempoEstimadoCarregarCaminhao: converterMinutosParaHoras(
          getTempoCarregamento()
        ).trim(),
        tempoEstimadoDescarregarCaminhao: converterMinutosParaHoras(
          getTempoDescarregamento()
        ).trim(),
        tempoEstimadoDesmontagem: converterMinutosParaHoras(
          getTempoDesmontagem()
        ).trim(),
        tempoEstimadoMontagem: converterMinutosParaHoras(
          getTempoMontagem()
        ).trim(),
        tempoEstimadoViagem: tempoDeRota,
      });
    }
  }, [consultaEspecificaFeita, JSON.stringify(tableItem)]);

  return (
    <>
      {!consultaEspecificaFeita ? (
        <TableCell sx={{ minWidth: "290px" }} />
      ) : (
        <TableCell
          sx={{ minWidth: "290px", verticalAlign: "top", paddingTop: "0px" }}
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
              minWidth: "220px",
            }}
          >
            <b style={{ fontSize: "0.8rem" }}>
              Evento {tableItem.tipo === "Desmontagem" ? "acaba" : "começa"}
            </b>{" "}
            <b style={{ color: "rgb(120,120,120)", fontSize: "0.8rem" }}>
              {tableItem.tipo === "Desmontagem"
                ? tableItem.horarioFinalEvento?.split("T")[1].slice(0, 5)
                : tableItem.horarioInicioEvento?.split("T")[1].slice(0, 5)}
            </b>{" "}
            <b style={{ fontSize: "0.8rem" }}>
              {selectedDate &&
                compararDatas(
                  tableItem.tipo === "Desmontagem"
                    ? formatarData(tableItem.horarioFinalEvento?.split("T")[0])
                    : formatarData(
                        tableItem.horarioInicioEvento?.split("T")[0]
                      ),
                  selectedDate.format("DD/MM/YYYY")
                )}
            </b>
          </p>
          <small
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginTop: "-3px",
            }}
          >
            <div
              style={{ flex: "1", height: "1px", backgroundColor: "#ccc" }}
            />
            <div
              style={{
                padding: "0 1rem",
                whiteSpace: "nowrap",
                fontWeight: "bold",
                color: "#ccc",
              }}
            >
              Estimativas
            </div>
            <div
              style={{ flex: "1", height: "1px", backgroundColor: "#ccc" }}
            />
          </small>
          <div
            style={{
              justifyContent: "center",
              flexDirection: "column",
              alignItems: "flex-start",
              display: "flex",
              textAlign: "center",
            }}
          >
            <TempoViajem setTempoDeRota={setTempoDeRota} />
            {tableItem.tipo === "Montagem" && (
              <>
                <TempoDescarregamento
                  tempoPorFuncionario={getTempoDescarregamento()}
                />
                <TempoMontagem tempoPorFuncionario={getTempoMontagem()} />
              </>
            )}
            {tableItem.tipo === "Desmontagem" && (
              <>
                <TempoDesmontagem tempoPorFuncionario={getTempoDesmontagem()} />
                <TempoCarregamento
                  tempoPorFuncionario={getTempoCarregamento()}
                />
              </>
            )}
            <HorarioSaida />
          </div>
          <small
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginTop: "5px",
            }}
          >
            <div
              style={{ flex: "1", height: "1px", backgroundColor: "#ccc" }}
            />
            <div
              style={{
                padding: "0 1rem",
                whiteSpace: "nowrap",
                fontWeight: "bold",
                color: "#ccc",
              }}
            >
              Cronograma Estimado
            </div>
            <div
              style={{ flex: "1", height: "1px", backgroundColor: "#ccc" }}
            />
          </small>
          <HorarioCombinado
            tipo={tableItem.tipo}
            horarioCombinado={horarioCombinado}
            horarioPartida={subtrairHorarios(horarioCombinado, tempoDeRota)}
            horarioCaminhaoLiberado={
              tableItem.tipo === "Desmontagem"
                ? getTempoCaminhaoLiberado({
                    tempoCarregamento: converterMinutosParaHoras(
                      getTempoCarregamento()
                    ),
                    tempoDescarregamento: "00:00",
                    tempoMontDesm: converterMinutosParaHoras(
                      getTempoDesmontagem()
                    ),
                    tipo: tableItem.tipo,
                  })
                : getTempoCaminhaoLiberado({
                    tempoCarregamento: "00:00",
                    tempoDescarregamento: converterMinutosParaHoras(
                      getTempoDescarregamento()
                    ),
                    tempoMontDesm: converterMinutosParaHoras(
                      getTempoMontagem()
                    ),
                    tipo: tableItem.tipo,
                  })
            }
          />
        </TableCell>
      )}
    </>
  );
};
