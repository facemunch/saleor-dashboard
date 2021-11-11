import { SaleorThemeColors } from "./createSaleorTheme";

export const dark: SaleorThemeColors = {
  alert: {
    paper: {
      error: "#E0444E",
      info: "#2E2F31",
      success: "#5DC292",
      warning: "#b8a7fd36",
    },
    icon: {
      error: "#FE6E76",
      info: "#FAFAFA",
      success: "#5DC292",
      warning: "#b8a7fd",
    },
  },
  highlightInactive: {
    default: "#78797A",
  },
  autofill: "#5D5881",
  background: {
    default: "#1D1E1F",
    paper: "#2E2F31",
  },
  checkbox: {
    default: "#FFFFFF",
  },
  divider: "#252728",
  error: "#C22D74",
  font: {
    button: "#202124",
    default: "#FCFCFC",
    gray: "#9E9D9D",
    textButton: "#FFFFFF",
    textDisabled: "#FCFCFC",
  },
  gray: {
    default: "#202124",
    disabled: "rgba(32, 33, 36, 0.6)",
  },
  input: {
    border: "#9d9d9d",
    default: "#25262A",
    disabled: "#393939",
    disabledBackground: "#292A2D",
    disabledText: "#9D9D9D",
    error: "#8C2054",
    text: "#FCFCFC",
    textHover: "#616161",
  },
  paperBorder: "#252728",
  primary: "#b8a7fd",
  secondary: "#21125E",
  success: "#5DC292",
  theme: "dark",
};
export const light: SaleorThemeColors = {
  alert: {
    paper: {
      error: "#FFD6D9",
      info: "#FFFFFF",
      success: "#DFF3E9",
      warning: "#FFF4E4",
    },
    icon: {
      error: "#FE6E76",
      info: "#28234A",
      success: "#5DC292",
      warning: "#8459f4",
    },
  },
  highlightInactive: {
    default: "#C8C8C8",
  },
  autofill: "#f4f6c5",
  background: {
    default: "#EFF5F8",
    paper: "#FFFFFF",
  },
  checkbox: {
    default: "#616161",
  },
  divider: "#EAEAEA",
  error: "#FE6D76",
  font: {
    button: "#FFFFFF",
    default: "#3D3D3D",
    gray: "#616161",
    textButton: "#06847B",
    textDisabled: "#616161",
  },
  gray: {
    default: "#C8C8C8",
    disabled: "rgba(216, 216, 216, 0.3)",
  },

  input: {
    border: "#BDBDBD",
    default: "#FFFFFF",
    disabled: "#EAEAEA",
    disabledBackground: "#F4F4F4",
    disabledText: "#9D9D9D",
    error: "#8C2054",
    text: "#3D3D3D",
    textHover: "#616161",
  },
  paperBorder: "#EAEAEA",
  primary: "#06847B",
  secondary: "#21125E",
  success: "#5DC292",
  theme: "light",
};
