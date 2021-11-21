import { useMemo, ReactNode } from 'react';
// material
import { CssBaseline } from '@mui/material';
import {
  createTheme,
  ThemeOptions,
  ThemeProvider,
  StyledEngineProvider
} from '@mui/material/styles';
// hooks
//
import shape from './shape';
import palette from './palette';
import typography from './typography';
import breakpoints from './breakpoints';
import componentsOverride from './overrides';
import shadows, { customShadows } from './shadows';

// ----------------------------------------------------------------------

type ThemeConfigProps = {
  children: ReactNode;
};

export default function ThemeConfig({ children }: ThemeConfigProps) {
  const themeOptions: ThemeOptions = useMemo(
    () => ({
      palette: { ...palette.dark, mode: 'dark' },
      shape,
      typography,
      breakpoints,
      // direction: themeDirection,
      shadows: shadows.dark,
      customShadows: customShadows.dark
    }),
    []
  );

  const theme = createTheme(themeOptions);
  theme.components = componentsOverride(theme);

  return (
    <StyledEngineProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </StyledEngineProvider>
  );
}
