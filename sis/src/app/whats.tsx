"use client";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import { IconButton, Tooltip } from "@mui/material";
import { TableItem } from "./types";
import { Dayjs } from "dayjs";
import { infoPorBarraca } from "./utils";
import { getHoursFromISO } from "./utils/functions";
function gerarLinkWhatsapp(
  chatId: string,
  selectedDate: Dayjs | null,
  eventos: TableItem[]
) {
  const encode = (str: string) => encodeURIComponent(str);

  let mensagem = `🗓️ 〈 Agenda do dia *${selectedDate?.format(
    "DD/MM/YYYY* 〉"
  )}\n`;
  console.log("aqwerqwer ", eventos);
  eventos.forEach((evento) => {
    mensagem += `\n🔸 _${evento.tipo}_: *${evento.nome}*`;

    mensagem += `\n\n📍 _Local_: *${evento.endereco}* ➤ ${
      evento.naRua ?? evento.naRua ? "na rua" : "local privado"
    }`;

    mensagem += `\n\n🛍️ _Itens_: `;

    evento.produtos?.forEach((item) => {
      mensagem += `\n- *${item.quantidade}* ${
        item.tag === "produto"
          ? item.quantidade > 1
            ? "barracas"
            : "barraca"
          : ""
      } - \`${
        item.tag === "produto"
          ? infoPorBarraca[item.tipo].nome_whats
          : item.tipo
      }\` `;
    });

    mensagem += `\n\n👷🏼_Montadores_: `;

    evento.montadoresRegistrados?.forEach((montador) => {
      if (montador.compromisso === "Confirmado") {
        mensagem += ` *${montador.nome.split(" ")[0]} ${
          montador.nome.split(" ")[1]
        }*,`;
      }
    });

    mensagem += `\n\n🕒 _Horário para sair (com base no tempo de rota)_: *${evento.partidaCaminhao}*`;

    mensagem += `\n🕒 _Horário que o evento ${
      evento.tipo === "Desmontagem" ? "acaba" : "começa"
    }_: *${
      evento.tipo === "Desmontagem"
        ? getHoursFromISO(evento.horarioFinalEvento)
        : getHoursFromISO(evento.horarioInicioEvento)
    }*`;

    mensagem += `\n\n _Leva cerca de ⏱️${
      evento.tipo === "Desmontagem"
        ? evento.tempoEstimadoDesmontagem
        : evento.tempoEstimadoMontagem
    } para ${evento.tipo.toLocaleLowerCase()} e ⏱️${
      evento.tipo === "Desmontagem"
        ? evento.tempoEstimadoCarregarCaminhao
        : evento.tempoEstimadoCarregarCaminhao
    } para ${
      evento.tipo === "Desmontagem" ? "carregar" : "descarregar"
    } então o caminhão deve estar liberado por volta de 🕒${
      evento.estimativaCaminhaoLiberado
    }_`;

    mensagem += `\n\n ▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃ ⋆⋅☆⋅⋆ ▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃\n`;
  });

  const url = `https://web.whatsapp.com/send?chat_id=${chatId}&text=${encode(
    mensagem
  )}`;
  return url;
}

export const WhatsAppBtn = ({
  tableItemList,
  selectedDate,
}: {
  tableItemList: TableItem[];
  selectedDate: Dayjs | null;
}) => {
  return (
    <Tooltip title="Enviar rota WPP ">
      <IconButton
        onClick={() =>
          window.open(
            gerarLinkWhatsapp("0", selectedDate, tableItemList),
            "_blank"
          )
        }
        loading={false}
        color="success"
      >
        <WhatsAppIcon />
      </IconButton>
    </Tooltip>
  );
};
