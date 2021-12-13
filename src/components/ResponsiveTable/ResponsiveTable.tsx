import { Table } from "@mui/material";
import { makeStyles } from "@saleor/macaw-ui";
import React from "react";

const useStyles = makeStyles(
  theme => ({
    root: {
      [theme.breakpoints.up("md")]: {
        "&& table": {
          tableLayout: "fixed"
        }
      },
      "& table": {
        tableLayout: "auto",
        width: "92vw"
      },
      overflowX: "auto",
      width: "92vw"
    }
  }),
  {
    name: "ResponsiveTable"
  }
);

interface ResponsiveTableProps {
  children: React.ReactNode | React.ReactNodeArray;
  className?: string;
  key?: string;
}

const ResponsiveTable: React.FC<ResponsiveTableProps> = props => {
  const { children, className } = props;

  const classes = useStyles(props);

  return (
    <div className={classes.root}>
      <Table className={className}>{children}</Table>
    </div>
  );
};

ResponsiveTable.displayName = "ResponsiveTable";
export default ResponsiveTable;
