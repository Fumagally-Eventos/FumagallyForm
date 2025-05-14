import * as React from "react";
import { useTheme, styled } from "@mui/material/styles";
import Popper from "@mui/material/Popper";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import SettingsIcon from "@mui/icons-material/Settings";
import CloseIcon from "@mui/icons-material/Close";
import DoneIcon from "@mui/icons-material/Done";
import Autocomplete, {
  AutocompleteCloseReason,
  autocompleteClasses,
} from "@mui/material/Autocomplete";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import ButtonBase from "@mui/material/ButtonBase";
import InputBase from "@mui/material/InputBase";
import Box from "@mui/material/Box";
import { IconButton, Tooltip } from "@mui/material";
import AddLocationIcon from "@mui/icons-material/AddLocation";
import { TableItem } from "../types";
interface PopperComponentProps {
  anchorEl?: any;
  disablePortal?: boolean;
  open: boolean;
}

const StyledAutocompletePopper = styled("div")(({ theme }) => ({
  [`& .${autocompleteClasses.paper}`]: {
    boxShadow: "none",
    margin: 0,
    color: "inherit",
    fontSize: 13,
    minWidth: "300px",
    maxWidth: "400px",
  },
  [`& .${autocompleteClasses.listbox}`]: {
    padding: 0,
    backgroundColor: "#fff",
    minWidth: "300px",
    maxWidth: "400px",
    ...theme.applyStyles("dark", {
      backgroundColor: "#1c2128",
    }),
    [`& .${autocompleteClasses.option}`]: {
      minHeight: "auto",
      alignItems: "flex-start",
      padding: 8,
      borderBottom: "1px solid #eaecef",
      ...theme.applyStyles("dark", {
        borderBottom: "1px solid #30363d",
      }),
      '&[aria-selected="true"]': {
        backgroundColor: "transparent",
      },
      [`&.${autocompleteClasses.focused}, &.${autocompleteClasses.focused}[aria-selected="true"]`]:
        {
          backgroundColor: theme.palette.action.hover,
        },
    },
  },
  [`&.${autocompleteClasses.popperDisablePortal}`]: {
    position: "relative",
  },
}));

function PopperComponent(props: PopperComponentProps) {
  const { disablePortal, anchorEl, open, ...other } = props;
  return (
    <StyledAutocompletePopper
      {...other}
      style={{
        position: "absolute",
        zIndex: 9999,
        minWidth: "300px",
        maxWidth: "400px",
      }}
    />
  );
}

const StyledPopper = styled(Popper)(({ theme }) => ({
  border: "1px solid #e1e4e8",
  boxShadow: `0 8px 24px ${"rgba(149, 157, 165, 0.2)"}`,
  color: "#24292e",
  backgroundColor: "#fff",
  borderRadius: 6,
  minWidth: "300px",
  maxWidth: "400px",
  zIndex: theme.zIndex.modal,
  fontSize: 13,
  ...theme.applyStyles("dark", {
    border: "1px solid #30363d",
    boxShadow: "0 8px 24px rgb(1, 4, 9)",
    color: "#c9d1d9",
    backgroundColor: "#1c2128",
  }),
}));

const StyledInput = styled(InputBase)(({ theme }) => ({
  padding: 10,
  width: "100%",
  borderBottom: "1px solid #eaecef",
  ...theme.applyStyles("dark", {
    borderBottom: "1px solid #30363d",
  }),
  "& input": {
    borderRadius: 4,
    padding: 8,
    transition: theme.transitions.create(["border-color", "box-shadow"]),
    fontSize: 14,
    backgroundColor: "#fff",
    border: "1px solid #30363d",
    ...theme.applyStyles("dark", {
      backgroundColor: "#0d1117",
      border: "1px solid #eaecef",
    }),
    "&:focus": {
      boxShadow: "0px 0px 0px 3px rgba(3, 102, 214, 0.3)",
      borderColor: "#0366d6",
      ...theme.applyStyles("dark", {
        boxShadow: "0px 0px 0px 3px rgb(12, 45, 107)",
        borderColor: "#388bfd",
      }),
    },
  },
}));

const Button = styled(ButtonBase)(({ theme }) => ({
  fontSize: 13,
  width: "100%",
  textAlign: "left",
  paddingBottom: 8,
  fontWeight: 600,
  color: "#586069",
  ...theme.applyStyles("dark", {
    color: "#8b949e",
  }),
  "&:hover,&:focus": {
    color: "#0366d6",
    ...theme.applyStyles("dark", {
      color: "#58a6ff",
    }),
  },
  "& span": {
    width: "100%",
  },
  "& svg": {
    width: 16,
    height: 16,
  },
}));

interface multiSelectItemLabelType {
  name: string;
  color: string;
  description: string;
  item?: TableItem;
  category?: string;
  subcategory?: boolean;
  parentCategory?: string;
}

// From https://github.com/abdonrd/github-labels
const labels = (tableItem: TableItem[]): multiSelectItemLabelType[] => {
  const options: multiSelectItemLabelType[] = [];

  // Add category headers
  options.push(
    {
      name: "Carregamento",
      color: "#e1e4e8",
      description: "Locais de carregamento",
      category: "header",
    },
    {
      name: "Descarregamento",
      color: "#e1e4e8",
      description: "Locais de descarregamento",
      category: "header",
    },
    {
      name: "Almoço",
      color: "#e1e4e8",
      description: "Opções de almoço",
      category: "header",
    },
    {
      name: "Outros",
      color: "#e1e4e8",
      description: "Outras opções",
      category: "header",
    }
  );

  // Group items by product type for carregamento and descarregamento
  const carregamentoItems: Record<string, TableItem[]> = {};
  const descarregamentoItems: Record<string, TableItem[]> = {};

  tableItem.forEach((item) => {
    if (item.tipo === "Desmontagem" && item.produtos) {
      item.produtos.forEach((prod) => {
        if (!carregamentoItems[prod.tipo]) {
          carregamentoItems[prod.tipo] = [];
        }
        carregamentoItems[prod.tipo].push(item);
      });
    } else if (item.tipo === "Montagem" && item.produtos) {
      item.produtos.forEach((prod) => {
        if (!descarregamentoItems[prod.tipo]) {
          descarregamentoItems[prod.tipo] = [];
        }
        descarregamentoItems[prod.tipo].push(item);
      });
    }
  });

  // Add subcategories for carregamento
  Object.entries(carregamentoItems).forEach(([productType, items]) => {
    options.push({
      name: productType,
      color: "fff",
      description: `Itens de ${productType}`,
      category: "carregamento",
      subcategory: true,
    });
    items.forEach((item) => {
      const produtosInfo =
        item.produtos
          ?.map((prod) => `${prod.quantidade}x ${prod.tipo}`)
          .join(", ") || "";
      options.push({
        name: `${item.nome} (${produtosInfo})`,
        color: "#f7c5c5",
        description: item.endereco,
        item: item,
        category: "carregamento",
        subcategory: false,
        parentCategory: productType,
      });
    });
  });

  // Add subcategories for descarregamento
  Object.entries(descarregamentoItems).forEach(([productType, items]) => {
    options.push({
      name: productType,
      color: "#c8f7c5",
      description: `Itens de ${productType}`,
      category: "descarregamento",
      subcategory: true,
    });
    items.forEach((item) => {
      const produtosInfo =
        item.produtos
          ?.map((prod) => `${prod.quantidade}x ${prod.tipo}`)
          .join(", ") || "";
      options.push({
        name: `${item.nome} (${produtosInfo})`,
        color: "#c8f7c5",
        description: item.endereco,
        item: item,
        category: "descarregamento",
        subcategory: false,
        parentCategory: productType,
      });
    });
  });

  // Add almoço options
  options.push(
    {
      name: "Almocar em casa",
      color: "#0366d6",
      description: "Nada como comida caseira",
      category: "almoco",
    },
    {
      name: "Restaurante local",
      color: "#0366d6",
      description: "Insira o endereço",
      category: "almoco",
    }
  );

  // Add outros option
  options.push({
    name: "Inserir informações",
    color: "#0366d6",
    description: "Adicionar informações personalizadas",
    category: "outros",
  });

  return options;
};

export default function GitHubLabel({
  tableItemList,
}: {
  tableItemList: TableItem[];
}) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [value, setValue] = React.useState<multiSelectItemLabelType[]>([]);
  const [pendingValue, setPendingValue] = React.useState<
    multiSelectItemLabelType[]
  >([]);
  const [expandedCategories, setExpandedCategories] = React.useState<
    Set<string>
  >(new Set());
  const [expandedSubcategories, setExpandedSubcategories] = React.useState<
    Set<string>
  >(new Set());
  const [togleFilterField, setTogleFilterField] =
    React.useState<boolean>(false);
  const [filterText, setFilterText] = React.useState("");
  const theme = useTheme();

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setPendingValue(value);
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setValue(pendingValue);
    if (anchorEl) {
      anchorEl.focus();
    }
    setAnchorEl(null);
  };

  const toggleCategory = (category: string) => {
    setExpandedCategories((prev) => {
      const newSet = new Set<string>();
      // Se a categoria clicada já está aberta, fechamos ela
      if (prev.has(category)) {
        return newSet;
      }
      // Caso contrário, fechamos todas e abrimos apenas a clicada
      newSet.add(category);
      return newSet;
    });
  };

  const toggleSubcategory = (subcategory: string) => {
    setExpandedSubcategories((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(subcategory)) {
        newSet.delete(subcategory);
      } else {
        newSet.add(subcategory);
      }
      return newSet;
    });
  };

  const open = Boolean(anchorEl);
  const id = open ? "github-label" : undefined;

  // Função para verificar se um item está selecionado
  const isOptionSelected = (option: multiSelectItemLabelType) => {
    return value.some((item) => item.name === option.name);
  };

  const options = [...labels(tableItemList)].sort((a, b) => {
    // First sort by category to keep headers at top
    if (a.category === "header" && b.category !== "header") return -1;
    if (a.category !== "header" && b.category === "header") return 1;

    // If same category, sort by selection status and then alphabetically
    if (a.category === b.category) {
      const aSelected = isOptionSelected(a);
      const bSelected = isOptionSelected(b);

      if (aSelected && !bSelected) return -1;
      if (!aSelected && bSelected) return 1;

      return a.name.localeCompare(b.name);
    }

    // If different categories, sort by category name
    return (a.category || "").localeCompare(b.category || "");
  });

  const filteredOptions = React.useMemo(() => {
    if (!filterText) return options;

    const searchText = filterText.toLowerCase();
    return options.filter((option) => {
      // Always show category headers
      if (option.category === "header") return true;

      // For subcategories, check if any of their items match the filter
      if (option.subcategory) {
        const subcategoryItems = options.filter(
          (i) => i.parentCategory === option.name
        );
        return subcategoryItems.some(
          (item) =>
            item.name.toLowerCase().includes(searchText) ||
            item.description.toLowerCase().includes(searchText)
        );
      }

      // For regular items, check if they match the filter
      return (
        option.name.toLowerCase().includes(searchText) ||
        option.description.toLowerCase().includes(searchText)
      );
    });
  }, [options, filterText]);

  // Agrupar opções por categoria
  const groupedOptions = filteredOptions.reduce((acc, option) => {
    if (option.category === "header") {
      acc[option.name.toLowerCase()] = {
        header: option,
        items: [],
      };
    } else if (option.category) {
      const categoryKey = option.category.toLowerCase();
      if (acc[categoryKey]) {
        acc[categoryKey].items.push(option);
      }
    }
    return acc;
  }, {} as Record<string, { header: multiSelectItemLabelType; items: multiSelectItemLabelType[] }>);

  return (
    <React.Fragment>
      {/* <Tooltip
        title={
          value.length > 0
            ? value.map((label) => label.name).join(", ")
            : "Adicionar paradas"
        }
      >
        <IconButton onClick={handleClick} loading={false}>
          <AddLocationIcon color="primary" />
        </IconButton>
      </Tooltip> */}

      <StyledPopper
        id={id}
        open={open}
        anchorEl={anchorEl}
        placement="bottom-start"
        disablePortal={false}
        container={document.body}
        style={{
          zIndex: 9997,
        }}
      >
        <ClickAwayListener onClickAway={handleClose}>
          <div>
            <Box
              sx={(t) => ({
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                borderBottom: "1px solid #30363d",
                padding: "8px 10px",
                fontWeight: 600,
                ...t.applyStyles("light", {
                  borderBottom: "1px solid #eaecef",
                }),
              })}
            >
              selecione locais de parada
              <IconButton
                aria-label="filter"
                size="small"
                onClick={() => setTogleFilterField(!togleFilterField)}
              >
                <FilterAltIcon />
              </IconButton>
            </Box>
            <Autocomplete
              open
              multiple
              onClose={(
                event: React.ChangeEvent<object>,
                reason: AutocompleteCloseReason
              ) => {
                if (reason === "escape") {
                  handleClose();
                }
              }}
              value={pendingValue}
              onChange={(event, newValue, reason) => {
                if (
                  event.type === "keydown" &&
                  ((event as React.KeyboardEvent).key === "Backspace" ||
                    (event as React.KeyboardEvent).key === "Delete") &&
                  reason === "removeOption"
                ) {
                  return;
                }
                setPendingValue(newValue);
              }}
              disableCloseOnSelect
              noOptionsText="No labels"
              renderOption={(props, option, { selected }) => {
                const { key, ...optionProps } = props;

                // If it's a category header
                if (option.category === "header") {
                  const categoryKey = option.name.toLowerCase();
                  const categoryItems =
                    groupedOptions[categoryKey]?.items || [];
                  const isExpanded = expandedCategories.has(categoryKey);

                  if (categoryItems.length === 0) return null;

                  return (
                    <React.Fragment key={key}>
                      <li
                        {...optionProps}
                        onClick={() => toggleCategory(categoryKey)}
                        style={{
                          cursor: "pointer",
                          fontWeight: "bold",
                          backgroundColor: theme.palette.action.hover,
                          padding: "8px",
                          borderBottom: "1px solid #eaecef",
                          width: "100%",
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <Box
                          component="span"
                          sx={{
                            width: 14,
                            height: 14,
                            flexShrink: 0,
                            borderRadius: "3px",
                            mr: 1,
                            mt: "2px",
                          }}
                          style={{ backgroundColor: option.color }}
                        />
                        <Box sx={{ flexGrow: 1 }}>{option.name}</Box>
                        <Box component="span" sx={{ ml: 1 }}>
                          {isExpanded ? "▼" : "▶"}
                        </Box>
                      </li>
                      {isExpanded &&
                        categoryItems.map((item) => {
                          // If it's a subcategory header
                          if (item.subcategory) {
                            const subcategoryItems = categoryItems.filter(
                              (i) => i.parentCategory === item.name
                            );
                            const isSubcategoryExpanded =
                              expandedSubcategories.has(item.name);

                            return (
                              <React.Fragment key={item.name}>
                                <li
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toggleSubcategory(item.name);
                                  }}
                                  style={{
                                    cursor: "pointer",
                                    fontWeight: "bold",
                                    backgroundColor: theme.palette.action.hover,
                                    padding: "8px",
                                    paddingLeft: "24px",
                                    borderBottom: "1px solid #eaecef",
                                    width: "100%",
                                    display: "flex",
                                    alignItems: "center",
                                  }}
                                >
                                  <Box
                                    component="span"
                                    sx={{
                                      width: 14,
                                      height: 14,
                                      flexShrink: 0,
                                      borderRadius: "3px",
                                      mr: 1,
                                      mt: "2px",
                                    }}
                                    style={{ backgroundColor: item.color }}
                                  />
                                  <Box sx={{ flexGrow: 1 }}>{item.name}</Box>
                                  <Box component="span" sx={{ ml: 1 }}>
                                    {isSubcategoryExpanded ? "▼" : "▶"}
                                  </Box>
                                </li>
                                {isSubcategoryExpanded &&
                                  subcategoryItems.map((subItem) => {
                                    const isItemSelected = pendingValue.some(
                                      (selectedItem) =>
                                        selectedItem.name === subItem.name
                                    );
                                    return (
                                      <li
                                        key={subItem.name}
                                        onClick={(event) => {
                                          event.stopPropagation();
                                          const newValue = isItemSelected
                                            ? pendingValue.filter(
                                                (selectedItem) =>
                                                  selectedItem.name !==
                                                  subItem.name
                                              )
                                            : [...pendingValue, subItem];
                                          setPendingValue(newValue);
                                        }}
                                        style={{
                                          width: "100%",
                                          display: "flex",
                                          alignItems: "flex-start",
                                          padding: "8px",
                                          paddingLeft: "40px",
                                          cursor: "pointer",
                                        }}
                                      >
                                        <Box
                                          component={DoneIcon}
                                          sx={{
                                            width: 17,
                                            height: 17,
                                            mr: "5px",
                                            ml: "-2px",
                                            flexShrink: 0,
                                          }}
                                          style={{
                                            visibility: isItemSelected
                                              ? "visible"
                                              : "hidden",
                                          }}
                                        />
                                        <Box
                                          component="span"
                                          sx={{
                                            width: 14,
                                            height: 14,
                                            flexShrink: 0,
                                            borderRadius: "3px",
                                            mr: 1,
                                            mt: "2px",
                                          }}
                                          style={{
                                            backgroundColor: subItem.color,
                                          }}
                                        />
                                        <Box
                                          sx={(t) => ({
                                            flexGrow: 1,
                                            width: "100%",
                                            "& span": {
                                              color: "#8b949e",
                                              ...t.applyStyles("light", {
                                                color: "#586069",
                                              }),
                                            },
                                          })}
                                        >
                                          <Box sx={{ fontWeight: 500 }}>
                                            {subItem.name}
                                          </Box>
                                          <Box
                                            component="span"
                                            sx={{
                                              fontSize: "0.875rem",
                                              color: "grey",
                                            }}
                                          >
                                            {subItem.description}
                                          </Box>
                                        </Box>
                                        <Box
                                          component={CloseIcon}
                                          sx={{
                                            opacity: 0.6,
                                            width: 18,
                                            height: 18,
                                            flexShrink: 0,
                                          }}
                                          style={{
                                            visibility: isItemSelected
                                              ? "visible"
                                              : "hidden",
                                          }}
                                        />
                                      </li>
                                    );
                                  })}
                              </React.Fragment>
                            );
                          }

                          // If it's a regular item (not a subcategory)
                          if (!item.subcategory && !item.parentCategory) {
                            const isItemSelected = pendingValue.some(
                              (selectedItem) => selectedItem.name === item.name
                            );
                            return (
                              <li
                                key={item.name}
                                onClick={(event) => {
                                  event.stopPropagation();
                                  const newValue = isItemSelected
                                    ? pendingValue.filter(
                                        (selectedItem) =>
                                          selectedItem.name !== item.name
                                      )
                                    : [...pendingValue, item];
                                  setPendingValue(newValue);
                                }}
                                style={{
                                  width: "100%",
                                  display: "flex",
                                  alignItems: "flex-start",
                                  padding: "8px",
                                  paddingLeft: "24px",
                                  cursor: "pointer",
                                }}
                              >
                                <Box
                                  component={DoneIcon}
                                  sx={{
                                    width: 17,
                                    height: 17,
                                    mr: "5px",
                                    ml: "-2px",
                                    flexShrink: 0,
                                  }}
                                  style={{
                                    visibility: isItemSelected
                                      ? "visible"
                                      : "hidden",
                                  }}
                                />
                                <Box
                                  component="span"
                                  sx={{
                                    width: 14,
                                    height: 14,
                                    flexShrink: 0,
                                    borderRadius: "3px",
                                    mr: 1,
                                    mt: "2px",
                                  }}
                                  style={{ backgroundColor: item.color }}
                                />
                                <Box
                                  sx={(t) => ({
                                    flexGrow: 1,
                                    width: "100%",
                                    "& span": {
                                      color: "#8b949e",
                                      ...t.applyStyles("light", {
                                        color: "#586069",
                                      }),
                                    },
                                  })}
                                >
                                  <Box sx={{ fontWeight: 500 }}>
                                    {item.name}
                                  </Box>
                                  <Box
                                    component="span"
                                    sx={{ fontSize: "0.875rem", color: "grey" }}
                                  >
                                    {item.description}
                                  </Box>
                                </Box>
                                <Box
                                  component={CloseIcon}
                                  sx={{
                                    opacity: 0.6,
                                    width: 18,
                                    height: 18,
                                    flexShrink: 0,
                                  }}
                                  style={{
                                    visibility: isItemSelected
                                      ? "visible"
                                      : "hidden",
                                  }}
                                />
                              </li>
                            );
                          }

                          return null;
                        })}
                    </React.Fragment>
                  );
                }

                return null;
              }}
              options={filteredOptions}
              getOptionLabel={(option) => option.name}
              isOptionEqualToValue={(option, value) =>
                option.name === value.name
              }
              renderInput={(params) => (
                <StyledInput
                  ref={params.InputProps.ref}
                  inputProps={{
                    ...params.inputProps,
                    value: filterText,
                    onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                      setFilterText(e.target.value);
                    },
                  }}
                  sx={{ display: togleFilterField ? "block" : "none" }}
                  autoFocus
                  placeholder="Filtrar opções"
                />
              )}
              slots={{
                popper: PopperComponent,
              }}
            />
          </div>
        </ClickAwayListener>
      </StyledPopper>
    </React.Fragment>
  );
}
