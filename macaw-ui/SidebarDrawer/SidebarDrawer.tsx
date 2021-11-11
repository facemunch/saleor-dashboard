import { Drawer, Typography } from "@mui/material";
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import MenuIcon from "@mui/icons-material/Menu";
import clsx from "clsx";
import React from "react";
import SVG from "react-inlinesvg";
import { BaseSidebarProps, SidebarMenuItem } from "../Sidebar/types";
import { SquareButton } from "../SquareButton";
import { useTheme } from "../theme";
import { MenuItemBtn } from "./MenuItemBtn";
import useStyles from "./styles";

export type SideBarDrawerProps = BaseSidebarProps;

export const SidebarDrawer: React.FC<SideBarDrawerProps> = ({
  menuItems,
  onMenuItemClick
}) => {
  const theme = useTheme();
  const [isOpened, setOpened] = React.useState(false);
  const classes = useStyles({});
  const [activeMenu, setActiveMenu] = React.useState<SidebarMenuItem | null>(
    null
  );
  const [showSubmenu, setShowSubmenu] = React.useState(false);
  const container = React.useRef<HTMLDivElement>(null);

  const handleMenuItemClick = (url: string) => {
    setOpened(false);
    setShowSubmenu(false);
    onMenuItemClick(url);
  };

  const handleMenuItemWithChildrenClick = (menuItem: SidebarMenuItem) => {
    setActiveMenu(menuItem);
    setShowSubmenu(true);
    container.current?.scrollTo({
      top: 0
    });
  };

  return (
    <>
      <SquareButton onClick={() => setOpened(true)}>
        <MenuIcon />
      </SquareButton>
      <Drawer
        classes={{
          paper: classes.root
        }}
        sx={{
          " .MuiBackdrop-root ": {
            background: "#1616169e"
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
            {activeMenu && (
              <div className={classes.content}>
                <div className={classes.subMenuTopBar}>
                  <div className={classes.activeMenuLabel}>
                    {activeMenu.iconSrc && (
                      <SVG className={classes.icon} src={activeMenu.iconSrc} />
                    )}
                    <Typography className={classes.label}>
                      {activeMenu.label}
                    </Typography>
                  </div>
                  <SquareButton onClick={() => setShowSubmenu(false)}>
                    <ArrowLeftIcon />
                  </SquareButton>
                </div>
                {activeMenu.children?.map(subMenuItem => (
                  <MenuItemBtn
                    menuItem={subMenuItem}
                    onClick={handleMenuItemClick}
                    key={subMenuItem.ariaLabel}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </Drawer>
    </>
  );
};

SidebarDrawer.displayName = "SideBarDrawer";
