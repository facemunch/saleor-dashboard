import { SaleorPaletteOptions, SaleorThemeColors } from "./types";

export const createPalette = (
  colors: SaleorThemeColors
): SaleorPaletteOptions => {
  console.log("colors", colors);
  return {
    action: {
      active: colors.checkbox.default
    },
    alert: colors.alert,
    background: "#22262C",
    divider: colors.divider,
    error: {
      main: colors.error
    },
    primary: {
      contrastText: "#ffffff",
      dark: colors.font.textDisabled,
      main: colors.primary
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
