import { Drawer, Typography } from "@mui/material";
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
// import MenuIcon from "@mui/icons-material/Menu";
import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";

import clsx from "clsx";
import React, { useEffect } from "react";
import SVG from "react-inlinesvg";
import { BaseSidebarProps, SidebarMenuItem } from "../Sidebar/types";
import { SquareButton } from "../SquareButton";
import { useTheme } from "../theme";
import { MenuItemBtn } from "./MenuItemBtn";
import useStyles from "./styles";
import { withRouter } from 'react-router';

import { useLocation } from 'react-router-dom';

export type SideBarDrawerProps = BaseSidebarProps;
function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
export const SidebarDrawer: React.FC<SideBarDrawerProps> = withRouter((props) => {
  const {
    menuItems,
    onMenuItemClick,
    location
  } = props
  // console.log("props", props)
  const theme = useTheme();
  const [isOpened, setOpened] = React.useState(
    location.pathname === "/ecommerce"
  );
  const classes = useStyles({});
  const [activeMenu, setActiveMenu] = React.useState<SidebarMenuItem | null>(
    null
  );
  const [showSubmenu, setShowSubmenu] = React.useState(false);
  const container = React.useRef<HTMLDivElement>(null);


  useEffect(() => {
    // console.log("props.location.pathname", props.location.pathname)
    // const handleOnUrlChange = (e) => console.log("e handleOnUrlChange", e)
    // window.addEventListener('popstate', handleOnUrlChange, false)
    // sleep(1000).then(() => {
    if (location.pathname === '/ecommerce') {
      setOpened(true)
    } else {
      setOpened(false)
    }
    // })

    // return history.listen((location) => {
    //   console.log(`You changed the page to: ${location.pathname}`)
    // })
    // return window.removeEventListener('popstate', handleOnUrlChange, false)

  }, [location.pathname])

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
            {/* {activeMenu && (
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
            )} */}
          </div>
        </div>
      </Drawer>
    </>
  );
});

SidebarDrawer.displayName = "SideBarDrawer";
