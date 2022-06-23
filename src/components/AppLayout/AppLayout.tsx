import useNavigator from "@saleor/hooks/useNavigator";
import { settingsOutline } from "ionicons/icons";
import { makeStyles, useActionBar } from "@saleor/macaw-ui";
import classNames from "classnames";
import React from "react";
import {
  IonToolbar,
  IonHeader,
  IonIcon,
  IonButton,
  IonButtons,
  IonTitle,
  IonFab
} from "@ionic/react";

import { add } from "ionicons/icons";

const useStyles = makeStyles(
  theme => ({
    appAction: {
      [theme.breakpoints.up("sm")]: {
        left: 0,
        width: "100vw"
      },
      bottom: 0,
      gridColumn: 2,
      position: "fixed",
      zIndex: 100000,
      width: "100vw"
    },
    appActionDocked: {
      bottom: "env(safe-area-inset-bottom, 10px)",
      zIndex: 100000,
      position: "fixed",
      width: "100vw"
    },
    appLoader: {},
    appLoaderPlaceholder: {},

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
      zIndex: "5",

      display: "grid",
      gridTemplateAreas: `"headerAnchor headerToolbar"`
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
      [theme.breakpoints.up("sm")]: {
        paddingBottom: "10vh"
      }
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

      flex: 1,
      flexGrow: 1,
      marginLeft: 0,

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
      overflowX: "hidden",
      [theme.breakpoints.up("md")]: {
        maxWidth: "90vw",
        margin: "auto",
        marginLeft: 125
      }
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
  const { anchor: appActionAnchor, docked } = useActionBar();
  const navigate = useNavigator();

  return (
    <>
      <IonHeader translucent collapse="condense">
        <IonToolbar>
          <IonButtons slot="primary">
            <IonButton
              data-test-id="commerce-configuration-trigger"
              color="dark"
              onClick={() => {
                navigate("/configuration");
              }}
              fill="clear"
            >
              <IonIcon slot="icon-only" icon={settingsOutline} />
            </IonButton>
          </IonButtons>

          <IonTitle
            data-test-id="commerce-title"
            size="large"
            style={{
              marginTop: "8px",
              fontFamily: '"Inter"',
              fontStyle: "normal",
              fontWeight: "900",
              fontSize: "28px",

              letterSpacing: "-0.02em",
              color: "#ffffff",
              opacity: "0.95"
            }}
          >
            Commerce
          </IonTitle>
        </IonToolbar>
      </IonHeader>

      {children}
      <div
        id="action-bar-footer"
        className={classNames(classes.appAction, {
          [classes.appActionDocked]: docked
        })}
        ref={appActionAnchor}
      />

      <IonFab
        vertical="bottom"
        horizontal="end"
        slot="fixed"
        data-test-id="create-order-button"
      >
        <IonButton
          data-test-id="add-product"
          onClick={() => {
            navigate("/products/add");
          }}
          style={{ color: "#101010" }}
          shape="round"
        >
          <IonIcon slot="start" icon={add} />
          New Product
        </IonButton>
      </IonFab>
    </>
  );
};

export default AppLayout;
