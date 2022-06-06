import { Drawer } from "@mui/material";
import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import clsx from "clsx";
import React, { useEffect, useMemo } from "react";
import { BaseSidebarProps, SidebarMenuItem } from "../Sidebar/types";
import { SquareButton } from "../SquareButton";
import { MenuItemBtn } from "./MenuItemBtn";
import useStyles from "./styles";
import { useHistory, useLocation } from "react-router-dom";

import { IonSegment } from "@ionic/react";

export type SideBarDrawerProps = BaseSidebarProps;

export const SidebarDrawer: React.FC<SideBarDrawerProps> = props => {
  const { menuItems, onMenuItemClick } = props;
  let { pathname } = useLocation();
  const history = useHistory();
  const nav = history.push
  const [isOpened, setOpened] = React.useState(pathname === "/ecommerce");
  const classes = useStyles({});

  const [showSubmenu, setShowSubmenu] = React.useState(false);
  const container = React.useRef<HTMLDivElement>(null);

  const handleMenuItemClick = (url: string) => {
    setOpened(false);
    setShowSubmenu(false);
    nav(url);
    onMenuItemClick(url);
  };

  const handleMenuItemWithChildrenClick = (menuItem: SidebarMenuItem) => {
    setShowSubmenu(true);
    container.current?.scrollTo({
      top: 0
    });
  };

  return (
    <>
      <div
        className={clsx(classes.container, {
          [classes.containerSubMenu]: showSubmenu
        })}
        ref={container}
      >
        <IonSegment
          scrollable
          value={pathname.split("/")[1] ? pathname.split("/")[1] : "home"}
        >
          {menuItems.map(menuItem => (
            <MenuItemBtn
              menuItem={menuItem}
              onClick={
                menuItem.children
                  ? () => handleMenuItemWithChildrenClick(menuItem)
                  : handleMenuItemClick
              }
              key={menuItem.ariaLabel}
            />
          ))}
        </IonSegment>
      </div>
    </>
  );
};

SidebarDrawer.displayName = "SideBarDrawer";
