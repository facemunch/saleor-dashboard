import { CssBaseline, alpha } from '@mui/material';
import React from "react";

import { makeStyles } from "./styles";

const useStyles = makeStyles(
  (theme) => ({
    "@global": {
      "@import": "url('https://cdnjs.cloudflare.com/ajax/libs/inter-ui/3.19.3/inter.min.css')",

      // For some reason @import clause must be put on top
      // eslint-disable-next-line sort-keys
      "::selection": {
        background: alpha(theme.palette.primary.main, 0.2),
      },
      html: {
        fontSize: "62.5%",
      },
    },
  }),
  { name: "Baseline" }
);

export const Baseline: React.FC = () => {
  useStyles();

  return <CssBaseline />;
};
Baseline.displayName = "Baseline";
