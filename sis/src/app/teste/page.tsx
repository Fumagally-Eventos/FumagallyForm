"use client";
import { useEffect } from "react";
import { useGlobalState } from "../context/GlobalContext";
import {
  Container,
  Typography,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Badge,
  Box,
} from "@mui/material";

export default function EventDetailsPage() {
  const { event, setEvent } = useGlobalState();

  useEffect(() => {
    window.addEventListener("message", (event) => {
      if (event.data.key === "ronaldo") {
        setEvent(event.data.value);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!event) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Typography variant="h5" color="error">
          Nenhum evento carregado.
        </Typography>
      </Container>
    );
  }

  // Simulação de controle externo (poderia vir de um contexto ou API)
  const itensRestantes = event.listaDeProdutos.map((item) => ({
    ...item,
    restante: Math.max(item.quantidade - 1, 0), // Simulação: reduzir 1 para teste
  }));

  return (
    <Container
      maxWidth="md"
      sx={{
        mt: 4,
        bgcolor: "#4A0D23",
        color: "#FFD700",
        p: 3,
        borderRadius: 2,
      }}
    >
      {/* Espaço para a logo */}
      <Box
        sx={{
          height: 100,
          bgcolor: "#FFD700",
          mb: 2,
          borderRadius: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Typography variant="h6" color="#4A0D23">
          LOGO DA EMPRESA
        </Typography>
      </Box>

      {/* Título do Evento */}
      <Typography variant="h3" gutterBottom sx={{ fontWeight: "bold" }}>
        {event.nome}
      </Typography>
      <Typography variant="h5" color="#FFD700">
        {event.data} - {event.horario_evento}
      </Typography>
      <Typography variant="h6" sx={{ mt: 2 }}>
        Local: {event.endereco}
      </Typography>

      {/* Itens para carregar */}
      <Card sx={{ mt: 4, bgcolor: "#FFD700", color: "#4A0D23" }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Itens para carregar no caminhão:
          </Typography>
          <List>
            {itensRestantes.map((item, index) => (
              <ListItem key={index} divider>
                <ListItemText
                  primary={`${item.quantidade}x ${item.tipo}`}
                  sx={{ fontWeight: "bold" }}
                />
                <Badge
                  color={item.restante > 0 ? "secondary" : "error"}
                  badgeContent={
                    <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                      {item.restante}
                    </Typography>
                  }
                  sx={{
                    ml: 2,
                    "& .MuiBadge-badge": { fontSize: "1.5rem", p: 2 },
                  }}
                />
              </ListItem>
            ))}
          </List>
        </CardContent>
      </Card>
    </Container>
  );
}
