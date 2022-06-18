import { IonAlert } from "@ionic/react";
import { DialogProps } from "@saleor/types";
import React from "react";

import { ConfirmButtonTransitionState } from "../ConfirmButton";
import { ActionDialogVariant, Size } from "./types";
import { useIntl } from "react-intl";

export interface ActionDialogProps extends DialogProps {
  children?: React.ReactNode;
  confirmButtonLabel?: string;
  confirmButtonState: ConfirmButtonTransitionState;
  disabled?: boolean;
  maxWidth?: Size | false;
  title: string;
  message?: string;
  variant?: ActionDialogVariant;
  onConfirm();
}

const ActionDialog: React.FC<ActionDialogProps> = props => {
  const {
    message,
    children,
    open,
    title,
    onClose,
    variant,
    maxWidth,
    ...rest
  } = props;
  const intl = useIntl();

  return (
    <>
  
      <IonAlert
        isOpen={open}
        cssClass="my-custom-class"
        header={title}
        message={message}
        buttons={[
          {
            text: "Cancel",
            role: "cancel",
            cssClass: "secondary",
            id: "cancel-button",
            handler: onClose
          },
          {
            text: variant === "delete" ? "Delete" : "Confirm",
            role: variant === "delete" ? "destructive" : "",
            

            id: "confirm-button",
            handler: () => {
              rest.onConfirm();
              console.log("Confirm Okay");
            }
          }
        ]}
      />
    </>
  );
};

ActionDialog.defaultProps = {
  maxWidth: "xs"
};

ActionDialog.displayName = "ActionDialog";
export default ActionDialog;
