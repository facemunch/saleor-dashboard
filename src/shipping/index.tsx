import { IonModal } from "@ionic/react";
import { parse as parseQs } from "qs";
import React, { useRef } from "react";
import { Route, useParams, useHistory, useLocation } from "react-router-dom";

import {
  shippingPriceRatesEditPath,
  shippingPriceRatesPath,
  ShippingRateCreateUrlQueryParams,
  ShippingRateUrlQueryParams,
  shippingWeightRatesEditPath,
  shippingWeightRatesPath,
  shippingZonePath,
  ShippingZonesListUrlQueryParams,
  ShippingZoneUrlQueryParams
} from "./urls";
import PriceRatesCreateComponent from "./views/PriceRatesCreate";
import PriceRatesUpdateComponent from "./views/PriceRatesUpdate";
import ShippingZoneCreate from "./views/ShippingZoneCreate";
import ShippingZoneDetailsComponent from "./views/ShippingZoneDetails";
import ShippingZonesListComponent from "./views/ShippingZonesList";
import WeightRatesCreateComponent from "./views/WeightRatesCreate";
import WeightRatesUpdateComponent from "./views/WeightRatesUpdate";

export const ShippingZonesList = ({ shippingListModalRef }) => {
  const { pathname, search } = useLocation();

  const qs = parseQs(search.substr(1));

  const shippingDetailModalRef = useRef();
  const { push } = useHistory();

  const params: ShippingZonesListUrlQueryParams = qs;
  return (
    <>
      <ShippingZonesListComponent params={params} />;
      <IonModal
        style={{
          "--border-radius": "16px"
        }}
        mode="ios"
        ref={shippingDetailModalRef}
        backdropDismiss={true}
        isOpen={pathname.includes("/shipping/") && pathname !== "/shipping/add"}
        canDismiss={true}
        presentingElement={shippingListModalRef.current}
        onWillDismiss={() => push("/shipping")}
      >
        <Route
          path={"/shipping/" + shippingZonePath(":id", "")}
          render={() => (
            <ShippingZoneDetails
              shippingDetailModalRef={shippingDetailModalRef}
            />
          )}
        />
      </IonModal>
      <IonModal
        style={{
          "--border-radius": "16px"
        }}
        mode="ios"
        backdropDismiss={true}
        isOpen={pathname === "/shipping/add"}
        canDismiss={true}
        presentingElement={shippingListModalRef.current}
        onWillDismiss={() => push("/shipping")}
      >
        <Route
          exact
          path={"/shipping/" + "add"}
          render={() => (
            <ShippingZoneCreate
            />
          )}
        />
      </IonModal>
    </>
  );
};

export const ShippingZoneDetails = ({ shippingDetailModalRef }) => {
  const { pathname, search } = useLocation();

  const qs = parseQs(search.substr(1));
  const { push } = useHistory();

  const params: ShippingZoneUrlQueryParams = qs;
  const match = useParams();
  return (
    <>
      <ShippingZoneDetailsComponent
        id={decodeURIComponent(match.id)}
        params={params}
      />
      <IonModal
        style={{
          "--border-radius": "16px"
        }}
        mode="ios"
        backdropDismiss={true}
        isOpen={pathname.includes("/price/add")}
        canDismiss={true}
        presentingElement={shippingDetailModalRef.current}
        onWillDismiss={() => {
          push(`/shipping/${match.id}`);
        }}
      >
        <Route
          exact
          path={"/shipping/" + shippingPriceRatesPath(":id", "")}
          render={() => <PriceRatesCreate />}
        />
      </IonModal>

      <IonModal
        style={{
          "--border-radius": "16px"
        }}
        mode="ios"
        backdropDismiss={true}
        isOpen={
          pathname.includes("/price/") && !pathname.includes("/price/add")
        }
        canDismiss={true}
        presentingElement={shippingDetailModalRef.current}
        onWillDismiss={() => {
          push(`/shipping/${match.id}`);
        }}
      >
        <Route
          exact
          path={"/shipping/" + shippingPriceRatesEditPath(":id", ":rateId", "")}
          render={() => <PriceRatesUpdate />}
        />
      </IonModal>

      <IonModal
        style={{
          "--border-radius": "16px"
        }}
        mode="ios"
        backdropDismiss={true}
        isOpen={pathname.includes("/weight/add")}
        canDismiss={true}
        presentingElement={shippingDetailModalRef.current}
        onWillDismiss={() => {
          push(`/shipping/${match.id}`);
        }}
      >
        <Route
          exact
          path={"/shipping/" + shippingWeightRatesPath(":id", "")}
          render={() => <WeightRatesCreate />}
        />
      </IonModal>

      <IonModal
        style={{
          "--border-radius": "16px"
        }}
        mode="ios"
        backdropDismiss={true}
        isOpen={
          pathname.includes("/weight/") && !pathname.includes("/weight/add")
        }
        canDismiss={true}
        presentingElement={shippingDetailModalRef.current}
        onWillDismiss={() => {
          push(`/shipping/${match.id}`);
        }}
      >
        <Route
          exact
          path={
            "/shipping/" + shippingWeightRatesEditPath(":id", ":rateId", "")
          }
          render={() => <WeightRatesUpdate />}
        />
      </IonModal>
    </>
  );
};

const PriceRatesCreate: React.FC = () => {
  const { search } = useLocation();
  const qs = parseQs(search.substr(1));
  const params: ShippingRateCreateUrlQueryParams = qs;
  const match = useParams();

  return (
    <PriceRatesCreateComponent
      id={decodeURIComponent(match.id)}
      params={params}
    />
  );
};

const WeightRatesCreate: React.FC = () => {
  const { search } = useLocation();
  const qs = parseQs(search.substr(1));
  const params: ShippingRateCreateUrlQueryParams = qs;
  const match = useParams();

  return (
    <WeightRatesCreateComponent
      id={decodeURIComponent(match.id)}
      params={params}
    />
  );
};

const WeightRatesUpdate: React.FC = () => {
  const { search } = useLocation();
  const qs = parseQs(search.substr(1));
  const params: ShippingRateUrlQueryParams = qs;
  const match = useParams();

  return (
    <WeightRatesUpdateComponent
      id={decodeURIComponent(match.id)}
      rateId={decodeURIComponent(match.rateId)}
      params={params}
    />
  );
};

export const PriceRatesUpdate: React.FC = () => {
  const { search } = useLocation();

  const qs = parseQs(search.substr(1));
  const params: ShippingRateUrlQueryParams = qs;
  const match = useParams();

  return (
    <PriceRatesUpdateComponent
      id={decodeURIComponent(match.id)}
      rateId={decodeURIComponent(match.rateId)}
      params={params}
    />
  );
};
