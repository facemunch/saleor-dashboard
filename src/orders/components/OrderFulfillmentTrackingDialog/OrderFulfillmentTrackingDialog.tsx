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
  confirmButtonState,
  errors: apiErrors,
  open,
  trackingNumber,
  onConfirm,
  onClose
}) => {
  console.log("confirmButtonState", { confirmButtonState, apiErrors });
  return (
    <IonAlert
      isOpen={open}
      // onDidDismiss={() => setShowAlert4(false)}
      cssClass="my-custom-class"
      header={"Add Tracking Code"}
      inputs={[
        {
          name: "trackingNumber",
          type: "text",
          value: String(trackingNumber),
          placeholder: "Placeholder 1"
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
