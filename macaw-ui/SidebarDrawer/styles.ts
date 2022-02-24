import { makeStyles } from "../theme";

const useStyles = makeStyles(
  theme => ({
    activeMenuLabel: {
      display: "flex"
    },
    container: {
      // overflowX: "hidden",
      width: "100%"
    },
    containerSubMenu: {
      "&$container": {
        overflow: "hidden"
      }
    },
    content: {
      width: "50%",
      marginTop: "12px",
      display: "flex",
      flexWrap: "wrap",
      justifyContent: "space-between",
      alignContent: "flex-start"
    },
    icon: {
      // marginRight: theme.spacing(2);
      // color: "white";
      color: "#b8a7fd",
      marginRight: "16px",
      position: "absolute",
      marginTop: "-27px",
      marginBottom: "27px"
    },
    innerContainer: {
      display: "flex",
      position: "relative",
      right: 0,
      transition: theme.transitions.duration.short + "ms",
      width: "200%"
    },
    label: {
      fontWeight: "bold",
      "> p": {
        fontWeight: "bold"
      }
    },
    logo: {
      display: "block",
      marginBottom: theme.spacing(4)
    },
    menuItemBtn: {
      border: "none",
      color: theme.palette.text.secondary,
      display: "flex",
      marginBottom: "12px",
      textDecoration: "none",
      width: "46%",
      height: "calc(100vh/8)",
      // marginLeft: "12px",
      borderRadius: "8px",
      padding: "12px",
      alignItems: "flex-end",
      background: "#1f2327",
      fontWeight: "bold"
    },
    root: {
      background: "#000000",
      borderBottomRightRadius: 32,
      height: "auto",
      borderTopRightRadius: 32,
      padding: theme.spacing(3),
      width: 260
    },
    secondaryContentActive: {
      right: "100%"
    },
    subMenuTopBar: {
      alignItems: "center",
      display: "flex",
      justifyContent: "space-between",
      marginBottom: theme.spacing(3)
    }
  }),
  {
    name: "SideBarDrawer"
  }
);

export default useStyles;
