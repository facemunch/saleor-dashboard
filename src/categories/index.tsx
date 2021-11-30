import { sectionNames } from "@saleor/intl";
import { asSortParams } from "@saleor/utils/sort";
import { parse as parseQs } from "qs";
import React from "react";
import { useIntl } from "react-intl";
import { Route, Routes, useParams } from "react-router-dom";

import { WindowTitle } from "../components/WindowTitle";
import {
  categoryAddPath,
  CategoryListUrlQueryParams,
  CategoryListUrlSortField,
  categoryPath,
  CategoryUrlQueryParams
} from "./urls";
import { CategoryCreateView } from "./views/CategoryCreate";
import CategoryDetailsView, { getActiveTab } from "./views/CategoryDetails";
import CategoryListComponent from "./views/CategoryList";

const CategoryDetails: React.FC = () => {
  const qs = parseQs(location.search.substr(1));
  const params: CategoryUrlQueryParams = {
    ...qs,
    activeTab: getActiveTab(qs.activeTab)
  };
  const match = useParams();
  
  return (
    <CategoryDetailsView
      id={decodeURIComponent(match.id)}
      params={params}
    />
  );
};

const CategoryCreate: React.FC = () => {
  const match = useParams();

  return <CategoryCreateView
    parentId={match.id ? decodeURIComponent(match.id) : undefined}
  />
};

const CategoryList: React.FC = () => {
  const qs = parseQs(location.search.substr(1)) as any;
  const params: CategoryListUrlQueryParams = {
    ...asSortParams(qs, CategoryListUrlSortField)
  };

  return <CategoryListComponent params={params} />;
};

const Component = () => {
  const intl = useIntl();

  return (
    <>
      <WindowTitle title={intl.formatMessage(sectionNames.categories)} />
      <Routes>
        <Route path="" element={<CategoryList />} />
        <Route path={categoryAddPath("", "")} element={<CategoryCreate />} />
        <Route path={categoryAddPath(":id", "")} element={<CategoryCreate />} />
        <Route path={categoryPath(":id", "")} element={<CategoryDetails />} />
      </Routes>
    </>
  );
};

export default Component;
