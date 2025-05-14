"use client";

import { useEffect, useState } from "react";
import { Button, Popper, Paper } from "@mui/material";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Dayjs } from "dayjs";
import { Evento, TableItem } from "./types";

export function DatePickerButton({
  list,
  setter,
  selectedDate,
  setConsultaGeralFeita,
  setSelectedDate,
}: {
  selectedDate?: Dayjs | null;
  setSelectedDate: (arg: Dayjs | null) => void;
  setConsultaGeralFeita: (arg: boolean) => void;
  list: Evento[];
  setter: (item: TableItem[]) => void;
}) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  function filtrarMontagensDesmontagensPorData(
    lista: Evento[],
    dataSelecionada: string | undefined
  ) {
    if (!dataSelecionada) return [];

    const listaFiltrada: TableItem[] = [];

    lista.map((ev) => {
      const dataMontagem = ev.montagem && ev.montagem.start.split("T")[0];
      const dataDesmontagem =
        ev.desmontagem && ev.desmontagem.start.split("T")[0];
      if (
        ev.desmontagem &&
        ev.montagem &&
        dataMontagem === dataSelecionada &&
        dataDesmontagem === dataSelecionada
      ) {
        listaFiltrada.push({
          data: ev.montagem.start,
          endereco: ev.montagem.extraFields.enderecolocal,
          horarioInicioEvento: ev.evento.start,
          horarioFinalEvento: ev.evento.end,
          id: `${ev.montagem.id}-m`,
          event_id: ev.montagem.id,
          nome: ev.montagem.extraFields.title,
          tipo: ev.montagem.extraFields.tags[0].nome,
        });
        listaFiltrada.push({
          data: ev.desmontagem.start,

          endereco: ev.desmontagem.extraFields.enderecolocal,
          id: `${ev.desmontagem.id}-d`,
          event_id: ev.desmontagem.id,
          horarioFinalEvento: ev.evento.end,
          horarioInicioEvento: ev.evento.start,
          nome: ev.desmontagem.extraFields.title,
          tipo: ev.desmontagem.extraFields.tags[0].nome,
        });
        return;
      }
      if (ev.montagem && dataMontagem === dataSelecionada) {
        listaFiltrada.push({
          data: ev.montagem.start,

          endereco: ev.montagem.extraFields.enderecolocal,
          id: `${ev.montagem.id}-m`,
          event_id: ev.montagem.id,
          horarioInicioEvento: ev.evento.start,
          horarioFinalEvento: ev.evento.end,
          nome: ev.montagem.extraFields.title,
          tipo: ev.montagem.extraFields.tags[0].nome,
        });
        return;
      }
      if (ev.desmontagem && dataDesmontagem === dataSelecionada) {
        listaFiltrada.push({
          data: ev.desmontagem.start,
          // TODO aqui tem de vir da api tbm
          endereco: ev.desmontagem.extraFields.enderecolocal,
          id: `${ev.desmontagem.id}-d`,
          event_id: ev.desmontagem.id,
          horarioFinalEvento: ev.evento.end,
          horarioInicioEvento: ev.evento.start,
          nome: ev.desmontagem.extraFields.title,
          tipo: ev.desmontagem.extraFields.tags[0].nome,
        });
        return;
      }
    });
    return listaFiltrada;
  }

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    const dataFormatada = selectedDate?.format("YYYY-MM-DD");
    const eventosFiltrados = filtrarMontagensDesmontagensPorData(
      list,
      dataFormatada
    );
    setter(eventosFiltrados);
  }, [selectedDate, list, setter]);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Button
        variant="text"
        style={{
          textTransform: "capitalize",
          color: "rgba(0, 0, 0, 0.87)",
          fontWeight: "bold",
        }}
        //  style={{ position: "fixed", bottom: 0, left: 0 }}
        onClick={handleClick}
      >
        {selectedDate ? selectedDate.format("DD/MM/YYYY") : "Selecionar Data"}
      </Button>

      <Popper open={Boolean(anchorEl)} anchorEl={anchorEl} placement="bottom">
        <Paper sx={{ p: 2 }}>
          <DatePicker
            value={selectedDate}
            format="DD/MM/YYYY"
            onChange={(newValue) => {
              setSelectedDate(newValue);
              setConsultaGeralFeita(true);
              if (newValue) {
                handleClose();
              }
            }}
            slotProps={{
              actionBar: {
                actions: ["clear", "today", "accept"],
              },
            }}
          />
        </Paper>
      </Popper>
    </LocalizationProvider>
  );
}
