"use client";
import dynamic from "next/dynamic";
//import TableComponent from "./TableComponent";
import { GlobalProvider } from "./context/GlobalContext";

const TableComponent = dynamic(() => import("./TableComponent"), {
  ssr: false,
});

export default function Home() {
  return (
    <div>
      <GlobalProvider>
        <TableComponent />
      </GlobalProvider>
    </div>
  );
}
