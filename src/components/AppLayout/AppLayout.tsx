import { LinearProgress, useMediaQuery, Box } from "@mui/material";
import useAppState from "@saleor/hooks/useAppState";
import useNavigator from "@saleor/hooks/useNavigator";
import useUser from "@saleor/hooks/useUser";
import Portal from "@mui/material/Portal";

import {
  makeStyles,
  SaleorTheme,
  Sidebar,
  SidebarDrawer,
  // useBacklink,
  useActionBar
  // useTheme
} from "@saleor/macaw-ui";
// import { isDarkTheme } from "@saleor/misc";
import classNames from "classnames";
import React from "react";
import { useIntl } from "react-intl";
import { useLocation } from "react-router-dom";

import Container from "../Container";
import ErrorPage from "../ErrorPage";
import Navigator from "../Navigator";
import NavigatorButton from "../NavigatorButton/NavigatorButton";
// import UserChip from "../UserChip";
// import useAppChannel from "./AppChannelContext";
// import AppChannelSelect from "./AppChannelSelect";
import { appLoaderHeight } from "./consts";
import createMenuStructure from "./menuStructure";
import { isMenuActive } from "./utils";

const useStyles = makeStyles(
  theme => ({
    appAction: {
      [theme.breakpoints.down("sm")]: {
        left: 0,
        width: "100%"
      },
      bottom: 0,
      gridColumn: 2,
      position: "fixed",
      zIndex: 100000
    },
    appActionDocked: {
      bottom: "env(safe-area-inset-bottom, 10px)",
      zIndex: 10000,
      position: "fixed"
    },
    appLoader: {
      // height: appLoaderHeight,
      // marginBottom: theme.spacing(4),
      // zIndex: 1201
    },
    appLoaderPlaceholder: {
      // height: appLoaderHeight,
      // marginBottom: theme.spacing(4)
    },

    content: {
      flex: 1
    },
    darkThemeSwitch: {
      [theme.breakpoints.down("sm")]: {
        marginRight: theme.spacing(1)
      },
      marginRight: theme.spacing(2)
    },
    header: {
      // position: "absolute",
      zIndex: "5",
      // height: "53px",
      // width: "100%",
      // left: "0",

      display: "grid",
      gridTemplateAreas: `"headerAnchor headerToolbar"`,
      [theme.breakpoints.down("sm")]: {
        gridTemplateAreas: `"headerToolbar" 
        "headerAnchor"`
      }
      // marginBottom: theme.spacing(3)
    },
    headerAnchor: {
      gridArea: "headerAnchor"
    },
    headerToolbar: {
      zIndex: 2,
      background:
        "linear-gradient( 0deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.1) 31.25%, rgba(0, 0, 0, 0.9) 72.92%, #000000 100%) !important",
      display: "flex",
      gridArea: "headerToolbar",
      marginLeft: "0px",
      height: 40,
      position: "fixed",
      width: "100vw",
      top: "0px",
      paddingTop: "8px",
      paddingLeft: "1vw",
      paddingRight: "4vw",
      left: 0,
      [theme.breakpoints.down("sm")]: {
        height: "auto"
      }
    },
    root: {
      // [theme.breakpoints.up("md")]: {
      // display: "flex"
      // }
      // width: `100%`
    },
    spacer: {
      flex: 1
    },
    userBar: {
      alignItems: "center",
      display: "flex"
    },

    view: {
      padding: 16,
      // padding: 2,
      flex: 1,
      flexGrow: 1,
      marginLeft: 0,
      // paddingBottom: theme.spacing(),
      paddingBottom: "6em",
      [theme.breakpoints.up("sm")]: {
        paddingBottom: theme.spacing(3)
      }
    },
    viewContainer: {
      paddingTop: "60px",
      WebkitOverflowScrolling: "touch",
      marginBottom: "13vh",
      overflowY: "hidden",
      overflowX: "hidden"
      // WebkitOverflowScrolling: "touch"
      // minHeight: `calc(var(--vh) * 100)`,
      // marginTop: "-30px"
    }
  }),
  {
    name: "AppLayout"
  }
);

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const classes = useStyles({});
  // const { themeType, setTheme } = useTheme();
  const { anchor: appActionAnchor, docked } = useActionBar();
  const { logout, user } = useUser();
  const navigate = useNavigator();
  const intl = useIntl();
  const [appState, dispatchAppState] = useAppState();
  const location = useLocation();
  const [isNavigatorVisible, setNavigatorVisibility] = React.useState(false);
  const isMdUp = useMediaQuery((theme: SaleorTheme) =>
    theme.breakpoints.up("md")
  );

  const menuStructure = createMenuStructure(intl, user).map(e => {
    if (e.children) {
      return e.children
    } else {
      return e
    }
  }).flat();
  // const activeMenu = menuStructure.find(menuItem =>
  //   isMenuActive(location.pathname, menuItem)
  // )?.id;
  console.log("menuStructure", menuStructure)
  const handleErrorBack = () => {
    navigate("/");
    dispatchAppState({
      payload: {
        error: null
      },
      type: "displayError"
    });
  };

  // const toggleTheme = () => setTheme(isDarkTheme(themeType) ? "light" : "dark");

  return (
    <>
      <Navigator
        visible={isNavigatorVisible}
        setVisibility={setNavigatorVisibility}
      />
      <div className={classes.root} data-test="ecomm-app-layout">
        {/* {isMdUp && (
          <Sidebar
            active={activeMenu}
            menuItems={menuStructure}
            onMenuItemClick={navigate}
          />
        )} */}
        <div className={classes.content}>
          {appState.loading ? (
            <Box sx={{ position: "fixed", top: 0 }}>
              <LinearProgress className={classes.appLoader} color="primary" />
            </Box>
          ) : (
            <div className={classes.appLoaderPlaceholder} />
          )}
          <div className={classes.viewContainer}>
            <div>
              <Container>
                <div className={classes.header}>
                  {/* //hidden for mobile views, might be good for desktop */}
                  {/* <div className={classes.headerAnchor} ref={appHeaderAnchor} /> */}
                  <div className={classes.headerToolbar}>
                    {!isMdUp && (
                      <SidebarDrawer
                        menuItems={menuStructure}
                        onMenuItemClick={navigate}
                      />
                    )}
                    <div className={classes.spacer} />
                    <div className={classes.userBar}>
                      <NavigatorButton
                        isMac={navigator.platform.toLowerCase().includes("mac")}
                        onClick={() => setNavigatorVisibility(true)}
                      />
                    </div>
                  </div>
                </div>
              </Container>
            </div>
            {/* <main className={classes.view}> */}
            {appState.error
              ? appState.error.type === "unhandled" && (
                <ErrorPage id={appState.error.id} onBack={handleErrorBack} />
              )
              : children}
            {/* </main> */}
          </div>
          <Portal>
            <div
              className={classNames(classes.appAction, {
                [classes.appActionDocked]: docked
              })}
              ref={appActionAnchor}
            />
          </Portal>
        </div>
      </div>
    </>
  );
};

export default AppLayout;
