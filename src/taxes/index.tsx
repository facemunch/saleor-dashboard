import { sectionNames } from "@saleor/intl";
import React from "react";
import { useIntl } from "react-intl";
import { Routes, useParams } from "react-router-dom";
import { Route } from "react-router-dom";

import { WindowTitle } from "../components/WindowTitle";
import { countryTaxRatesPath } from "./urls";
import CountryList from "./views/CountryList";
import CountryTaxesComponent from "./views/CountryTaxes";

const CountryTaxes: React.FC = () => <CountryTaxesComponent code={useParams().code} />;

const Component = () => {
  const intl = useIntl();

  return (
    <>
      <WindowTitle title={intl.formatMessage(sectionNames.taxes)} />
      <Routes>
        <Route path="" element={<CountryList />} />
        <Route
          path={countryTaxRatesPath(":code", "")}
          element={<CountryTaxes />}
        />
      </Routes>
    </>
  );
};

export default Component;
