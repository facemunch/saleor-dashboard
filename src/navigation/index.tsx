import { asSortParams } from "@saleor/utils/sort";
import { parse as parseQs } from "qs";
import React from "react";
import { Route, Routes, useParams } from "react-router-dom";

import {
  MenuListUrlQueryParams,
  MenuListUrlSortField,
  menuPath
} from "./urls";
import MenuDetailsComponent from "./views/MenuDetails";
import MenuListComponent from "./views/MenuList";

const MenuList: React.FC = () => {
  const qs = parseQs(location.search.substr(1));
  const params: MenuListUrlQueryParams = asSortParams(qs, MenuListUrlSortField);

  return <MenuListComponent params={params} />;
};

const MenuDetails: React.FC= () => {
  const qs = parseQs(location.search.substr(1));
  const match = useParams();

  return (
    <MenuDetailsComponent
      id={decodeURIComponent(match.id)}
      params={qs}
    />
  );
};

const NavigationRouter: React.FC = () => (
  <Routes>
    <Route element={<MenuList />} path="" />
    <Route element={<MenuDetails />} path={menuPath(":id", "")} />
  </Routes>
);

export default NavigationRouter;
