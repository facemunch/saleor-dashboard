import { IonAlert } from "@ionic/react";
import { ConfirmButtonTransitionState } from "@saleor/components/ConfirmButton";
import { OrderErrorFragment } from "@saleor/fragments/types/OrderErrorFragment";
import React from "react";

export interface FormData {
  trackingNumber: string;
}

export interface OrderFulfillmentTrackingDialogProps {
  confirmButtonState: ConfirmButtonTransitionState;
  errors: OrderErrorFragment[];
  open: boolean;
  trackingNumber: string;
  onClose();
  onConfirm(data: FormData);
}

const OrderFulfillmentTrackingDialog: React.FC<OrderFulfillmentTrackingDialogProps> = ({
  open,
  trackingNumber,
  onConfirm,
  onClose
}) => {
  return (
    <IonAlert
      isOpen={open}
      header={"Add Tracking Code"}
      inputs={[
        {
          name: "trackingNumber",
          type: "text",
          value: String(trackingNumber),
          placeholder: "Tracking number"
        }
      ]}
      buttons={[
        {
          text: "Cancel",
          role: "cancel",
          cssClass: "secondary",
          handler: () => {
            onClose();
          }
        },
        {
          text: "Ok",
          handler: ({ trackingNumber }) => {
            onConfirm({ trackingNumber });
          }
        }
      ]}
    />
  );
};
OrderFulfillmentTrackingDialog.displayName = "OrderFulfillmentTrackingDialog";
export default OrderFulfillmentTrackingDialog;
