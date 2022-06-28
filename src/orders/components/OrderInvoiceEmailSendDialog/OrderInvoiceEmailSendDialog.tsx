import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from "@mui/material";
import ConfirmButton, {
  ConfirmButtonTransitionState
} from "@saleor/components/ConfirmButton";
import { IonAlert } from "@ionic/react";

import FormSpacer from "@saleor/components/FormSpacer";
import { InvoiceErrorFragment } from "@saleor/fragments/types/InvoiceErrorFragment";
import { InvoiceFragment } from "@saleor/fragments/types/InvoiceFragment";
import { buttonMessages } from "@saleor/intl";
import { DialogProps } from "@saleor/types";
import getInvoiceErrorMessage from "@saleor/utils/errors/invoice";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

export interface OrderInvoiceEmailSendDialogProps extends DialogProps {
  confirmButtonState: ConfirmButtonTransitionState;
  errors: InvoiceErrorFragment[];
  invoice: InvoiceFragment;
  onSend: () => void;
}

const OrderInvoiceEmailSendDialog: React.FC<OrderInvoiceEmailSendDialogProps> = ({
  confirmButtonState,
  errors,
  open,
  invoice,
  onClose,
  onSend
}) => {
  const intl = useIntl();
  console.log("invoice", invoice);
  return (
    <IonAlert
      isOpen={open}
      cssClass="my-custom-class"
      header={intl.formatMessage({
        defaultMessage: "Send Invoice",
        description: "dialog header"
      })}
      message={"Are you sure you want to send this invoice: {invoiceNumber} to the customer?".replace(
        "{invoiceNumber}",
        invoice?.number
      )}
      buttons={[
        {
          text: "Cancel",
          role: "cancel",
          cssClass: "secondary",
          id: "cancel-button",
          handler: onClose
        },
        {
          text: "Send",

          id: "confirm-button",
          handler: () => {
            onSend();
          }
        }
      ]}
    />

    // <Dialog onClose={onClose} open={open} fullWidth maxWidth="xs">
    //   <DialogTitle>
    //     {}
    //   </DialogTitle>
    //   <DialogContent>
    //     <DialogContentText>
    //       <FormattedMessage
    //         defaultMessage="Are you sure you want to send this invoice: {invoiceNumber} to the customer?"
    //         values={{
    //           invoiceNumber: <strong>{invoice?.number}</strong>
    //         }}
    //       />
    //     </DialogContentText>
    //     {errors.length > 0 && (
    //       <>
    //         <FormSpacer />
    //         {errors.map((err, idx) => (
    //           <DialogContentText key={idx} color="error">
    //             {getInvoiceErrorMessage(err, intl)}
    //           </DialogContentText>
    //         ))}
    //       </>
    //     )}
    //   </DialogContent>
    //   <DialogActions>
    //     <Button onClick={onClose}>
    //       <FormattedMessage {...buttonMessages.back} />
    //     </Button>
    //     <ConfirmButton
    //       transitionState={confirmButtonState}
    //       color="primary"
    //       variant="contained"
    //       onClick={onSend}
    //     >
    //       <FormattedMessage {...buttonMessages.send} />
    //     </ConfirmButton>
    //   </DialogActions>
    // </Dialog>
  );
};
OrderInvoiceEmailSendDialog.displayName = "OrderInvoiceEmailSendDialog";
export default OrderInvoiceEmailSendDialog;
