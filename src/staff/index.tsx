import { sectionNames } from "@saleor/intl";
import { asSortParams } from "@saleor/utils/sort";
import { parse as parseQs } from "qs";
import React from "react";
import { useIntl } from "react-intl";
import { Route, useParams, Routes } from "react-router-dom";

import { WindowTitle } from "../components/WindowTitle";
import {
  StaffListUrlQueryParams,
  StaffListUrlSortField,
  staffMemberDetailsPath,
  StaffMemberDetailsUrlQueryParams
} from "./urls";
import StaffDetailsComponent from "./views/StaffDetails";
import StaffListComponent from "./views/StaffList";

const StaffList: React.FC = () => {
  const qs = parseQs(location.search.substr(1));
  const params: StaffListUrlQueryParams = asSortParams(
    qs,
    StaffListUrlSortField
  );

  return <StaffListComponent params={params} />;
};

const StaffDetails: React.FC = () => {
  const qs = parseQs(location.search.substr(1));
  const params: StaffMemberDetailsUrlQueryParams = qs;
  const match = useParams();

  return (
    <StaffDetailsComponent
      id={decodeURIComponent(match.id)}
      params={params}
    />
  );
};

const Component = () => {
  const intl = useIntl();

  return (
    <>
      <WindowTitle title={intl.formatMessage(sectionNames.staff)} />
      <Routes>
        <Route path="" element={<StaffList />} />
        <Route path={staffMemberDetailsPath(":id", "")} element={<StaffDetails />} />
      </Routes>
    </>
  );
};

export default Component;
