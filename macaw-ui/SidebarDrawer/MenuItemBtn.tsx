import { Typography } from "@mui/material";
import React from "react";
import SVG from "react-inlinesvg";
import { IonButton } from "@ionic/react";
import { SidebarMenuItem } from "../Sidebar/types";
import useStyles from "./styles";

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
    <Component
      // expand="block"
      // fill="clear"
      className={classes.menuItemBtn}
      data-test="menu-item-label"
      data-test-id={menuItem.id}
      onClick={() => onClick(menuItem.url!)}
      {...linkProps}
    >
      {menuItem.iconSrc && (
        <SVG className={classes.icon} src={menuItem.iconSrc} />
      )}
      <Typography aria-label={menuItem.ariaLabel} className={classes.label}>
        {menuItem.label}
      </Typography>
    </Component>
  );
};

MenuItemBtn.displayName = "MenuItemBtn";
