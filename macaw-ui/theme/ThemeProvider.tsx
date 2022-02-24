import type { Theme } from "@mui/material";
import {
  ThemeProvider as MuiThemeProvider,
  StyledEngineProvider,
  useTheme,
  // adaptV4Theme,
} from "@mui/material/styles";
import { merge } from "lodash";
import React, { useEffect } from "react";

import { ActionBarProvider } from "../ActionBar/context";
import { BacklinkProvider } from "../Backlink/context";
import {
  ExtensionMessageType,
  sendMessageToExtension,
  ThemeChangeMessage
} from "../extensions";
import { localStorageKeys } from "../localStorageKeys";
import useLocalStorage from "../tools/useLocalStorage";
import { ThemeContext } from "./context";
import { createTheme, Themes, ThemeType } from "./createSaleorTheme";
import { dark, light } from "./themes";
import { changeColorMeta } from "./utils";



declare module '@mui/styles/defaultTheme' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface DefaultTheme extends Theme { }
}



declare module '@mui/styles/defaultTheme' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface DefaultTheme extends Theme { }
}


export interface ThemeProviderProps {
  defaultTheme?: ThemeType;
  /**
   * Passing an object here will result in losing visual consistency with
   * Saleor's Dashboard. Use with caution.
   */
  palettes?: Partial<Themes>;
  /**
   * Passing an object here will result in losing visual consistency with
   * Saleor's Dashboard. Use with caution.
   */
  overrides?: Partial<Theme>;
}
export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
  defaultTheme = "dark",
  palettes = {},
  overrides = {}
}) => {
  const { value: themeTypeName, setValue: setThemeType } = useLocalStorage(
    localStorageKeys.theme,
    defaultTheme
  );
  const themeType = themeTypeName as ThemeType;
  const themes = {
    light,
    dark,
    ...palettes
  };
  console.log("defaultTheme", { defaultTheme, themes })
  const theme = merge(createTheme(themes[defaultTheme]), useTheme(), overrides);
  // const theme = useTheme();

  const sendThemeToExtension = () => { };
  sendMessageToExtension<ThemeChangeMessage>(
    {
      theme: themeType,
      type: ExtensionMessageType.THEME
    },
    "*"
  );

  useEffect(() => {
    sendThemeToExtension();
    changeColorMeta(theme.palette.background.default);
  }, [themeType]);

  return (
    <ThemeContext.Provider
      value={{
        themeType: defaultTheme,
        sendThemeToExtension,
        setTheme: setThemeType
      }}
    >
      <StyledEngineProvider injectFirst>
        <MuiThemeProvider theme={theme}>
          <ActionBarProvider>
            <BacklinkProvider>
              {/* <Baseline /> */}
              {children}
            </BacklinkProvider>
          </ActionBarProvider>
        </MuiThemeProvider>
      </StyledEngineProvider>
    </ThemeContext.Provider>
  );
};
