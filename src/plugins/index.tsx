import { sectionNames } from "@saleor/intl";
import { asSortParams } from "@saleor/utils/sort";
import { parse as parseQs } from "qs";
import React from "react";
import { useIntl } from "react-intl";
import { Route, Routes, useParams } from "react-router-dom";

import { WindowTitle } from "../components/WindowTitle";
import {
  PluginListUrlQueryParams,
  PluginListUrlSortField,
  pluginPath,
  PluginUrlQueryParams
} from "./urls";
import PluginsListComponent from "./views/PluginList";
import PluginsDetailsComponent from "./views/PluginsDetails";

const PluginList: React.FC = () => {
  const qs = parseQs(location.search.substr(1));
  const params: PluginListUrlQueryParams = asSortParams(
    qs,
    PluginListUrlSortField
  );
  return <PluginsListComponent params={params} />;
};

const PageDetails: React.FC = () => {
  const qs = parseQs(location.search.substr(1));
  const params: PluginUrlQueryParams = qs;
  const match = useParams();

  return (
    <PluginsDetailsComponent
      id={decodeURIComponent(match.id)}
      params={params}
    />
  );
};

const Component = () => {
  const intl = useIntl();
  return (
    <>
      <WindowTitle title={intl.formatMessage(sectionNames.plugins)} />
      <Routes>
        <Route path="" element={<PluginList />} />
        <Route path={pluginPath(":id", "")} element={<PageDetails />} />
      </Routes>
    </>
  );
};

export default Component;
