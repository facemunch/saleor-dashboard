import { makeStyles } from "../theme";

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
        width: "96vw"
      },
      overflowX: "auto",
      width: "96vw"
    }
  }),
  {
    name: "ResponsiveTable"
  }
);

export default useStyles;
