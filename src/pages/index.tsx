import { sectionNames } from "@saleor/intl";
import { asSortParams } from "@saleor/utils/sort";
import { parse as parseQs } from "qs";
import React from "react";
import { useIntl } from "react-intl";
import { Route, Routes, useParams } from "react-router-dom";

import { WindowTitle } from "../components/WindowTitle";
import {
  PageListUrlQueryParams,
  PageListUrlSortField,
  pagePath,
  PageUrlQueryParams
} from "./urls";
import PageCreateComponent from "./views/PageCreate";
import PageDetailsComponent from "./views/PageDetails";
import PageListComponent from "./views/PageList";

const PageList: React.FC = () => {
  const qs = parseQs(location.search.substr(1));
  const params: PageListUrlQueryParams = asSortParams(
    qs,
    PageListUrlSortField,
    PageListUrlSortField.title
  );
  return <PageListComponent params={params} />;
};

const PageCreate: React.FC = () => {
  const qs = parseQs(location.search.substr(1));
  const params: PageUrlQueryParams = qs;
  const match = useParams();

  return (
    <PageCreateComponent
      id={decodeURIComponent(match.id)}
      params={params}
    />
  );
};

const PageDetails: React.FC = () => {
  const qs = parseQs(location.search.substr(1));
  const params: PageUrlQueryParams = qs;
  const match = useParams();

  return (
    <PageDetailsComponent
      id={decodeURIComponent(match.id)}
      params={params}
    />
  );
};

const Component = () => {
  const intl = useIntl();

  return (
    <>
      <WindowTitle title={intl.formatMessage(sectionNames.pages)} />
      <Routes>
        <Route path="" element={<PageList />} />
        <Route path="add" element={<PageCreate />} />
        <Route path={pagePath(":id", "")} element={<PageDetails />} />
      </Routes>
    </>
  );
};

export default Component;
