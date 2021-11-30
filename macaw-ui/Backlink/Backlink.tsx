import { Portal, Typography, Skeleton } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import React from "react";

import { useBacklink } from "./context";
import useStyles from "./styles";

export interface AppHeaderProps {
  children: React.ReactNode;
  onClick: () => void;
}

export const Backlink: React.FC<AppHeaderProps> = ({ children, onClick }) => {
  const classes = useStyles();
  const anchor = useBacklink();

  if (!anchor.current) {
    return null;
  }

  return (
    <Portal container={anchor.current}>
      <div
        className={classes.root}
        onClick={onClick}
        data-test-id="app-header-back-button"
      >
        <ArrowBackIcon className={classes.backArrow} />
        {children ? (
          <Typography className={classes.title}>{children}</Typography>
        ) : (
          <Skeleton className={classes.skeleton} />
        )}
      </div>
    </Portal>
  );
};
Backlink.displayName = "Backlink";
