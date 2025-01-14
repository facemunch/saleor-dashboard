import { TypeBackground } from "@mui/material/styles/createPalette";
import { SaleorPaletteOptions, SaleorThemeColors } from "./types";

export const createPalette = (
  colors: SaleorThemeColors
): SaleorPaletteOptions => {
  return {
    action: {
      active: colors.checkbox.default
    },
    alert: colors.alert,
    background: "#22262C" as Partial<TypeBackground>,
    divider: colors.divider,
    error: {
      main: colors.error
    },
    primary: {
      contrastText: "#ffffff",
      dark: colors.font.textDisabled,
      main: "#b8a7fd"
    },
    secondary: {
      contrastText: "#ffffff",
      main: colors.secondary
    },
    success: {
      main: colors.success
    },
    text: {
      disabled: colors.font.gray,
      primary: colors.font.default,
      secondary: colors.font.gray
    },
    textHighlighted: {
      active: colors.primary,
      inactive: colors.highlightInactive.default
    },
    mode: colors.theme
  };
};
