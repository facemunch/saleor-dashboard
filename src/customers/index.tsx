import { sectionNames } from "@saleor/intl";
import { asSortParams } from "@saleor/utils/sort";
import { parse as parseQs } from "qs";
import React from "react";
import { useIntl } from "react-intl";
import { Route, Switch, useParams } from "react-router-dom";

import { WindowTitle } from "../components/WindowTitle";
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

const CustomerListView: React.FC = () => {
  const qs = parseQs(location.search.substr(1));
  const params: CustomerListUrlQueryParams = location.pathname.includes(
    "/customers"
  )
    ? asSortParams(qs, CustomerListUrlSortField)
    : {};

  return <CustomerListViewComponent params={params} />;
};

const CustomerDetailsView: React.FC = () => {
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

const CustomerAddressesView: React.FC = () => {
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
  const intl = useIntl();

  return (
    <>
      <WindowTitle title={intl.formatMessage(sectionNames.customers)} />
      <Switch>
        <Route exact path="/customers" render={() => <CustomerListView />} />
        <Route
          exact
          path="/customers/add"
          render={() => <CustomerCreateView />}
        />
        <Route
          exact
          path={"/customers/" + customerAddressesPath(":id", "")}
          render={() => <CustomerAddressesView />}
        />
        <Route
          exact
          path={"/customers/" + customerPath(":id", "")}
          render={() => <CustomerDetailsView />}
        />
      </Switch>
    </>
  );
};
