import { createSvgIcon } from "@mui/material";
import React from "react";

export const CheckboxIndeterminateIcon = createSvgIcon(
  <>
    <rect
      x="5"
      y="5"
      width="14"
      height="14"
      stroke="currentColor"
      fill="none"
    />
    <rect x="8" y="11" width="8" height="2" fill="currentColor" />
  </>,
  "CheckboxIndeterminateIcon"
);
