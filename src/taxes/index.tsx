import { sectionNames } from "@saleor/intl";
import React from "react";
import { useIntl } from "react-intl";
import { Routes } from "react-router-dom";
import { Route, RouteComponentProps } from "react-router";

import { WindowTitle } from "../components/WindowTitle";
import { countryListPath, countryTaxRatesPath } from "./urls";
import CountryList from "./views/CountryList";
import CountryTaxesComponent, {
  CountryTaxesParams
} from "./views/CountryTaxes";

const CountryTaxes: React.FC<RouteComponentProps<CountryTaxesParams>> = ({
  match
}) => <CountryTaxesComponent code={match.params.code} />;

const Component = () => {
  const intl = useIntl();

  return (
    <>
      <WindowTitle title={intl.formatMessage(sectionNames.taxes)} />
      <Routes>
        <Route exact path={countryListPath} component={CountryList} />
        <Route
          exact
          path={countryTaxRatesPath(":code")}
          component={CountryTaxes}
        />
      </Routes>
    </>
  );
};

export default Component;
