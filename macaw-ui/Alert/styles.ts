import { makeStyles } from "../theme";

const useStyles = makeStyles(
  (theme) => ({
    close: {
      color: theme.palette.common.black,
      position: "absolute",
      right: theme.spacing(-2),
      top: theme.spacing(-1),
    },
    closeNoContent: {
      "&$close": {
        right: theme.spacing(-3),
        top: theme.spacing(-3),
      },
    },
    container: {
      columnGap: theme.spacing(2),
      display: "grid",
      gridTemplateColumns: "40px 1fr",
    },
    content: {
      padding: theme.spacing(0, 1),
    },
    root: {},
    titleBar: {
      marginTop: 6,
      marginBottom: theme.spacing(1),
      position: "relative",
    },
    error: {
      // background: theme.palette.alert.paper.error,
    },
    warning: {
      // background: theme.palette.alert.paper.warning,
    },
    success: {
      // background: theme.palette.alert.paper.success,
    },
  }),
  {
    name: "Alert",
  }
);

export default useStyles;
