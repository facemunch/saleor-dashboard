import { sectionNames } from "@saleor/intl";
import { asSortParams } from "@saleor/utils/sort";
import { parse as parseQs } from "qs";
import React from "react";
import { useIntl } from "react-intl";
import { Route, Routes, useParams } from "react-router-dom";

import { WindowTitle } from "../components/WindowTitle";
import {
  PageTypeListUrlQueryParams,
  PageTypeListUrlSortField,
  pageTypePath,
  PageTypeUrlQueryParams
} from "./urls";
import PageTypeCreate from "./views/PageTypeCreate";
import PageTypeDetailsComponent from "./views/PageTypeDetails";
import PageTypeListComponent from "./views/PageTypeList";

const PageTypeList: React.FC = () => {
  const qs = parseQs(location.search.substr(1));
  const params: PageTypeListUrlQueryParams = asSortParams(
    qs,
    PageTypeListUrlSortField
  );
  return <PageTypeListComponent params={params} />;
};

const PageTypeDetails: React.FC = () => {
  const qs = parseQs(location.search.substr(1));
  const params: PageTypeUrlQueryParams = qs;
  const match = useParams();

  return (
    <PageTypeDetailsComponent
      id={decodeURIComponent(match.id)}
      params={params}
    />
  );
};

export const PageTypeRouter: React.FC = () => {
  const intl = useIntl();

  return (
    <>
      <WindowTitle title={intl.formatMessage(sectionNames.pageTypes)} />
      <Routes>
        <Route path="" element={<PageTypeList />} />
        <Route path="add" element={<PageTypeCreate />} />
        <Route path={pageTypePath(":id", "")} element={<PageTypeDetails />} />
      </Routes>
    </>
  );
};
PageTypeRouter.displayName = "PageTypeRouter";
export default PageTypeRouter;
