import { Typography } from "@mui/material";
import React from "react";

export enum LabelSizes {
  sm = 12,
  md = 14
}

interface LabelProps {
  text: string;
  size?: LabelSizes;
}

const Label: React.FC<LabelProps> = ({ text, size = 12 }) => (
  <Typography
    variant="caption"
    color="textSecondary"
    style={{ fontSize: LabelSizes[size] }}
  >
    {text}
  </Typography>
);

export default Label;
