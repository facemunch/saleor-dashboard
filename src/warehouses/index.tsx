import { sectionNames } from "@saleor/intl";
import { asSortParams } from "@saleor/utils/sort";
import { parse as parseQs } from "qs";
import React from "react";
import { useIntl } from "react-intl";
import { Route, Routes, useParams } from "react-router-dom";

import { WindowTitle } from "../components/WindowTitle";
import {
  WarehouseListUrlQueryParams,
  WarehouseListUrlSortField,
  warehousePath,
  WarehouseUrlQueryParams
} from "./urls";
import WarehouseCreate from "./views/WarehouseCreate";
import WarehouseDetailsComponent from "./views/WarehouseDetails";
import WarehouseListComponent from "./views/WarehouseList";

const WarehouseList: React.FC = () => {
  const qs = parseQs(location.search.substr(1));
  const params: WarehouseListUrlQueryParams = asSortParams(
    qs,
    WarehouseListUrlSortField
  );

  return <WarehouseListComponent params={params} />;
};

const WarehouseDetails: React.FC = () => {
  const qs = parseQs(location.search.substr(1));
  const params: WarehouseUrlQueryParams = qs;
  const match = useParams();
  return (
    <WarehouseDetailsComponent
      id={decodeURIComponent(match.id)}
      params={params}
    />
  );
};

export const WarehouseSection: React.FC = () => {
  const intl = useIntl();

  return (
    <>
      <WindowTitle title={intl.formatMessage(sectionNames.warehouses)} />
      <Routes>
        <Route path="" element={<WarehouseList />} />
        <Route path="add" element={<WarehouseCreate />} />
        <Route path={warehousePath(":id", "")} element={<WarehouseDetails />} />
      </Routes>
    </>
  );
};
export default WarehouseSection;
