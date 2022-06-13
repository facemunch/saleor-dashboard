import { createTheme as createMuiTheme, alpha } from "@mui/material/styles";

import { overrides } from "./overrides";
import { createPalette } from "./palette";
import { shadows } from "./shadows";
import { SaleorTheme, SaleorThemeColors } from "./types";

export const ICONBUTTON_SIZE = 48;

const fontFamily = '"Inter", "Roboto", "sans-serif"';

export const createTheme = (colors: SaleorThemeColors): SaleorTheme =>
  (createMuiTheme({
    components: {
      ...overrides(colors, fontFamily),
      MuiCard: {
        defaultProps: {
          elevation: 0,
        },
        styleOverrides: {
          root: {
            borderColor: colors.paperBorder,
            borderRadius: 8,
            borderStyle: "solid",
            borderWidth: 1,
            overflow: "visible",
          },
        }
      },
      MuiCardActions: {
        styleOverrides: {
          root: {
            flexDirection: "row-reverse" as "row-reverse",
          },
        }
      },
      MuiCardContent: {
        styleOverrides: {
          root: {
            padding: "2.4rem",
          },
        }
      },
      MuiCardHeader: {
        styleOverrides: {
          action: {
            position: "relative",
            top: 4,
          },
          root: {
            padding: "1.6rem 2.4rem",
          },
        }
      },
      MuiChip: {
        styleOverrides: {
          avatar: {
            fontSize: "1.2rem",
            height: 32,
            left: -5,
            position: "relative",
            width: 32,
          },
          root: {
            "& $avatar": {
              fontSize: "1.2rem",
            },
            fontSize: "1.3rem",
          },
        }
      },
      MuiDialog: {
        styleOverrides: {
          paper: {
            overflowY: undefined,
          },
        }
      },
      MuiDialogActions: {
        styleOverrides: {
          root: {
            borderTop: `1px solid ${colors.divider}`,
            padding: "16px 24px",
          },
        }
      },
      MuiDialogContent: {
        styleOverrides: {
          root: {
            overflowX: undefined,
            overflowY: undefined,
            padding: `24px 0px`,
            margin: `0px 24px`,
          },
        }
      },
      MuiDialogContentText: {
        styleOverrides: {
          root: {
            "&:last-child": {
              marginBottom: 0,
            },
          },
        }
      },
      MuiDialogTitle: {
        styleOverrides: {
          root: {
            borderBottom: `1px solid ${colors.divider}`,
          },
        }
      },
      MuiFormControlLabel: {
        styleOverrides: {
          label: {
            lineHeight: 1.2,
            marginLeft: 4,
          },
        }
      },
      MuiFormLabel: {
        styleOverrides: {
          filled: {
            "&&:not($error)": {
              color: colors.primary,
            },
          },
          root: {
            "&&$focused:not($error)": {
              color: colors.font.gray,
            },
          },
        }
      },
      MuiSvgIcon: {
        styleOverrides: {
          // root: {
          //   fontSize: "2.4rem",
          //   height: "1em",
          //   width: "1em",
          // },
        }
      },
      MuiList: {
        styleOverrides: {
          root: {
            display: "grid",
            gridRowGap: 8 + "px",
            padding: "8px !important",
          },
        }
      },
      MuiListItem: {
        styleOverrides: {
          button: {
            "&:focus": {
              backgroundColor: colors.input.default,
            },
          },
          root: {
            "&$selected": {
              "&:hover": {
                backgroundColor: colors.input.default,
              },
              backgroundColor: colors.input.default,
            },
          },
        }
      },
      MuiMenu: {
        styleOverrides: {
          paper: {
            borderRadius: 8,
          },
        }
      },
      MuiMenuItem: {
        styleOverrides: {
          root: {
            "&$selected, &$selected:focus, &$selected:hover": {
              backgroundColor: [colors.background.default, "!important"] as any,
              color: colors.primary,
              fontWeight: 700,
            },
            "&:hover": {
              backgroundColor: [colors.background.default, "!important"] as any,
              color: colors.font.default,
              fontWeight: 400,
            },
            borderRadius: 4,
          },
        }
      },
      MuiSelect: {
        styleOverrides: {
          root: {
            "&$disabled": {
              backgroundColor: colors.input.disabledBackground,
            },
          },
        }
      },
      MuiSnackbarContent: {
        styleOverrides: {
          action: {
            "& $MuiIconButton": {
              "& svg": {
                color: colors.font.default,
              },
            },
            display: "block",
            paddingBottom: 10,
            paddingLeft: 0,
            paddingRight: 45,
          },
          message: {
            fontSize: 16,
          },
          root: {
            backgroundColor: colors.background.paper,
            boxShadow:
              "0 6px 10px 0px rgba(0, 0, 0, 0.15), 0 1px 18px 0px rgba(0, 0, 0, 0.12), 0 3px 5px -1px rgba(0, 0, 0, 0.10)",
            color: colors.font.default,
            display: "block",
            maxWidth: 480,
          },
        }
      },
      MuiTooltip: {
        defaultProps: {
          placement: "right-end",
        },
        styleOverrides: {
          tooltip: {
            fontSize: "0.8em",
          },
        }
      },
      MuiTouchRipple: {
        styleOverrides: {
          child: {
            backgroundColor: alpha(colors.primary, 0.2),
          },
          childLeaving: {
            backgroundColor: alpha(colors.primary, 0.2),
          },
          ripple: {
            "&$rippleVisible": {
              backgroundColor: alpha(colors.primary, 0.2),
            },
            borderRadius: "100%",
          },
        }
      },
      MuiFormControl: {
        defaultProps: {
          variant: "filled",
        }
      },
      MuiTextField: {
        defaultProps: {
          variant: "outlined",
        }
      },
      MuiTypography: {
        defaultProps: {
          // component: "div", TODO RA MIGRATION
        }
      },
      MuiCheckbox: {
        defaultProps: {
          color: "primary",
        }
      }
    },
    palette: createPalette(colors),
    shadows,
    spacing: (value: number = 1) => `${(value * 8) / 10}rem`,
    typography: {
      allVariants: {
        fontFamily,
      },
      body1: {
        color: colors.font.default,
        fontSize: "1.6rem",
      },
      body2: {
        fontSize: "1.4rem",
      },
      button: {
        fontSize: "1.4rem",
      },
      caption: {
        fontSize: "1.2rem",
      },
      fontFamily,
      h1: {
        fontSize: "4.8rem",
        fontWeight: 700,
      },
      h4: {
        fontSize: "3.4rem",
        color: colors.font.default,
      },
      h5: {
        fontSize: "2.1rem",
        fontWeight: 500,
      },
      h6: {
        fontSize: "2rem",
        fontWeight: 500,
      },
      subtitle1: {
        fontSize: "1.6rem",
      },
      subtitle2: {
        fontSize: "1.4rem",
      },
    },
  }) as unknown) as SaleorTheme;
