import { IonModal, IonContent } from "@ionic/react";
import { asSortParams } from "@saleor/utils/sort";
import { Loader } from "frontend/ui/loader";
import { orderReturnPath } from "../orders/urls";

import OrderListComponent from "./views/OrderList";
import OrderDetailsComponent from "./views/OrderDetails";
import OrderReturnComponent from "./views/OrderReturn";

import { parse as parseQs } from "qs";
import React, { lazy, Suspense, useMemo, useRef } from "react";
import { Route, useHistory, useLocation, useParams } from "react-router-dom";
import {
  orderFulfillPath,
  OrderListUrlQueryParams,
  OrderListUrlSortField,
  OrderUrlQueryParams
} from "./urls";

// TODO: const OrderSettings = lazy(() => import("./views/OrderSettings"));
const OrderRefundComponent = lazy(() => import("./views/OrderRefund"));
const OrderFulfillComponent = lazy(() => import("./views/OrderFulfill"));

export const OrderList: React.FC = () => {
  const { search, pathname } = useLocation();
  const oldQs = useRef();

  const params: OrderListUrlQueryParams = useMemo(() => {
    if (!pathname.includes("orders")) {
      return;
    }
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
  }, [search, pathname]);

  return (
    <Suspense fallback={<Loader />}>
      <OrderListComponent params={params || {}} />
    </Suspense>
  );
};

export const OrderDetails = ({ orderModalRef }) => {
  const { pathname, search } = useLocation();

  const qs = parseQs(search.substr(1));
  const params: OrderUrlQueryParams = qs;
  const id = useParams().id;
  const { push } = useHistory();
  console.log("pathname", { pathname, id });
  return (
    <>
      {/* <Suspense fallback={<Loader />}> */}
      <OrderDetailsComponent id={decodeURIComponent(id)} params={params} />
      {/* </Suspense> */}
      <Route
        exact
        path={"/orders/" + orderFulfillPath(":id", "")}
        render={() => <OrderFulfill />}
      />
      <IonModal
        style={{
          "--border-radius": "16px"
        }}
        mode="ios"
        // backdropDismiss={true}
        isOpen={pathname?.includes("/return")}
        // canDismiss={true}
        presentingElement={orderModalRef.current}
        onWillDismiss={() => {
          // console.log("OrderReturn");
          // push(`/orders/${orderId}`);
        }}
      >
        <IonContent>
          <Route
            exact
            path={"/orders/" + orderReturnPath(":id", "")}
            render={() => <OrderReturn />}
          />
        </IonContent>
      </IonModal>
    </>
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
  return <OrderReturnComponent orderId={decodeURIComponent(useParams().id)} />;
};
