import {
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableRow
} from "@mui/material";
import { DateTime } from "@saleor/components/Date";
import Money from "@saleor/components/Money";
import ResponsiveTable from "@saleor/components/ResponsiveTable";
import Skeleton from "@saleor/components/Skeleton";
import StatusLabel from "@saleor/components/StatusLabel";
import TableCellHeader from "@saleor/components/TableCellHeader";
import TablePagination from "@saleor/components/TablePagination";
import { makeStyles } from "@saleor/macaw-ui";
import {
  maybe,
  renderCollection,
  transformOrderStatus,
  transformPaymentStatus
} from "@saleor/misc";
import { OrderListUrlSortField } from "@saleor/orders/urls";
import { ListProps, SortPage } from "@saleor/types";
import { getArrowDirection } from "@saleor/utils/sort";
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
        colDate: {},
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
        colTotal: {}
      },
      colCustomer: overflowing,
      colDate: {},
      colFulfillment: { ...overflowing, marginLeft: "12px" },
      colNumber: {},
      colPayment: overflowing,
      colTotal: {
        textAlign: "right"
      },
      link: {
        cursor: "pointer"
      }
    };
  },
  { name: "OrderList" }
);

interface OrderListProps extends ListProps, SortPage<OrderListUrlSortField> {
  orders: OrderList_orders_edges_node[];
}

const numberOfColumns = 6;

export const OrderList: React.FC<OrderListProps> = props => {
  const {
    disabled,
    settings,
    orders,
    pageInfo,
    onPreviousPage,
    onNextPage,
    onUpdateListSettings,
    onRowClick,
    onSort,
    sort
  } = props;
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
    <ResponsiveTable>
      <TableHead>
        <TableRow>
          {/* <TableCellHeader
            direction={
              sort.sort === OrderListUrlSortField.number
                ? getArrowDirection(sort.asc)
                : undefined
            }
            arrowPosition="right"
            onClick={() => onSort(OrderListUrlSortField.number)}
            className={classes.colNumber}
          >
            <FormattedMessage defaultMessage="No. of Order" />
          </TableCellHeader> */}
          {/* <TableCellHeader
            direction={
              sort.sort === OrderListUrlSortField.date
                ? getArrowDirection(sort.asc)
                : undefined
            }
            onClick={() => onSort(OrderListUrlSortField.date)}
            className={classes.colDate}
          >
            <FormattedMessage
              defaultMessage="Date"
              description="date when order was placed"
            />
          </TableCellHeader> */}
          <TableCellHeader
            direction={
              sort.sort === OrderListUrlSortField.customer
                ? getArrowDirection(sort.asc)
                : undefined
            }
            onClick={() => onSort(OrderListUrlSortField.customer)}
            className={classes.colCustomer + ' ml-1'}
          >
            <FormattedMessage
              defaultMessage="Customer"
              description="e-mail or full name"
            />
          </TableCellHeader>
          {/* <TableCellHeader
            direction={
              sort.sort === OrderListUrlSortField.payment
                ? getArrowDirection(sort.asc)
                : undefined
            }
            onClick={() => onSort(OrderListUrlSortField.payment)}
            className={classes.colPayment}
          >
            <FormattedMessage
              defaultMessage="Payment"
              description="payment status"
            />
          </TableCellHeader> */}
          {/* <TableCellHeader
            direction={
              sort.sort === OrderListUrlSortField.fulfillment
                ? getArrowDirection(sort.asc)
                : undefined
            }
            onClick={() => onSort(OrderListUrlSortField.fulfillment)}
            className={classes.colFulfillment}
          >
            <FormattedMessage defaultMessage="Fulfillment status" />
          </TableCellHeader> */}
          <TableCellHeader textAlign="right" className={classes.colTotal}>
            <FormattedMessage
              defaultMessage="Total"
              description="total order price"
            />
          </TableCellHeader>
        </TableRow>
      </TableHead>
      <TableFooter>
        <TableRow>
          <TablePagination
            colSpan={numberOfColumns}
            settings={settings}
            hasNextPage={pageInfo && !disabled ? pageInfo.hasNextPage : false}
            onNextPage={onNextPage}
            onUpdateListSettings={onUpdateListSettings}
            hasPreviousPage={
              pageInfo && !disabled ? pageInfo.hasPreviousPage : false
            }
            onPreviousPage={onPreviousPage}
          />
        </TableRow>
      </TableFooter>
      <TableBody>
        {renderCollection(
          orderList,
          order => (
            <TableRow
              data-test-id="order-table-row"
              hover={!!order}
              className={!!order ? classes.link : undefined}
              onClick={order ? onRowClick(order.id) : undefined}
              key={order ? order.id : "skeleton"}
            >
              <TableCell>
                <div className="flex">
                  <div className={classes.colNumber}>
                    {maybe(() => order.number) ? (
                      "#" + order.number
                    ) : (
                      <Skeleton />
                    )}
                  </div>
                  •
                  <div className={classes.colDate}>
                    {maybe(() => order.created) ? (
                      <DateTime date={order.created} />
                    ) : (
                      <Skeleton />
                    )}
                  </div>
                </div>

                <div className={classes.colCustomer}>
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
                </div>
                <div className="flex">
                  <div className={classes.colPayment}>
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
                  </div>
                  <div className={classes.colFulfillment}>
                    {maybe(() => order.status) ? (
                      <StatusLabel
                        status={order.status.status}
                        label={order.status.localized}
                      />
                    ) : (
                      <Skeleton />
                    )}
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className={classes.colTotal}>
                  {maybe(() => order.total.gross) ? (
                    <Money money={order.total.gross} />
                  ) : (
                    <Skeleton />
                  )}
                </div>
              </TableCell>
            </TableRow>
          ),
          () => (
            <TableRow>
              <TableCell colSpan={numberOfColumns}>
                <FormattedMessage defaultMessage="No orders found" />
              </TableCell>
            </TableRow>
          )
        )}
      </TableBody>
    </ResponsiveTable>
  );
};
OrderList.displayName = "OrderList";
export default OrderList;
