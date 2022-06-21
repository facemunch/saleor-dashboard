import { ConfirmButtonTransitionState } from "@saleor/components/ConfirmButton";
import { ShopOrderSettingsFragment } from "@saleor/fragments/types/ShopOrderSettingsFragment";
import { WarehouseFragment } from "@saleor/fragments/types/WarehouseFragment";
import { FormsetData } from "@saleor/hooks/useFormset";
import { FulfillOrder_orderFulfill_errors } from "@saleor/orders/types/FulfillOrder";
import { OrderFulfillData_order } from "@saleor/orders/types/OrderFulfillData";
import { OrderFulfillStockInput } from "@saleor/types/globalTypes";
import React from "react";

import { IonAlert } from "@ionic/react";

interface OrderFulfillFormData {
  sendInfo: boolean;
}
interface OrderFulfillSubmitData extends OrderFulfillFormData {
  items: FormsetData<null, OrderFulfillStockInput[]>;
}
export interface OrderFulfillPageProps {
  loading: boolean;
  errors: FulfillOrder_orderFulfill_errors[];
  order: OrderFulfillData_order;
  saveButtonBar: ConfirmButtonTransitionState;
  warehouses: WarehouseFragment[];
  shopSettings?: ShopOrderSettingsFragment;
  onBack: () => void;
  onSubmit: (data: OrderFulfillSubmitData) => void;
}

const OrderFulfillPage: React.FC<OrderFulfillPageProps> = props => {
  const { loading, order, warehouses, onBack, onSubmit } = props;



  const handleSubmitAlert = ({ sendEmail = false }) => {
    const objectToSave = {
      sendInfo: sendEmail,
      items: order?.lines.map(line => {
        return {
          data: null,
          id: line.id,
          label: "",
          value: [
            {
              quantity: line.quantityToFulfill,
              warehouse: warehouses[0].id
            }
          ]
        };
      })
    };
    return onSubmit(objectToSave);
  };

  return (
    <>
      <IonAlert
        isOpen={!loading}
        header={"Confirm Order"}
        message={
          "Please confirm if you want to send an email to the buyer, to let them know the good news."
        }
        buttons={[
          {
            text: "Cancel",
            role: "cancel",
            cssClass: "secondary",
            handler: onBack
          },
          {
            text: "Confirm",
            handler: () => {
              handleSubmitAlert({ sendEmail: false });
            }
          },
          {
            role: "default",
            text: "Confirm and email buyer",
            handler: () => {
              handleSubmitAlert({ sendEmail: true });
            }
          }
        ]}
      />
    </>
  );
};

OrderFulfillPage.displayName = "OrderFulfillPage";
export default OrderFulfillPage;
