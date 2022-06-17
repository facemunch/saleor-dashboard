import { CardContent } from "@mui/material";
import CardTitle from "@saleor/components/CardTitle";
import {
  OrderDiscountContext,
  OrderDiscountContextConsumerProps
} from "@saleor/products/components/OrderDiscountProviders/OrderDiscountProvider";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { IonCard, IonButton } from "@ionic/react";

import { maybe } from "../../../misc";
import { OrderDetails_order } from "../../types/OrderDetails";
import OrderDraftDetailsProducts, {
  FormData as OrderDraftDetailsProductsFormData
} from "../OrderDraftDetailsProducts";
import OrderDraftDetailsSummary from "../OrderDraftDetailsSummary";

interface OrderDraftDetailsProps {
  order: OrderDetails_order;
  onOrderLineAdd: () => void;
  onOrderLineChange: (
    id: string,
    data: OrderDraftDetailsProductsFormData
  ) => void;
  onOrderLineRemove: (id: string) => void;
  onShippingMethodEdit: () => void;
}

const OrderDraftDetails: React.FC<OrderDraftDetailsProps> = ({
  order,
  onOrderLineAdd,
  onOrderLineChange,
  onOrderLineRemove,
  onShippingMethodEdit
}) => {
  const intl = useIntl();

  return (
    <IonCard>
      <CardTitle
        title={intl.formatMessage({
          defaultMessage: "Order Details",
          description: "section header"
        })}
        toolbar={
          order?.channel.isActive && (
            <IonButton
              color="primary"
              size="small"
              onClick={onOrderLineAdd}
              data-test-id="add-products-button"
            >
              <FormattedMessage
                defaultMessage="Add products"
                description="button"
              />
            </IonButton>
          )
        }
      />
      <OrderDraftDetailsProducts
        lines={maybe(() => order.lines)}
        onOrderLineChange={onOrderLineChange}
        onOrderLineRemove={onOrderLineRemove}
      />
      {maybe(() => order.lines.length) !== 0 && (
        <CardContent>
          <OrderDiscountContext.Consumer>
            {(orderDiscountProps: OrderDiscountContextConsumerProps) => (
              <OrderDraftDetailsSummary
                order={order}
                onShippingMethodEdit={onShippingMethodEdit}
                {...orderDiscountProps}
              />
            )}
          </OrderDiscountContext.Consumer>
        </CardContent>
      )}
    </IonCard>
  );
};
OrderDraftDetails.displayName = "OrderDraftDetails";
export default OrderDraftDetails;
