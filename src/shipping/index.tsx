import { IonModal } from "@ionic/react";
import { parse as parseQs } from "qs";
import React, { useRef } from "react";
import { Route, useParams, useHistory, useLocation } from "react-router-dom";
import CloseModal from "../components/ModalCloseIcon";

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

  const shippingDetailModalRef = useRef<HTMLIonModalElement>();
  const shippingCreateModalRef = useRef<HTMLIonModalElement>();

  const { push } = useHistory();

  const params: ShippingZonesListUrlQueryParams = qs;
  return (
    <>
      <CloseModal to="c/configuration" />
      <ShippingZonesListComponent params={params} />
      <IonModal
        style={{
          "--border-radius": "16px"
        }}
        mode="ios"
        ref={shippingDetailModalRef}
        backdropDismiss={true}
        isOpen={
          pathname.includes("/c/shipping/") && pathname !== "/c/shipping/add"
        }
        canDismiss={true}
        presentingElement={shippingListModalRef.current}
        onWillDismiss={() => push("/c/shipping")}
      >
        <Route
          path={"/c/shipping/" + shippingZonePath(":id", "")}
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
        ref={shippingCreateModalRef}
        backdropDismiss={true}
        isOpen={pathname === "/c/shipping/add"}
        canDismiss={true}
        presentingElement={shippingListModalRef.current}
        onWillDismiss={() => push("/c/shipping")}
      >
        <Route
          exact
          path={"/c/shipping/" + "add"}
          render={() => (
            <ShippingZoneCreate
              shippingCreateModalRef={shippingCreateModalRef}
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

  const shippingWeightRatesRef = useRef<HTMLIonModalElement>();

  const shippingPriceRatesEditRef = useRef<HTMLIonModalElement>();

  const match = useParams();
  return (
    <>
      <ShippingZoneDetailsComponent
        id={decodeURIComponent(match.id)}
        params={params}
        shippingDetailModalRef={shippingDetailModalRef}
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
      >
        <Route
          exact
          path={"/c/shipping/" + shippingPriceRatesPath(":id", "")}
          render={() => <PriceRatesCreate />}
        />
      </IonModal>

      <IonModal
        style={{
          "--border-radius": "16px"
        }}
        ref={shippingPriceRatesEditRef}
        mode="ios"
        backdropDismiss={true}
        isOpen={
          pathname.includes("/price/") && !pathname.includes("/price/add")
        }
        canDismiss={true}
        presentingElement={shippingDetailModalRef.current}
        onWillDismiss={() => {
          push(`/c/shipping/${match.id}`);
        }}
      >
        <Route
          exact
          path={
            "/c/shipping/" + shippingPriceRatesEditPath(":id", ":rateId", "")
          }
          render={() => (
            <PriceRatesUpdate
              shippingPriceRatesEditRef={shippingPriceRatesEditRef}
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
        isOpen={pathname.includes("/weight/add")}
        canDismiss={true}
        presentingElement={shippingDetailModalRef.current}
      >
        <Route
          exact
          path={"/c/shipping/" + shippingWeightRatesPath(":id", "")}
          render={() => <WeightRatesCreate />}
        />
      </IonModal>

      <IonModal
        style={{
          "--border-radius": "16px"
        }}
        mode="ios"
        ref={shippingWeightRatesRef}
        backdropDismiss={true}
        isOpen={
          pathname.includes("/weight/") && !pathname.includes("/weight/add")
        }
        canDismiss={true}
        presentingElement={shippingDetailModalRef.current}
        onWillDismiss={() => {
          push(`/c/shipping/${match.id}`);
        }}
      >
        <Route
          exact
          path={
            "/c/shipping/" + shippingWeightRatesEditPath(":id", ":rateId", "")
          }
          render={() => (
            <WeightRatesUpdate
              shippingWeightRatesRef={shippingWeightRatesRef}
            />
          )}
        />
      </IonModal>
    </>
  );
};

const PriceRatesCreate = () => {
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

const WeightRatesUpdate = ({ shippingWeightRatesRef }) => {
  const { search } = useLocation();
  const qs = parseQs(search.substr(1));
  const params: ShippingRateUrlQueryParams = qs;
  const match = useParams();

  return (
    <WeightRatesUpdateComponent
      id={decodeURIComponent(match.id)}
      rateId={decodeURIComponent(match.rateId)}
      params={params}
      shippingWeightRatesRef={shippingWeightRatesRef}
    />
  );
};

export const PriceRatesUpdate = ({ shippingPriceRatesEditRef }) => {
  const { search } = useLocation();

  const qs = parseQs(search.substr(1));
  const params: ShippingRateUrlQueryParams = qs;
  const match = useParams();

  return (
    <PriceRatesUpdateComponent
      id={decodeURIComponent(match.id)}
      rateId={decodeURIComponent(match.rateId)}
      params={params}
      shippingPriceRatesEditRef={shippingPriceRatesEditRef}
    />
  );
};
