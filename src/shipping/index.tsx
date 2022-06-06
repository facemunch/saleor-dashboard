import { sectionNames } from "@saleor/intl";
import { parse as parseQs } from "qs";
import React from "react";
import { useIntl } from "react-intl";
import { Route, useParams, Switch } from "react-router-dom";

import { WindowTitle } from "../components/WindowTitle";
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

const ShippingZonesList: React.FC = () => {
  const qs = parseQs(location.search.substr(1));
  const params: ShippingZonesListUrlQueryParams = qs;
  return <ShippingZonesListComponent params={params} />;
};

const ShippingZoneDetails: React.FC = () => {
  const qs = parseQs(location.search.substr(1));
  const params: ShippingZoneUrlQueryParams = qs;
  const match = useParams();
  return (
    <ShippingZoneDetailsComponent
      id={decodeURIComponent(match.id)}
      params={params}
    />
  );
};

const PriceRatesCreate: React.FC = () => {
  const qs = parseQs(location.search.substr(1));
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
  const qs = parseQs(location.search.substr(1));
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
  const qs = parseQs(location.search.substr(1));
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

const PriceRatesUpdate: React.FC = () => {
  const qs = parseQs(location.search.substr(1));
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

export const ShippingRouter: React.FC = () => {
  const intl = useIntl();

  return (
    <>
      <WindowTitle title={intl.formatMessage(sectionNames.shipping)} />
      <Switch>
        <Route exact path={"/shipping"} render={() => <ShippingZonesList />} />
        <Route
          exact
          path={"/shipping/" + "add"}
          render={() => <ShippingZoneCreate />}
        />
        <Route
          
          path={"/shipping/" + shippingZonePath(":id", "")}
          render={() => <ShippingZoneDetails />}
        />
        <Route
          
          path={"/shipping/" + shippingPriceRatesPath(":id", "")}
          render={() => <PriceRatesCreate />}
        />
        <Route
          
          path={"/shipping/" + shippingWeightRatesPath(":id", "")}
          render={() => <WeightRatesCreate />}
        />
        <Route
          
          path={
            "/shipping/" + shippingWeightRatesEditPath(":id", ":rateId", "")
          }
          render={() => <WeightRatesUpdate />}
        />
        <Route
          
          path={"/shipping/" + shippingPriceRatesEditPath(":id", ":rateId", "")}
          render={() => <PriceRatesUpdate />}
        /> 
      </Switch>
    </>
  );
};
export default ShippingRouter;
