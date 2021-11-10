import CloseIcon from "@mui/icons-material/Close";
import { Meta, Story } from "@storybook/react";
import React from "react";

import { SquareButton } from "./SquareButton";

export const Default: Story = () => (
  <SquareButton>
    <CloseIcon />
  </SquareButton>
);

export default {
  title: "Square button",
} as Meta;
