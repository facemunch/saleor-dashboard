import { ConfirmButtonTransitionState } from "@saleor/components/ConfirmButton";
import { IonAlert } from "@ionic/react";

import { InvoiceErrorFragment } from "@saleor/fragments/types/InvoiceErrorFragment";
import { InvoiceFragment } from "@saleor/fragments/types/InvoiceFragment";
import { DialogProps } from "@saleor/types";
import React from "react";
import { useIntl } from "react-intl";

export interface OrderInvoiceEmailSendDialogProps extends DialogProps {
  confirmButtonState: ConfirmButtonTransitionState;
  errors: InvoiceErrorFragment[];
  invoice: InvoiceFragment;
  onSend: () => void;
}

const OrderInvoiceEmailSendDialog: React.FC<OrderInvoiceEmailSendDialogProps> = ({
  open,
  invoice,
  onClose,
  onSend
}) => {
  const intl = useIntl();
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
  );
};
OrderInvoiceEmailSendDialog.displayName = "OrderInvoiceEmailSendDialog";
export default OrderInvoiceEmailSendDialog;
