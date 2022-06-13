import { Typography, IconProps } from "@mui/material";
import { User } from "@saleor/fragments/types/User";
import { makeStyles } from "@saleor/macaw-ui";
import React, { memo } from "react";

import { IonContent, IonCard, IonPage, IonCardContent } from "@ionic/react";

import { hasAnyPermissions } from "../auth/misc";
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
        fill: "#ffffff4f"
      },
      fontSize: 38,
      marginRight: "8px"
    },
    sectionDescription: {},
    sectionTitle: {
      fontSize: 20,
      fontWeight: 600 as 600,
      marginTop: "8px !important",
      marginBottom: "-4px !important"
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

  console.log("menus", menus);
  return (
    <IonPage>
      <IonContent data-test-id="commerce-configuration-view">
        <div style={{ height: "50px" }} />
        {menus
          .filter(menu =>
            menu.menuItems.some(menuItem =>
              hasAnyPermissions(menuItem.permissions, user)
            )
          )
          .map((menu, menuIndex) => (
            <IonCard key={menuIndex}>
              {menu.menuItems
                .filter(menuItem =>
                  hasAnyPermissions(menuItem.permissions, user)
                )
                .map((item, itemIndex) => (
                  <IonCardContent
                    onClick={() => onSectionClick(item.url)}
                    key={itemIndex}
                    style={{ display: "flex" }}
                    data-test-id={item.testId}
                  >
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
                  </IonCardContent>
                ))}
            </IonCard>
          ))}
        <div style={{ height: "100px" }} />
      </IonContent>
    </IonPage>
  );
};
ConfigurationPage.displayName = "ConfigurationPage";
export default memo(ConfigurationPage);
