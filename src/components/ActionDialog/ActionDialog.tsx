import { Dialog, DialogContent, DialogTitle } from "@mui/material";
import { DialogProps } from "@saleor/types";
import React from "react";

import { ConfirmButtonTransitionState } from "../ConfirmButton";
import DialogButtons from "./DialogButtons";
import { ActionDialogVariant, Size } from "./types";

export interface ActionDialogProps extends DialogProps {
  children?: React.ReactNode;
  confirmButtonLabel?: string;
  confirmButtonState: ConfirmButtonTransitionState;
  disabled?: boolean;
  maxWidth?: Size | false;
  title: string;
  variant?: ActionDialogVariant;
  onConfirm();
}

const ActionDialog: React.FC<ActionDialogProps> = props => {
  const { children, open, title, onClose, variant, maxWidth, ...rest } = props;
  // return null;
  return (
    <Dialog fullWidth onClose={onClose} open={open} maxWidth={maxWidth}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>{children}</DialogContent>
      <DialogButtons {...rest} onClose={onClose} variant={variant} />
    </Dialog>
  );
};

ActionDialog.defaultProps = {
  maxWidth: "xs"
};

ActionDialog.displayName = "ActionDialog";
export default ActionDialog;
