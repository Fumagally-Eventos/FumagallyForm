"use client";

import { Dispatch, useEffect, useState } from "react";
import { DndContext, closestCenter, DragEndEvent } from "@dnd-kit/core";
import { DatePickerButton } from "./datepicker";
import { Dayjs } from "dayjs";
import {
  restrictToVerticalAxis,
  restrictToFirstScrollableAncestor,
} from "@dnd-kit/modifiers";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  IconButton,
  Tooltip,
} from "@mui/material";
import { Evento, ProductsType, PureEventType, TableItem } from "./types";
import { Comissao, Montadores } from "./montadores";
import { ListaDeProdutosComp } from "./produtos";
import { Estimativas } from "./estimativas";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import SaveIcon from "@mui/icons-material/Save";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";

import $ from "jquery";
import Image from "next/image";
import { WhatsAppBtn } from "./whats";
import { Endereco } from "./endereco";
import GitHubLabel from "./components/multiselect";
import { updateProductCache } from "./utils/asdf";
import { situacaoDosMontadores } from "./utils";

// Constants
const SOUND_PROBABILITY = 0.005;
const SOUND_PATHS = {
  DEFAULT: "/sounds/pop.mp3",
  SECRET: "/sounds/pop_secreto.mp3",
};

const STYLES = {
  alignCenter: {
    justifyContent: "center" as const,
    flexDirection: "column" as const,
    alignItems: "center" as const,
    display: "flex" as const,
    textAlign: "center" as const,
  },
  tableCell: {
    backgroundColor: "white",
    fontWeight: "bold",
    borderBottom: "2px solid rgba(224, 224, 224, 1)",
    position: "sticky",
    top: 0,
    zIndex: 1,
  },
  emptyState: {
    display: "flex" as const,
    height: "100%",
    justifyContent: "center" as const,
    alignItems: "center" as const,
    width: "100%",
    position: "relative" as const,
    flexDirection: "column" as const,
    color: "black",
    fontSize: "2rem",
  },
};

// Utility Functions
const playSound = () => {
  const isSecret = Math.random() < SOUND_PROBABILITY;
  new Audio(isSecret ? SOUND_PATHS.SECRET : SOUND_PATHS.DEFAULT)
    .play()
    .catch(console.error);
};

const getFormData = (id: string) => ({
  p: "imprimir",
  id,
  informacoes: "sim",
  cronograma: "sim",
  checklist: "nao",
  fornecedoresevento: "nao",
  equipe: "sim",
  celular: "sim",
  equipamentos: "sim",
  equipamentosfoto: "nao",
  equipamentosdata: "sim",
  equipamentoscat: "sim",
  adicional: "sim",
  planejamento: "nao",
  produtoseservicos: "simv",
  plantaevento: "nao",
});

// Types
interface ItemRowProps {
  tableItem: TableItem;
  tableItemList: TableItem[];
  setTableItemList: Dispatch<React.SetStateAction<TableItem[]>>;
  selectedDate: Dayjs | null;
}

// Components
const ItemRow: React.FC<ItemRowProps> = ({
  tableItem,
  selectedDate,
  tableItemList,
  setTableItemList,
}) => {
  // const [listaDeProdutos, setListaDeProdutos] = useState<ProductsType[]>([]);

  const [consultaEspecificaFeita, setConsultaEspecificaFeita] =
    useState<boolean>(false);

  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: tableItem.id });

  // Handle row hover effects
  const handleMouseEnter = (e: React.MouseEvent<HTMLTableRowElement>) => {
    e.currentTarget.style.backgroundColor = "rgb(245, 245, 245)";
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLTableRowElement>) => {
    e.currentTarget.style.backgroundColor = "rgb(255, 255, 255)";
  };

  // Handle drag handle mouse events
  const handleDragHandleMouseDown = (
    e: React.MouseEvent<HTMLTableCellElement>
  ) => {
    e.currentTarget.style.cursor = "grabbing";
  };

  const handleDragHandleMouseUp = (
    e: React.MouseEvent<HTMLTableCellElement>
  ) => {
    e.currentTarget.style.cursor = "grab";
  };

  // Handle print button click
  const handlePrintClick = () => {
    $.ajax({
      type: "POST",
      url: "?p=editar&pagina=imprimir-evento",
      data: getFormData,
      success: () => {
        window.open(
          `https://app6.meeventos.com.br/fumagallyeventos/index.php?p=imprimir&id=${
            tableItem.event_id
          }?p=editar&pagina=imprimir-evento&${$.param(
            getFormData(tableItem.event_id)
          )}`,
          "_blank"
        );
      },
    });
  };

  return (
    <TableRow
      id={tableItem.event_id}
      ref={setNodeRef}
      style={{
        transform: transform ? `translateY(${transform.y}px)` : undefined,
        transition,
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      {...attributes}
    >
      <TableCell
        style={{
          borderBottom: "1px solid black",
          backgroundColor:
            tableItem.tipo === "Montagem" ? "#c8f7c5" : "#f7c5c5",
          maxWidth: "100px",
        }}
      >
        <div style={STYLES.alignCenter}>
          <small
            style={{
              color: tableItem.tipo === "Montagem" ? "darkgreen" : "darkred",
            }}
          >
            {tableItem.tipo}
          </small>
          <br />
          {tableItem.nome}
        </div>
      </TableCell>

      <Estimativas
        tableItem={tableItem}
        selectedDate={selectedDate}
        tableItemList={tableItemList}
        listaDeProdutos={
          tableItem.produtos && tableItem.produtos?.length > 0
            ? tableItem.produtos
            : ([] as ProductsType[])
        }
        consultaEspecificaFeita={consultaEspecificaFeita}
        //montadores={montadores}
        setTableItemList={setTableItemList}
      />

      <Endereco
        endereco={tableItem.endereco}
        consultaEspecificaFeita={consultaEspecificaFeita}
        tableItem={tableItem}
        setTableItemList={setTableItemList}
      />

      <Montadores
        key="montadores"
        tableItem={tableItem}
        tableItemList={tableItemList}
        consultaEspecificaFeita={consultaEspecificaFeita}
        setTableItemList={setTableItemList}
        listaDeProdutos={
          tableItem.produtos && tableItem.produtos?.length > 0
            ? tableItem.produtos
            : ([] as ProductsType[])
        }
        //montadores={montadores}
      />

      <ListaDeProdutosComp
        key="produtos"
        tableItem={tableItem}
        setTableItemList={setTableItemList}
        listaDeProdutos={
          tableItem.produtos && tableItem.produtos?.length > 0
            ? tableItem.produtos
            : ([] as ProductsType[])
        }
        consultaEspecificaFeita={consultaEspecificaFeita}
      />

      <Comissao
        key="comissao"
        listaDeProdutos={
          tableItem.produtos && tableItem.produtos?.length > 0
            ? tableItem.produtos
            : ([] as ProductsType[])
        }
        tableItem={tableItem}
        consultaEspecificaFeita={consultaEspecificaFeita}
      />

      <TableCell style={{ height: "100%" }}>
        <div
          style={{
            display: "flex",
            height: "100%",
            flexDirection: "column",
            justifyContent: "space-around",
          }}
        >
          {!consultaEspecificaFeita && (
            <Button
              variant="outlined"
              size="small"
              onClick={() => {
                window.parent.postMessage(
                  { type: "GET_EQUIPE", id: tableItem.event_id },
                  "*"
                );
                window.parent.postMessage(
                  { type: "GET_PRODUCTS", id: tableItem.event_id },
                  "*"
                );
                window.parent.postMessage(
                  { type: "GET_EVENT_EDIT_INFOS", id: tableItem.event_id },
                  "*"
                );

                setConsultaEspecificaFeita(true);
              }}
            >
              🔎
            </Button>
          )}
          {consultaEspecificaFeita && (
            <Button
              variant="outlined"
              size="small"
              onClick={() => {
                updateProductCache("12", "12/12/2012", [
                  { nome: "asdf", quantidade: 12 },
                ]);
              }}
            >
              📲
            </Button>
          )}
          {consultaEspecificaFeita && (
            <Button variant="outlined" size="small" onClick={handlePrintClick}>
              📄
            </Button>
          )}
          {consultaEspecificaFeita && (
            <Tooltip title="Enviar convite a montadores escalados.">
              <Button
                variant="outlined"
                size="small"
                onClick={() => {
                  tableItem.montadoresRegistrados?.map((montador) => {
                    const mensagem = encodeURIComponent(
                      `🎉 _Que ótimo podermos contar com você para a realização do evento_ *${tableItem.nome}*! 🎉\n\n📌 Segue o link para *confirmar sua presença*:\n👇👇\n` +
                        `https://app6.meeventos.com.br/fumagallyeventos/?x=${
                          situacaoDosMontadores[montador.nome].idMontador
                        }&c=&tipo=agendaequipe&idevento=${
                          tableItem.event_id
                        }&acao=detalhesevento`
                    );
                    if (montador.compromisso === "Escalado") {
                      window.open(
                        `https://web.whatsapp.com/send?phone=${
                          situacaoDosMontadores[montador.nome].numWhats
                        }&text=${mensagem}`,
                        "_blank"
                      );
                    }
                  });
                }}
              >
                <WhatsAppIcon color="success" fontSize="small" />
              </Button>
            </Tooltip>
          )}
          {consultaEspecificaFeita && (
            <GitHubLabel tableItemList={tableItemList} />
          )}
        </div>
      </TableCell>
      <TableCell
        style={{ cursor: "grab", backgroundColor: "rgba(0,0,0,0.1)" }}
        onMouseDown={handleDragHandleMouseDown}
        onMouseUp={handleDragHandleMouseUp}
        {...listeners}
      >
        <div style={STYLES.alignCenter}>⇅</div>
      </TableCell>
    </TableRow>
  );
};

// Main Component
const DragDropTable: React.FC = () => {
  const [consultaGeralFeita, setConsultaGeralFeita] = useState<boolean>(false);
  const [pureListOrganized, setPureListOrganized] = useState<Evento[]>([]);
  const [tableItemList, setTableItemList] = useState<TableItem[]>([]);
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);

  // Handle drag and drop events
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = tableItemList.findIndex((item) => item.id === active.id);
      const newIndex = tableItemList.findIndex((item) => item.id === over.id);
      setTableItemList(arrayMove(tableItemList, oldIndex, newIndex));
      playSound();
    }
  };

  // Organize events by type (montagem, desmontagem, evento)
  const organizarEventos = (eventos: PureEventType[]) => {
    const resultado: Record<string, Evento> = {};

    eventos.forEach((evento) => {
      const id = evento.id;
      if (!resultado[id]) {
        resultado[id] = { evento };
      }

      const tags = evento.extraFields.tags.map((tag) => tag.nome.toLowerCase());

      if (tags.includes("montagem")) {
        resultado[id].montagem = evento;
      } else if (tags.includes("desmontagem")) {
        resultado[id].desmontagem = evento;
      } else if (tags.length === 0) {
        resultado[id].evento = evento;
      }
    });

    setPureListOrganized(Object.values(resultado));
  };

  // Listen for messages from parent window
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== "https://app6.meeventos.com.br") return;
      if (event.data?.type === "EQUIPE_RESULT") return;
      if (event.data?.type === "PRODUCTS_RESULT") return;
      if (event.data?.type === "EVENT_EDIT_INFOS_RESULT") return;
      organizarEventos(JSON.parse(event.data.value));
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  return (
    <TableContainer style={{ height: "100vh", overflow: "auto" }}>
      <DndContext
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
        modifiers={[restrictToVerticalAxis, restrictToFirstScrollableAncestor]}
      >
        <SortableContext
          items={tableItemList.map((item) => item.id)}
          strategy={verticalListSortingStrategy}
        >
          <Table stickyHeader style={{ marginBottom: 10 }}>
            <TableHead>
              <TableRow>
                {[
                  <div
                    key="header-actions"
                    style={{
                      display: "flex",
                      justifyContent: "space-evenly",
                    }}
                  >
                    <Tooltip title="Pesquisar rota no Google">
                      <IconButton
                        onClick={() => {
                          const addresses = tableItemList
                            .map((item) => encodeURIComponent(item.endereco))
                            .join("/");
                          window.open(
                            `https://www.google.com.br/maps/dir/${addresses}`,
                            "_blank"
                          );
                        }}
                        loading={false}
                      >
                        <Image
                          src="gmaps.svg"
                          alt="maps"
                          width={24}
                          height={24}
                        />
                      </IconButton>
                    </Tooltip>
                    <WhatsAppBtn
                      tableItemList={tableItemList}
                      selectedDate={selectedDate}
                    />
                    <Tooltip title="Gerar PDF da rota (deste dia)">
                      <IconButton
                        onClick={() => console.log(true)}
                        color="error"
                        loading={false}
                      >
                        <PictureAsPdfIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Salvar rota atual no navegador (ordem e horarios)">
                      <IconButton
                        color="inherit"
                        onClick={() => console.log(true)}
                        loading={false}
                      >
                        <SaveIcon />
                      </IconButton>
                    </Tooltip>
                  </div>,
                  <DatePickerButton
                    selectedDate={selectedDate}
                    setConsultaGeralFeita={setConsultaGeralFeita}
                    setSelectedDate={setSelectedDate}
                    key="datepickerbtn"
                    setter={setTableItemList}
                    list={pureListOrganized}
                  />,
                  "Endereço",
                  "Montador Confirmou",
                  "Itens",
                  "Comissão",
                  "Opções",
                  "",
                ].map((header, i) => (
                  <TableCell key={i} sx={STYLES.tableCell}>
                    <div style={STYLES.alignCenter}>{header}</div>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody style={{ height: "100%" }}>
              {consultaGeralFeita && (
                <>
                  {tableItemList.map((item) => (
                    <ItemRow
                      key={item.id}
                      tableItem={item}
                      selectedDate={selectedDate}
                      tableItemList={tableItemList}
                      setTableItemList={setTableItemList}
                    />
                  ))}
                </>
              )}
            </TableBody>
          </Table>
          {consultaGeralFeita && tableItemList.length === 0 && (
            <div style={STYLES.emptyState}>
              <CalendarTodayIcon
                fontSize="large"
                style={{ marginBottom: "2rem" }}
              />
              <p>Nenhum evento nesta data.</p>
            </div>
          )}
          {!consultaGeralFeita && (
            <div style={STYLES.emptyState}>
              <CalendarMonthIcon
                fontSize="large"
                style={{ marginBottom: "2rem" }}
              />
              <p>Selecione uma data para começar</p>
            </div>
          )}
        </SortableContext>
      </DndContext>
    </TableContainer>
  );
};

export default DragDropTable;
