import { Typography, TypographyProps } from "@mui/material";
import { makeStyles } from "@saleor/macaw-ui";
import HorizontalSpacer from "@saleor/apps/components/HorizontalSpacer";
import React from "react";

export interface IMoney {
  amount: number;
  currency: string;
}

export interface MoneyProps extends TypographyProps {
  money: IMoney | null;
}

const useStyles = makeStyles(
  () => ({
    container: {
      display: "flex",
      alignItems: "baseline",
      justifyContent: "end"
    }
  }),
  { name: "Money" }
);

export const Money: React.FC<MoneyProps> = ({ money }) => {
  const classes = useStyles({});

  if (!money) {
    return null;
  }

  return (
    <div className={classes.container}>
      <HorizontalSpacer spacing={0.5} />${money.amount.toFixed(2)}
    </div>
  );
};

Money.displayName = "Money";
export default Money;
