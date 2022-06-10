import { asSortParams } from "@saleor/utils/sort";
import { parse as parseQs } from "qs";
import React from "react";
import { Route, Switch, useParams } from "react-router-dom";
import {
  customerAddressesPath,
  CustomerAddressesUrlQueryParams,
  CustomerListUrlQueryParams,
  CustomerListUrlSortField,
  customerPath,
  CustomerUrlQueryParams
} from "./urls";
import CustomerAddressesViewComponent from "./views/CustomerAddresses";
import CustomerCreateView from "./views/CustomerCreate";
import CustomerDetailsViewComponent from "./views/CustomerDetails";
import CustomerListViewComponent from "./views/CustomerList";

export const CustomerListView: React.FC = () => {
  const qs = parseQs(location.search.substr(1));
  const params: CustomerListUrlQueryParams = location.pathname.includes(
    "/customers"
  )
    ? asSortParams(qs, CustomerListUrlSortField)
    : {};

  return <CustomerListViewComponent params={params} />;
};

export const CustomerDetailsView: React.FC = () => {
  const qs = parseQs(location.search.substr(1));
  const params: CustomerUrlQueryParams = qs;
  const match = useParams();

  return (
    <CustomerDetailsViewComponent
      id={decodeURIComponent(match.id)}
      params={params}
    />
  );
};

export const CustomerAddressesView: React.FC = () => {
  const qs = parseQs(location.search.substr(1));
  const params: CustomerAddressesUrlQueryParams = qs;
  const match = useParams();

  return (
    <CustomerAddressesViewComponent
      id={decodeURIComponent(match.id)}
      params={params}
    />
  );
};

export const CustomerSection: React.FC<{}> = () => {

  return (
    <>
      <Switch>
        <Route exact path="/customers" render={() => <CustomerListView />} />
        <Route
          exact
          path="/customers/add"
          render={() => <CustomerCreateView />}
        />
        <Route
          path={"/customers/" + customerAddressesPath(":id", "")}
          render={() => <CustomerAddressesView />}
        />
        <Route
          path={"/customers/" + customerPath(":id", "")}
          render={() => <CustomerDetailsView />}
        />
        <Route path="/" render={() => <CustomerListView />} />

      </Switch>
    </>
  );
};
