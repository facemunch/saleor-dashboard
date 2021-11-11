import { alpha, ThemeOptions } from "@mui/material";

import { SaleorThemeColors } from "../types";

export const tableOverrides = (
  colors: SaleorThemeColors,
  fontFamily: string
): ThemeOptions["components"] => ({
  MuiTable: {
    styleOverrides:{
      root: {
        fontFamily,
        fontFeatureSettings: '"tnum"',
      },
    }
  },
  MuiTableCell: {
    styleOverrides: {
      body: {
        fontSize: "1rem",
      },
      head: {
        fontSize: "1rem",
        fontWeight: 400,
        color: colors.font.textDisabled,
      },
      paddingCheckbox: {
        "&:first-of-type": {
          padding: "0 12px",
          width: 72,
        },
        "&:not(first-child)": {
          padding: 0,
          width: 52,
        },
      },
      root: {
        "&:first-of-type": {
          "&:not($paddingCheckbox)": {
            paddingLeft: 24 + "px",
            textAlign: "left" as "left",
          },
        },
        borderBottomColor: colors.paperBorder,
        padding: "16px 24px",
      },
    }
  },
  MuiTablePagination: {
    styleOverrides: {
      input: {
        color: colors.primary,
        fontSize: "1rem",
      },
    }
  },
  MuiTableRow: {
    styleOverrides: {
      footer: {
        "$root$hover&:hover": {
          background: "none",
        },
      },
      head: {
        "$root$hover&:hover": {
          background: "none",
        },
      },
      hover: {
        "$root&:hover": {
          backgroundColor: alpha(colors.primary, 0.3),
        },
      },
      root: {
        "&$selected": {
          backgroundColor: alpha(colors.primary, 0.05),
        },
      },
    }
  },
});