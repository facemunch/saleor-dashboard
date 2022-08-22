import CardSpacer from "@saleor/components/CardSpacer";
import Grid from "@saleor/components/Grid";
import { OrderErrorFragment } from "@saleor/fragments/types/OrderErrorFragment";
import { SubmitPromise } from "@saleor/hooks/useForm";
import { Backlink } from "@saleor/macaw-ui";
import { renderCollection } from "@saleor/misc";
import { OrderRefundData_order } from "@saleor/orders/types/OrderRefundData";
import { FulfillmentStatus } from "@saleor/types/globalTypes";
import React, { memo } from "react";
import { useIntl } from "react-intl";
import { chevronBackOutline } from "ionicons/icons";

import {
  IonContent,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonIcon
} from "@ionic/react";

import OrderRefund from "../OrderRefund";
import OrderRefundFulfilledProducts from "../OrderRefundFulfilledProducts";
import OrderRefundAmount from "../OrderRefundReturnAmount";
import {
  getMiscellaneousAmountValues,
  getRefundProductsAmountValues
} from "../OrderRefundReturnAmount/utils";
import OrderRefundUnfulfilledProducts from "../OrderRefundUnfulfilledProducts";
import OrderRefundForm, {
  OrderRefundSubmitData,
  OrderRefundType
} from "./form";

export const refundFulfilledStatuses = [
  FulfillmentStatus.FULFILLED,
  FulfillmentStatus.RETURNED,
  FulfillmentStatus.WAITING_FOR_APPROVAL
];

export interface OrderRefundPageProps {
  order: OrderRefundData_order;
  defaultType?: OrderRefundType;
  disabled: boolean;
  errors: OrderErrorFragment[];
  onBack: () => void;
  onSubmit: (data: OrderRefundSubmitData) => SubmitPromise;
}

const OrderRefundPage: React.FC<OrderRefundPageProps> = props => {
  const {
    order,
    defaultType = OrderRefundType.PRODUCTS,
    disabled,
    errors = [],
    onBack,
    onSubmit
  } = props;

  const intl = useIntl();

  const unfulfilledLines = order?.lines.filter(
    line => line.quantityToFulfill > 0
  );

  const fulfilledFulfillemnts =
    order?.fulfillments.filter(({ status }) =>
      refundFulfilledStatuses.includes(status)
    ) || [];

  return (
    <IonContent>
      <OrderRefundForm
        order={order}
        defaultType={defaultType}
        onSubmit={onSubmit}
      >
        {({ data, handlers, change, submit }) => {
          const isProductRefund = data.type === OrderRefundType.PRODUCTS;

          return (
            <>
              <IonToolbar>
                <IonButtons slot="start">
                  <IonButton onClick={() => onBack()}>
                    <IonIcon icon={chevronBackOutline} />
                  </IonButton>
                </IonButtons>
                <IonTitle>
                  {intl.formatMessage(
                    {
                      defaultMessage: "Order no. {orderNumber} - Refund",
                      description: "page header"
                    },
                    {
                      orderNumber: order?.number
                    }
                  )}
                </IonTitle>

                <Backlink onClick={onBack}>
                  {order?.number
                    ? intl.formatMessage(
                        {
                          defaultMessage: "Order #{orderNumber}",
                          description: "page header with order number"
                        },
                        {
                          orderNumber: order.number
                        }
                      )
                    : intl.formatMessage({
                        defaultMessage: "Order",
                        description: "page header"
                      })}
                </Backlink>
              </IonToolbar>
              <Grid>
                <div>
                  <OrderRefund
                    data={data}
                    disabled={disabled}
                    onChange={change}
                  />
                  {isProductRefund && (
                    <>
                      {unfulfilledLines?.length > 0 && (
                        <>
                          <CardSpacer />
                          <OrderRefundUnfulfilledProducts
                            unfulfilledLines={unfulfilledLines}
                            data={data}
                            disabled={disabled}
                            onRefundedProductQuantityChange={
                              handlers.changeRefundedProductQuantity
                            }
                            onSetMaximalQuantities={
                              handlers.setMaximalRefundedProductQuantities
                            }
                          />
                        </>
                      )}
                      <div
                        // id="hide-isDigitalProduct"
                        // style={{
                          // height: "0",
                          // overflow: "hidden"
                        // }}
                      >
                        {renderCollection(
                          fulfilledFulfillemnts,
                          fulfillment => (
                            <React.Fragment key={fulfillment?.id}>
                              <CardSpacer />
                              <OrderRefundFulfilledProducts
                                fulfillment={fulfillment}
                                data={data}
                                disabled={disabled}
                                orderNumber={order?.number}
                                onRefundedProductQuantityChange={
                                  handlers.changeRefundedFulfilledProductQuantity
                                }
                                onSetMaximalQuantities={() =>
                                  handlers.setMaximalRefundedFulfilledProductQuantities(
                                    fulfillment?.id
                                  )
                                }
                              />
                            </React.Fragment>
                          )
                        )}
                      </div>
                    </>
                  )}
                </div>
                <div>
                  <OrderRefundAmount
                    amountData={
                      isProductRefund
                        ? getRefundProductsAmountValues(order, data)
                        : getMiscellaneousAmountValues(order)
                    }
                    data={data}
                    order={order}
                    disabled={disabled}
                    errors={errors}
                    onChange={change}
                    onRefund={submit}
                  />
                </div>
              </Grid>
              <div style={{ height: "100px" }} />
            </>
          );
        }}
      </OrderRefundForm>
    </IonContent>
  );
};
OrderRefundPage.displayName = "OrderRefundPage";
export default memo(OrderRefundPage);
