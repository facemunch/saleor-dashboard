import { Typography } from "@mui/material";
import React from "react";
import SVG from "react-inlinesvg";
import { IonButton } from "@ionic/react";
import { SidebarMenuItem } from "../Sidebar/types";
import useStyles from "./styles";
import { IonSegmentButton, IonLabel } from "@ionic/react";

export interface MenuItemBtnProps {
  menuItem: SidebarMenuItem;
  onClick: (url: string) => void;
}
export const MenuItemBtn: React.FC<MenuItemBtnProps> = ({
  menuItem,
  onClick
}) => {
  const classes = useStyles();
  const linkProps = menuItem.external
    ? { href: menuItem.url, target: "_blank" }
    : {};
  const Component = menuItem.external ? "a" : "button";

  return (
    <IonSegmentButton
      // expand="block"
      // fill="clear"
      value={menuItem.label.toLowerCase()}
      className={classes.menuItemBtn}
      data-test="menu-item-label"
      data-test-id={menuItem.id}
      onClick={() => onClick(menuItem.url!)}
      {...linkProps}
    >
      {menuItem.iconSrc && (
        <SVG className={classes.icon} src={menuItem.iconSrc} />
      )}
      <IonLabel aria-label={menuItem.ariaLabel} className={classes.label}>
        {menuItem.label === "Configuration" ? "Settings" : menuItem.label}
      </IonLabel>
    </IonSegmentButton>
  );
};

MenuItemBtn.displayName = "MenuItemBtn";
