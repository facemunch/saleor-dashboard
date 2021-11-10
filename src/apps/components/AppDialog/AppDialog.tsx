import {
  Dialog,
  DialogContent,
  DialogProps,
  DialogTitle,
  IconButton,
  Typography
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import React from "react";

import { useStyles } from "./styles";

interface AppDialogProps extends DialogProps {
  onClose: () => void;
}

export const AppDialog: React.FC<AppDialogProps> = ({ children, ...props }) => {
  const classes = useStyles();

  return (
    <Dialog aria-labelledby="extension app dialog" {...props}>
      <DialogTitle className={classes.header}>
        <Typography variant="h6" component="h2">
          {props.title}
        </Typography>
        <IconButton color="inherit" onClick={props.onClose} aria-label="close">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent className={classes.content}>{children}</DialogContent>
    </Dialog>
  );
};

export default AppDialog;
