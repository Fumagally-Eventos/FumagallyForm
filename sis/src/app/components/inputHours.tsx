"use client";
import React from "react";
import { TimeField } from "@mui/x-date-pickers/TimeField";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { styled } from "@mui/material/styles";

const StyledTimeField = styled(TimeField)(({}) => ({
  "& .MuiInputBase-root": {
    width: "60px",
    fontSize: "0.9rem",
    paddingRight: "0px",
    borderRadius: "4px",
    marginRight: "5px",
    marginLeft: "5px",
    fontFamily: "monospace",
    "& input": {
      textAlign: "center",
      padding: 0,
    },
  },
  "& .MuiInputLabel-root": {
    display: "none", // Esconde o label se quiser só o input puro
  },
}));

type Props = {
  onChange: (date: string) => void;
};

export const CustomTimePicker: React.FC<Props> = ({ onChange }) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <StyledTimeField
        format="HH:mm"
        onChange={(newValue) => {
          if (newValue?.isValid()) {
            onChange(
              `${newValue
                .hour()
                .toString()
                .padStart(2, "0")}:${newValue.minute()}`
            );
            // onChange(newValue.hour() * 60 + newValue.minute());
          }
        }}
      />
    </LocalizationProvider>
  );
};
