import { alpha, darken, ThemeOptions } from "@mui/material";
import { SaleorThemeColors } from "../types";

export const buttonOverrides = (
  colors: SaleorThemeColors
): ThemeOptions["components"] => ({
  MuiButton: {
    styleOverrides: {
      contained: {
        "&$disabled": {
          backgroundColor: alpha(colors.primary, 0.12),
          color: "#FFFFFF"
        },
        "&:active": {
          boxShadow: "none"
        },
        "&:hover": {
          boxShadow: "none"
        },
        boxShadow: "none"
      },
      containedPrimary: {
        backgroundColor: "yellow !important",

        "&:active": {
          backgroundColor: darken(colors.primary, 0.4)
        },
        "&:hover": {
          backgroundColor: darken(colors.primary, 0.1)
        }
      },
      // TODO RA MIGRATION
      label: {
        fontWeight: "600"
      },
      root: {
        "& svg": {
          marginLeft: 8
        },
        borderRadius: 4
      },
      textPrimary: {
        "&:not($disabled) span": {
          color: colors.primary
        }
      },
      textSizeSmall: {
        fontSize: "1.3rem"
      }
    }
  },
  MuiIconButton: {
    styleOverrides: {
      root: {
        "&:hover": {
          backgroundColor: alpha(colors.primary, 0.12)
        }
      }
    }
  },
  MuiSwitch: {
    styleOverrides: {
      colorPrimary: {
        "&$checked": {
          color: "#b8a7fd"
        }
      },
      root: {
        "&$disabled": {
          "&$switchBase": {
            "& + $thumb": {
              backgroundColor: colors.gray.disabled
            }
          }
        },
        height: 48,
        width: 72
      },
      switchBase: {
        "&$checked": {
          transform: "translateX(23px)"
        },
        boxShadow: "none",
        left: 1,
        marginLeft: 4,
        top: 5
      },
      thumb: {
        boxShadow: "none"
      },
      track: {
        "$colorPrimary$checked + &": {
          backgroundColor: colors.primary
        },
        backgroundColor: colors.gray.default,
        borderRadius: 12,
        height: 24,
        opacity: [["1"], "!important"] as any,
        width: 48
      }
    }
  }
});
