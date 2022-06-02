import { makeStyles } from "../theme";

const useStyles = makeStyles(
  theme => ({
    activeMenuLabel: {
      display: "flex"
    },
    container: {
      width: "100%"
    },
    containerSubMenu: {
      "&$container": {
        overflow: "hidden"
      }
    },
    content: {
      textAlign: "left",
      display: "flex",
      flexDirection: "column",
      flexDirection: "column",
      height: "61vh",
      justifyContent: "space-between",
      padding: "28px"
    },
    icon: {
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
      fontSize: "2rem !important",
      fontWeight: "800!important",
      "> p": {
        fontSize: "2rem !important",
        fontWeight: "bold"
      }
    },
    logo: {
      display: "block",
      marginBottom: theme.spacing(4)
    },
    menuItemBtn: {
      textAlign: "left"
    },
    root: {
      fontWeight: "bold",
      fontSize: "2rem",
      margin: "12px !important"
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
