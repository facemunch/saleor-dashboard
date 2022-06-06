import { makeStyles } from "../theme";

const useStyles = makeStyles(
  theme => ({
    root: {
      [theme.breakpoints.up("sm")]: {
        "&& table": {
          tableLayout: "fixed",
          width: "inherit",
        }
      },
      "& table": {
        tableLayout: "auto",
        width: "100%",
        // width: "96vw"
      },
      overflowX: "auto",
      // width: "96vw"
    }
  }),
  {
    name: "ResponsiveTable"
  }
);

export default useStyles;
