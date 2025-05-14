"use client";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { TableItem } from "../types";

interface GlobalState {
  event: TableItem | null;
  setEvent: (event: TableItem | null) => void;
}

// Criando o contexto
const GlobalContext = createContext<GlobalState | undefined>(undefined);

export const GlobalProvider = ({ children }: { children: ReactNode }) => {
  const [event, setEvent] = useState<TableItem | null>(null);

  // Carrega o estado salvo ao iniciar
  useEffect(() => {
    const savedEvent = localStorage.getItem("event");
    if (savedEvent) {
      try {
        setEvent(JSON.parse(savedEvent)); // Converte a string JSON de volta para objeto
      } catch (error) {
        console.error("Erro ao carregar o estado:", error);
      }
    }
  }, []);

  // Salva o estado sempre que mudar
  useEffect(() => {
    if (event) {
      localStorage.setItem("event", JSON.stringify(event)); // Converte o objeto para string JSON antes de salvar
    } else {
      localStorage.removeItem("event");
    }
  }, [event]);

  return (
    <GlobalContext.Provider value={{ event, setEvent }}>
      {children}
    </GlobalContext.Provider>
  );
};

// Hook para consumir o estado
export const useGlobalState = () => {
  const context = useContext(GlobalContext);
  if (!context) {
    throw new Error(
      "useGlobalState deve ser usado dentro de um GlobalProvider"
    );
  }
  return context;
};
