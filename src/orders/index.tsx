import { asSortParams } from "@saleor/utils/sort";
import { parse as parseQs } from "qs";
import React from "react";
import { useIntl } from "react-intl";
import { Route, Switch, useParams } from "react-router-dom";

// import { WindowTitle } from "..components/WindowTitle";
import {
  OrderDraftListUrlQueryParams,
  OrderDraftListUrlSortField,
  orderFulfillPath,
  OrderListUrlQueryParams,
  OrderListUrlSortField,
  orderPath,
  orderRefundPath,
  orderReturnPath,
  OrderUrlQueryParams
} from "./urls";
import OrderDetailsComponent from "./views/OrderDetails";
import OrderDraftListComponent from "./views/OrderDraftList";
import OrderFulfillComponent from "./views/OrderFulfill";
import OrderListComponent from "./views/OrderList";
import OrderRefundComponent from "./views/OrderRefund";
import OrderReturnComponent from "./views/OrderReturn";
import OrderSettings from "./views/OrderSettings";

export const OrderList: React.FC = () => {
  const qs = parseQs(location.search.substr(1));
  const params: OrderListUrlQueryParams = location.pathname.includes("/orders")
    ? asSortParams(
        qs,
        OrderListUrlSortField,
        OrderListUrlSortField.number,
        false
      )
    : {};
  return <OrderListComponent params={params} />;
};
export const OrderDraftList: React.FC = () => {
  const qs = parseQs(location.search.substr(1));
  const params: OrderDraftListUrlQueryParams = asSortParams(
    qs,
    OrderDraftListUrlSortField,
    OrderDraftListUrlSortField.number,
    false
  );

  return <OrderDraftListComponent params={params} />;
};

export const OrderDetails: React.FC = () => {
  const qs = parseQs(location.search.substr(1));
  const params: OrderUrlQueryParams = qs;
  const id = useParams().id;

  return <OrderDetailsComponent id={decodeURIComponent(id)} params={params} />;
};

export  const OrderFulfill: React.FC = () => (
  <OrderFulfillComponent orderId={decodeURIComponent(useParams().id)} />
);

export const OrderRefund: React.FC = () => (
  <OrderRefundComponent orderId={decodeURIComponent(useParams().id)} />
);

export const OrderReturn: React.FC = () => (
  <OrderReturnComponent orderId={decodeURIComponent(useParams().id)} />
);

const Component = () => {
  const intl = useIntl();

  return (
    <>
      {/* <WindowTitle title={intl.formatMessage(sectionNames.orders)} /> */}
      <Switch>
        <Route exact path="/orders" render={() => <OrderList />} />
        <Route
          exact
          path={"/orders/" + "settings"}
          render={() => <OrderSettings />}
        />
        <Route
          exact
          path={"/orders/" + "drafts"}
          render={() => <OrderDraftList />}
        />
        <Route
          exact
          path={"/orders/" + orderFulfillPath(":id", "")}
          render={() => <OrderFulfill />}
        />
        <Route
          exact
          path={"/orders/" + orderReturnPath(":id", "")}
          render={() => <OrderReturn />}
        />
        <Route
          exact
          path={"/orders/" + orderRefundPath(":id", "")}
          render={() => <OrderRefund />}
        />
        <Route
          exact
          path={"/orders/" + orderPath(":id", "")}
          render={() => <OrderDetails />}
        />
         <Route path="/" render={() => <OrderList />} />
      </Switch>
    </>
  );
};

export default Component;
