import {
  Card,
  CardContent,
  Typography,
  IconProps
  // useMediaQuery
} from "@mui/material";
// import { useTheme } from "@mui/styles";
import { User } from "@saleor/fragments/types/User";
import { sectionNames } from "@saleor/intl";
import { makeStyles } from "@saleor/macaw-ui";
import React from "react";
import { useIntl } from "react-intl";

import { IonContent, IonCard, IonPage } from "@ionic/react";

import { hasAnyPermissions } from "../auth/misc";
import Container from "../components/Container";
import PageHeader from "../components/PageHeader";
import { PermissionEnum } from "../types/globalTypes";

export interface MenuItem {
  description: string;
  icon: React.ReactElement<IconProps>;
  permissions: PermissionEnum[];
  title: string;
  url?: string;
  testId?: string;
}

export interface MenuSection {
  label: string;
  menuItems: MenuItem[];
}

const useStyles = makeStyles(
  theme => ({
    card: {
      "&:hover": {
        boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.15);"
      },
      cursor: "pointer",
      marginBottom: theme.spacing(3),
      transition: theme.transitions.duration.standard + "ms"
    },
    cardContent: {
      // Overrides Material-UI default theme
      // "&:last-child": {
      //   paddingBottom: 16
      // },
      display: "grid",
      gridColumnGap: theme.spacing(4),
      gridTemplateColumns: "48px 1fr"
    },
    cardDisabled: {
      "& $icon, & $sectionTitle, & $sectionDescription": {
        color: theme.palette.text.disabled
      },
      marginBottom: theme.spacing(3)
    },
    configurationCategory: {
      [theme.breakpoints.down("md")]: {
        gridTemplateColumns: "1fr"
      },
      borderTop: `solid 1px ${theme.palette.divider}`,
      display: "grid",
      gridColumnGap: theme.spacing(4),
      gridTemplateColumns: "1fr 3fr",
      paddingTop: theme.spacing(3)
    },
    configurationItem: {
      [theme.breakpoints.down("md")]: {
        gridTemplateColumns: "1fr"
      },
      display: "grid",
      gridColumnGap: theme.spacing(4),
      gridTemplateColumns: "1fr 1fr"
    },
    configurationLabel: {
      paddingBottom: 20
    },
    header: {
      margin: 0
    },
    icon: {
      "& path": {
        // fill: theme.palette.primary.main
      },
      fontSize: 48
    },
    sectionDescription: {},
    sectionTitle: {
      fontSize: 20,
      fontWeight: 600 as 600,
      marginTop: "16px !important"
    }
  }),
  { name: "ConfigurationPage" }
);

export interface ConfigurationPageProps {
  menu: MenuSection[];
  user: User;
  onSectionClick: (sectionName: string) => void;
}

export const ConfigurationPage: React.FC<ConfigurationPageProps> = props => {
  const { menu: menus, user, onSectionClick } = props;
  const classes = useStyles(props);
  // const theme = useTheme();
  // const isSmUp = true; // TODO RA MIGRATION useMediaQuery(theme.breakpoints.up("sm"));

  const intl = useIntl();
  console.log("menus", menus);
  return (
    <IonPage>
      <IonContent>
        {/* <PageHeader
        className={classes.header}
        title={intl.formatMessage(sectionNames.configuration)}
      ></PageHeader> */}
        <div style={{ height: "50px" }} />
        {menus
          .filter(menu =>
            menu.menuItems.some(menuItem =>
              hasAnyPermissions(menuItem.permissions, user)
            )
          )
          .map((menu, menuIndex) => (
            <IonCard className={classes.configurationCategory} key={menuIndex}>
              {/* <div className={classes.configurationLabel}>
                <Typography>{menu.label}</Typography>
              </div> */}
              {/* <div className={classes.configurationItem}> */}
              {menu.menuItems
                .filter(menuItem =>
                  hasAnyPermissions(menuItem.permissions, user)
                )
                .map((item, itemIndex) => (
                  <Card
                    className={item.url ? classes.card : classes.cardDisabled}
                    onClick={() => onSectionClick(item.url)}
                    key={itemIndex}
                    data-test="settingsSubsection"
                    data-testid={item.title.toLowerCase()}
                    data-test-id={item.testId}
                  >
                    <CardContent className={classes.cardContent}>
                      <div className={classes.icon}>{item.icon}</div>
                      <div>
                        <Typography
                          className={classes.sectionTitle}
                          color="primary"
                        >
                          {item.title}
                        </Typography>
                        <Typography
                          variant="caption"
                          className={classes.sectionDescription}
                        >
                          {item.description}
                        </Typography>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              {/* </div> */}
            </IonCard>
          ))}
        <div style={{ height: "100px" }} />
      </IonContent>
    </IonPage>
  );
};
ConfigurationPage.displayName = "ConfigurationPage";
export default ConfigurationPage;
