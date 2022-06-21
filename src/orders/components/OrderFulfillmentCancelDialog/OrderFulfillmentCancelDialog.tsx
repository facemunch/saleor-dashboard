import { IonAlert } from "@ionic/react";
import { ConfirmButtonTransitionState } from "@saleor/components/ConfirmButton";
import { OrderErrorFragment } from "@saleor/fragments/types/OrderErrorFragment";
import { WarehouseFragment } from "@saleor/fragments/types/WarehouseFragment";
import React from "react";

export interface OrderFulfillmentCancelDialogFormData {
  warehouseId: string;
}

export interface OrderFulfillmentCancelDialogProps {
  confirmButtonState: ConfirmButtonTransitionState;
  errors: OrderErrorFragment[];
  open: boolean;
  warehouses: WarehouseFragment[];
  onClose();
  onConfirm(data: OrderFulfillmentCancelDialogFormData);
}

const OrderFulfillmentCancelDialog: React.FC<OrderFulfillmentCancelDialogProps> = props => {
  const { open, warehouses, onConfirm, onClose } = props;

  return (
    <IonAlert
      isOpen={open}
      header={"Cancel Fulfillment"}
      message={"Are you sure you want to cancel fulfillment?"}
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
          handler: () => {
            onConfirm({ warehouseId: warehouses[0].id });
          }
        }
      ]}
    />
  );
};
OrderFulfillmentCancelDialog.displayName = "OrderFulfillmentCancelDialog";
export default OrderFulfillmentCancelDialog;
