import { sectionNames } from "@saleor/intl";
import { asSortParams } from "@saleor/utils/sort";
import { parse as parseQs } from "qs";
import React from "react";
import { useIntl } from "react-intl";
import { Route, Routes, useParams } from "react-router-dom";

import { WindowTitle } from "../components/WindowTitle";
import {
  CollectionCreateUrlQueryParams,
  CollectionListUrlQueryParams,
  CollectionListUrlSortField,
  collectionPath,
  CollectionUrlQueryParams
} from "./urls";
import CollectionCreateView from "./views/CollectionCreate";
import CollectionDetailsView from "./views/CollectionDetails";
import CollectionListView from "./views/CollectionList";

const CollectionList: React.FC = () => {
  const qs = parseQs(location.search.substr(1));
  const params: CollectionListUrlQueryParams = asSortParams(
    qs,
    CollectionListUrlSortField
  );
  return <CollectionListView params={params} />;
};

const CollectionDetails: React.FC = () => {
  const qs = parseQs(location.search.substr(1));
  const params: CollectionUrlQueryParams = qs;
  const match = useParams();
  return (
    <CollectionDetailsView
      id={decodeURIComponent(match.id)}
      params={params}
    />
  );
};

const CollectionCreate: React.FC = () => {
  const qs = parseQs(location.search.substr(1));
  const params: CollectionCreateUrlQueryParams = qs;
  return <CollectionCreateView params={params} />;
};

const Component = () => {
  const intl = useIntl();

  return (
    <>
      <WindowTitle title={intl.formatMessage(sectionNames.collections)} />
      <Routes>
        <Route path="" element={<CollectionList />} />
        <Route path="add" element={<CollectionCreate />} />
        <Route path={collectionPath(":id", "")} element={<CollectionDetails />} />
      </Routes>
    </>
  );
};
export default Component;
