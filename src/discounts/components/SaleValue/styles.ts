import { makeStyles } from "@saleor/macaw-ui";

export const useStyles = makeStyles(
  theme => ({
    card: {
      "&:last-child": {
        paddingBottom: 0
      }
    },
    colName: {
      fontSize: 14,
      paddingLeft: 0,
      width: "auto"
    },
    colType: {
      fontSize: 14,
      textAlign: "right",
      width: 235
    },
    info: {
      fontSize: 14
    },
    row: {
      "&:last-child": {
        "& td": {
          borderBottom: "none"
        }
      }
    },
    table: {
      tableLayout: "fixed"
    },
    tableContainer: {
      margin: theme.spacing(0, -2),
      // width: `calc(100% + ${theme.spacing(6)})`
    }
  }),
  {
    name: "SaleValue"
  }
);
