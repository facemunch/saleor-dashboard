import { alpha, ThemeOptions } from "@mui/material";

import { SaleorThemeColors } from "../types";

export const tableOverrides = (
  colors: SaleorThemeColors,
  fontFamily: string
): ThemeOptions["components"] => ({
  MuiTable: {
    styleOverrides: {
      root: {
        fontFamily,
        fontFeatureSettings: '"tnum"'
      }
    }
  },
  MuiTableCell: {
    styleOverrides: {
      body: {
        fontSize: "1em"
      },
      head: {
        fontSize: "1em",
        fontWeight: 400,
        color: colors.font.textDisabled
      },
      paddingCheckbox: {
        "&:first-of-type": {
          padding: "0 12px",
          width: 72
        },
        "&:not(first-child)": {
          padding: 0,
          width: 52
        }
      },
      root: {
        "&:first-of-type": {
          "&:not($paddingCheckbox)": {
            paddingLeft: 12 + "px",
            textAlign: "left" as "left"
          }
        },
        borderBottomColor: colors.paperBorder
        // padding: "0px !important",
      }
    }
  },
  MuiTablePagination: {
    styleOverrides: {
      input: {
        color: colors.primary,
        fontSize: "1em"
      }
    }
  },
  MuiTableRow: {
    styleOverrides: {
      footer: {
        "$root$hover&:hover": {
          background: "none"
        }
      },
      head: {
        "$root$hover&:hover": {
          background: "none"
        }
      },
      hover: {
        "$root&:hover": {
          backgroundColor: alpha(colors.primary, 0.3)
        }
      },
      root: {
        "&$selected": {
          backgroundColor: alpha(colors.primary, 0.05)
        }
      }
    }
  }
});
