import { sectionNames } from "@saleor/intl";
import { asSortParams } from "@saleor/utils/sort";
import { parse as parseQs } from "qs";
import React from "react";
import { useIntl } from "react-intl";
import { Route, Routes, useParams } from "react-router-dom";

import { WindowTitle } from "../components/WindowTitle";
import {
  AttributeAddUrlQueryParams,
  AttributeListUrlQueryParams,
  AttributeListUrlSortField,
  attributePath,
  AttributeUrlQueryParams
} from "./urls";
import AttributeCreateComponent from "./views/AttributeCreate";
import AttributeDetailsComponent from "./views/AttributeDetails";
import AttributeListComponent from "./views/AttributeList";

const AttributeList: React.FC = () => {
  const qs = parseQs(location.search.substr(1));
  const params: AttributeListUrlQueryParams = asSortParams(
    qs,
    AttributeListUrlSortField
  );

  return <AttributeListComponent params={params} />;
};

const AttributeCreate: React.FC = () => {
  const qs = parseQs(location.search.substr(1));
  const params: AttributeAddUrlQueryParams = qs;
  return <AttributeCreateComponent params={params} />;
};

const AttributeDetails: React.FC = () => {
  const qs = parseQs(location.search.substr(1));
  const params: AttributeUrlQueryParams = qs;
  const match = useParams();
  return (
    <AttributeDetailsComponent
      id={decodeURIComponent(match.id)}
      params={params}
    />
  );
};

export const AttributeSection: React.FC = () => {
  const intl = useIntl();

  return (
    <>
      <WindowTitle title={intl.formatMessage(sectionNames.attributes)} />
      <Routes>
        <Route path="" element={<AttributeList />} />
        <Route path="add" element={<AttributeCreate />} />
        <Route path={attributePath(":id", "")} element={<AttributeDetails />} />
      </Routes>
    </>
  );
};
export default AttributeSection;
