import { asSortParams } from "@saleor/utils/sort";
import { Loader } from "frontend/ui/loader";
import { parse as parseQs } from "qs";
import React, { lazy, memo, Suspense, useMemo, useRef } from "react";
import { useLocation, useParams } from "react-router-dom";
import {
  OrderListUrlQueryParams,
  OrderListUrlSortField,
  OrderUrlQueryParams
} from "./urls";

// TODO: const OrderSettings = lazy(() => import("./views/OrderSettings"));
const OrderReturnComponent = lazy(() => import("./views/OrderReturn"));
const OrderRefundComponent = lazy(() => import("./views/OrderRefund"));
const OrderFulfillComponent = lazy(() => import("./views/OrderFulfill"));
const OrderDetailsComponent = lazy(() => import("./views/OrderDetails"));
const OrderListComponent = lazy(() => import("./views/OrderList"));

export const OrderList: React.FC = memo(() => {
  const { search } = useLocation();
  const oldQs = useRef();

  const params: OrderListUrlQueryParams = useMemo(() => {
    const qs = parseQs(search.substr(1));

    if (search.length > 0) {
      oldQs.current = asSortParams(
        qs,
        OrderListUrlSortField,
        OrderListUrlSortField.number,
        false
      );
    }

    return oldQs.current;
  }, [search]);

  return (
    <Suspense fallback={<Loader />}>
      <OrderListComponent params={params || {}} />
    </Suspense>
  );
});

export const OrderDetails: React.FC = () => {
  const { search } = useLocation()
  const qs = parseQs(search.substr(1));
  const params: OrderUrlQueryParams = qs;
  const id = useParams().id;

  return (
    <Suspense fallback={<Loader />}>
      <OrderDetailsComponent id={decodeURIComponent(id)} params={params} />;
    </Suspense>
  );
};

export const OrderFulfill: React.FC = () => (
  <Suspense fallback={<Loader />}>
    <OrderFulfillComponent orderId={decodeURIComponent(useParams().id)} />
  </Suspense>
);

export const OrderRefund: React.FC = () => (
  <Suspense fallback={<Loader />}>
    <OrderRefundComponent orderId={decodeURIComponent(useParams().id)} />
  </Suspense>
);

export const OrderReturn: React.FC = () => {
  return (
    <Suspense fallback={<Loader />}>
      <OrderReturnComponent orderId={decodeURIComponent(useParams().id)} />
    </Suspense>
  );
};