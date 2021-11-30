import { Theme } from "@mui/material/styles";

import { useMemo, ReactNode } from "react";
// material
import { CssBaseline } from "@mui/material";
import {
  createTheme,
  ThemeOptions,
  ThemeProvider,
  StyledEngineProvider
} from "@mui/material/styles";
// hooks
//
import shape from "./minimalTheme/shape";
import palette from "./minimalTheme/palette";
import typography from "./minimalTheme/typography";
import breakpoints from "./minimalTheme/breakpoints";
import componentsOverride from "./minimalTheme/overrides";
import shadows, { customShadows } from "./minimalTheme/shadows";

const themeOverrides: Partial<Theme> = {
  ...palette.dark,
  ...shape,
  ...typography,
  ...breakpoints,
  // direction: themeDirection,
  ...shadows.dark,
  ...customShadows.dark,
  components: {
    MuiTableCell: {
      styleOverrides: {
        body: {
          paddingBottom: 8,
          paddingTop: 8
        },
        root: {
          height: 56,
          padding: "4px 24px"
        }
      }
    }
  }
};
export default themeOverrides;

// ----------------------------------------------------------------------

// type ThemeConfigProps = {
//   children: ReactNode;
// };

// export default function ThemeConfig({ children }: ThemeConfigProps) {
//   const themeOptions: ThemeOptions = useMemo(
//     () => ({
//       palette: { ...palette.dark, mode: 'dark' },
//       shape,
//       typography,
//       breakpoints,
//       // direction: themeDirection,
//       shadows: shadows.dark,
//       customShadows: customShadows.dark
//     }),
//     []
//   );

//   const theme = createTheme(themeOptions);
//   theme.components = componentsOverride(theme);

//   return (
//     <StyledEngineProvider injectFirst>
//       <ThemeProvider theme={theme}>
//         <CssBaseline />
//         {children}
//       </ThemeProvider>
//     </StyledEngineProvider>
//   );
// }
