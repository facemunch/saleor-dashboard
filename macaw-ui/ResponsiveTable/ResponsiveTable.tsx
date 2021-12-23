import { Table } from "@mui/material";
import React from "react";

import useStyles from "./styles";

interface ResponsiveTableProps {
  children: React.ReactNode | React.ReactNodeArray;
  className?: string;
  key?: string;
}

export const ResponsiveTable: React.FC<ResponsiveTableProps> = props => {
  const { children, className } = props;

  const classes = useStyles(props);

  return (
    <div className={classes.root}>
      <div
        className="scrim"
        style={{
          background:
            "linear-gradient(-90deg, rgb(34 38 43 / 0%) 0%, rgb(34 38 43 / 23%) 31.25%, rgb(34 38 43) 72.92%, #22262b 100%)",
          position: "absolute",
          height: "100%",
          width: "10px",
          zIndex: 1
        }}
      ></div>
      <div
        className="scrim"
        style={{
          background:
            "linear-gradient(90deg, rgb(34 38 43 / 0%) 0%, rgb(34 38 43 / 23%) 31.25%, rgb(34 38 43) 72.92%, #22262b 100%)",
          position: "absolute",
          height: "100%",
          width: "10px",
          right: "0",
          zIndex: 1
        }}
      ></div>
      <Table className={className}>{children}</Table>
    </div>
  );
};

ResponsiveTable.displayName = "ResponsiveTable";
