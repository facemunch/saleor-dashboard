import { sectionNames } from "@saleor/intl";
import { asSortParams } from "@saleor/utils/sort";
import { parse as parseQs } from "qs";
import React from "react";
import { useIntl } from "react-intl";
import { Route, Routes, useParams } from "react-router-dom";

import { WindowTitle } from "../components/WindowTitle";
import {
  MembersListUrlSortField,
  permissionGroupDetailsPath,
  PermissionGroupDetailsUrlQueryParams,
  PermissionGroupListUrlQueryParams,
  PermissionGroupListUrlSortField
} from "./urls";
import PermissionGroupCreate from "./views/PermissionGroupCreate";
import PermissionGroupDetailsComponent from "./views/PermissionGroupDetails";
import PermissionGroupListComponent from "./views/PermissionGroupList";

const PermissionGroupList: React.FC = () => {
  const qs = parseQs(location.search.substr(1));
  const params: PermissionGroupListUrlQueryParams = asSortParams(
    qs,
    PermissionGroupListUrlSortField
  );

  return <PermissionGroupListComponent params={params} />;
};

const PermissionGroupDetails: React.FC = () => {
  const qs = parseQs(location.search.substr(1));
  const params: PermissionGroupDetailsUrlQueryParams = asSortParams(
    qs,
    MembersListUrlSortField
  );
  const match = useParams();

  return (
    <PermissionGroupDetailsComponent
      id={decodeURIComponent(match.id)}
      params={params}
    />
  );
};

const Component = () => {
  const intl = useIntl();

  return (
    <>
      <WindowTitle title={intl.formatMessage(sectionNames.permissionGroups)} />
      <Routes>
        <Route
          path=""
          element={<PermissionGroupList />}
        />
        <Route
          path="add"
          element={<PermissionGroupCreate />}
        />
        <Route
          path={permissionGroupDetailsPath(":id", "")}
          element={<PermissionGroupDetails />}
        />
      </Routes>
    </>
  );
};

export default Component;
