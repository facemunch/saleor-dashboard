import {
  IonCardContent,
  IonItem,
  IonLabel,
  IonList,
  IonNote,
  IonRippleEffect
} from "@ionic/react";
import { DateTime } from "@saleor/components/Date";
import Skeleton from "@saleor/components/Skeleton";
import StatusLabel from "@saleor/components/StatusLabel";
import { makeStyles } from "@saleor/macaw-ui";
import {
  maybe,
  transformOrderStatus,
  transformPaymentStatus
} from "@saleor/misc";
import { OrderListUrlSortField } from "@saleor/orders/urls";
import { ListProps, SortPage } from "@saleor/types";
import { Loader } from "frontend/ui/loader";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { OrderList_orders_edges_node } from "../../types/OrderList";

const useStyles = makeStyles(
  theme => {
    const overflowing = {
      overflow: "hidden",
      textOverflow: "ellipsis"
    };

    return {
      [theme.breakpoints.up("lg")]: {
        colCustomer: {
          width: 220
        },
        colDate: {
          marginLeft: "8px"
        },
        colFulfillment: {
          width: 230,
          marginLeft: "12px"
        },
        colNumber: {
          width: 120
        },
        colPayment: {
          width: 220
        },
        colTotal: {
          color: "white"
        }
      },
      colCustomer: overflowing,
      colDate: {
        marginLeft: "8px"
      },
      colFulfillment: { ...overflowing, marginLeft: "12px" },
      colNumber: {},
      colPayment: overflowing,
      colTotal: {
        color: "white",
        textAlign: "right"
      },
      link: {
        cursor: "pointer"
      }
    };
  },
  { name: "OrderList" }
);

const orderDetails = {
  fontFamily: "Inter",
  fontStyle: "normal",
  fontWeight: "400",
  fontSize: "12px",
  lineHeight: "18px",
  color: "#CDCECF",
  display: "flex",
  whiteSpace: "nowrap"
};

const nameStyle = {
  fontFamily: "Inter",
  fontStyle: "normal",
  fontWeight: "400",
  fontSize: "16px",
  lineHeight: "24px",
  display: "flex",
  color: "#FFFFFF",
  textTransform: "capitalize" as TextTransform
};
interface OrderListProps extends ListProps, SortPage<OrderListUrlSortField> {
  orders: OrderList_orders_edges_node[];
}

export const OrderList: React.FC<OrderListProps> = props => {
  const { orders, onRowClick, loading } = props;
  const classes = useStyles(props);

  const intl = useIntl();

  const orderList = orders
    ? orders.map(order => ({
        ...order,
        paymentStatus: transformPaymentStatus(order.paymentStatus, intl),
        status: transformOrderStatus(order.status, intl)
      }))
    : undefined;
  return (
    <IonList style={{ "--ion-item-background": "#313131" }}>
      <div>
        {loading && <Loader />}
        {!loading &&
          orderList &&
          orderList.map(order => (
            <IonItem
              button
              detail={false}
              data-test-id="order-table-row"
              className={!!order ? classes.link : undefined}
              onClick={order ? onRowClick(order.id) : undefined}
              key={order ? order.id : "skeleton"}
            >
              <IonRippleEffect></IonRippleEffect>

              <IonLabel>
                <h4 style={orderDetails}>
                  #{order.number} •
                  <span style={{ marginLeft: "4px" }}>
                    {maybe(() => order.created) ? (
                      <DateTime date={order.created} />
                    ) : (
                      <Skeleton />
                    )}
                  </span>
                </h4>
                <h2 style={nameStyle}>
                  {maybe(() => order.billingAddress) ? (
                    <>
                      {order.billingAddress.firstName}
                      &nbsp;
                      {order.billingAddress.lastName}
                    </>
                  ) : maybe(() => order.userEmail) !== undefined ? (
                    order.userEmail
                  ) : (
                    <Skeleton />
                  )}
                </h2>

                <div className="flex">
                  {maybe(() => order.paymentStatus.status) !== undefined ? (
                    order.paymentStatus.status === null ? null : (
                      <StatusLabel
                        status={order.paymentStatus.status}
                        label={order.paymentStatus.localized}
                      />
                    )
                  ) : (
                    <Skeleton />
                  )}

                  {maybe(() => order.status) ? (
                    <StatusLabel
                      status={order.status.status}
                      label={order.status.localized}
                    />
                  ) : (
                    <Skeleton />
                  )}
                </div>
              </IonLabel>
              <IonNote slot="end">
                <div className={classes.colTotal}>
                  {order?.total ? (
                    <>${order.total.gross.amount}</>
                  ) : (
                    <Skeleton />
                  )}
                </div>
              </IonNote>
            </IonItem>
          ))}
        {!loading && orderList?.length === 0 && (
          <IonCardContent style={{ textAlign: "center" }}>
            <FormattedMessage defaultMessage="No orders found" />
          </IonCardContent>
        )}
      </div>
    </IonList>
  );
};
OrderList.displayName = "OrderList";
export default OrderList;
