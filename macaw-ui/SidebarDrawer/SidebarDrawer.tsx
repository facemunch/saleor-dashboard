import { Drawer } from "@mui/material";
import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import clsx from "clsx";
import React, { useEffect } from "react";
import { BaseSidebarProps, SidebarMenuItem } from "../Sidebar/types";
import { SquareButton } from "../SquareButton";
import { MenuItemBtn } from "./MenuItemBtn";
import useStyles from "./styles";
import { useNavigate } from "react-router-dom";

export type SideBarDrawerProps = BaseSidebarProps;

export const SidebarDrawer: React.FC<SideBarDrawerProps> = props => {
  const { menuItems, onMenuItemClick } = props;
  const location = window.location;

  const nav = useNavigate();
  const [isOpened, setOpened] = React.useState(
    location.pathname === "/ecommerce"
  );
  const classes = useStyles({});

  const [showSubmenu, setShowSubmenu] = React.useState(false);
  const container = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (location.pathname === "/ecommerce") {
      setOpened(true);
    } else {
      setOpened(false);
    }
  }, [location.pathname]);

  const handleMenuItemClick = (url: string) => {
    setOpened(false);
    setShowSubmenu(false);
    nav(url);
    onMenuItemClick(url)
  };

  const handleMenuItemWithChildrenClick = (menuItem: SidebarMenuItem) => {
    setShowSubmenu(true);
    container.current?.scrollTo({
      top: 0
    });
  };

  return (
    <>
      <SquareButton onClick={() => setOpened(true)}>
        <ArrowBackIosNewRoundedIcon />
      </SquareButton>
      <Drawer
        classes={{
          paper: classes.root
        }}
        container={document.getElementsByTagName("ion-tabs")[0]}
        sx={{
          " .MuiBackdrop-root ": {
            background: "#0000009e"
          }
        }}
        open={isOpened}
        onClose={() => setOpened(false)}
      >
        <div
          className={clsx(classes.container, {
            [classes.containerSubMenu]: showSubmenu
          })}
          ref={container}
        >
          <div
            className={clsx(classes.innerContainer, {
              [classes.secondaryContentActive]: showSubmenu
            })}
          >
            <div className={classes.content}>
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
            </div>
          </div>
        </div>
      </Drawer>
    </>
  );
};

SidebarDrawer.displayName = "SideBarDrawer";
