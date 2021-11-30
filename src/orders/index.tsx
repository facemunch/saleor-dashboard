import { sectionNames } from "@saleor/intl";
import { asSortParams } from "@saleor/utils/sort";
import { parse as parseQs } from "qs";
import React from "react";
import { useIntl } from "react-intl";
import { Route, Routes, useParams } from "react-router-dom";

import { WindowTitle } from "../components/WindowTitle";
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

const OrderList: React.FC = () => {
  const qs = parseQs(location.search.substr(1));
  const params: OrderListUrlQueryParams = asSortParams(
    qs,
    OrderListUrlSortField,
    OrderListUrlSortField.number,
    false
  );
  return <OrderListComponent params={params} />;
};
const OrderDraftList: React.FC = () => {
  const qs = parseQs(location.search.substr(1));
  const params: OrderDraftListUrlQueryParams = asSortParams(
    qs,
    OrderDraftListUrlSortField,
    OrderDraftListUrlSortField.number,
    false
  );

  return <OrderDraftListComponent params={params} />;
};

const OrderDetails: React.FC = () => {
  const qs = parseQs(location.search.substr(1));
  const params: OrderUrlQueryParams = qs;
  const id = useParams().id;

  return <OrderDetailsComponent id={decodeURIComponent(id)} params={params} />;
};

const OrderFulfill: React.FC = () => (
  <OrderFulfillComponent orderId={decodeURIComponent(useParams().id)} />
);

const OrderRefund: React.FC = () => (
  <OrderRefundComponent orderId={decodeURIComponent(useParams().id)} />
);

const OrderReturn: React.FC = () => (
  <OrderReturnComponent orderId={decodeURIComponent(useParams().id)} />
);

const Component = () => {
  const intl = useIntl();

  return (
    <>
      <WindowTitle title={intl.formatMessage(sectionNames.orders)} />
      <Routes>
        <Route path="" element={<OrderList />} />
        <Route path="settings" element={<OrderSettings />} />
        <Route path="drafts" element={<OrderDraftList />} />
        <Route path={orderFulfillPath(":id", "")} element={<OrderFulfill />} />
        <Route path={orderReturnPath(":id", "")} element={<OrderReturn />} />
        <Route path={orderRefundPath(":id", "")} element={<OrderRefund />} />
        <Route path={orderPath(":id", "")} element={<OrderDetails />} />
      </Routes>
    </>
  );
};

export default Component;
