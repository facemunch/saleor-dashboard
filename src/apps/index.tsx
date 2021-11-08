import { sectionNames } from "@saleor/intl";
import WebhooksRoutes from "@saleor/webhooks";
import { parse as parseQs } from "qs";
import React from "react";
import { useIntl } from "react-intl";
import { Routes, Route, useParams } from "react-router-dom";

import { WindowTitle } from "../components/WindowTitle";
import {
  AppDetailsUrlQueryParams,
  AppInstallUrlQueryParams,
  AppListUrlQueryParams,
  appPath,
  appSettingsPath,
  customAppPath,
  CustomAppUrlQueryParams
} from "./urls";
import AppDetailsView from "./views/AppDetails";
import AppDetailsSettingsView from "./views/AppDetailsSettings";
import AppInstallView from "./views/AppInstall";
import AppsListView from "./views/AppsList";
import CustomAppCreateView from "./views/CustomAppCreate";
import CustomAppDetailsView from "./views/CustomAppDetails";

const AppDetails: React.FC = () => {
  const qs = parseQs(location.search.substr(1));
  const params: AppDetailsUrlQueryParams = qs;
  const match = useParams();

  return (
    <AppDetailsView id={decodeURIComponent(match.id)} params={params} />
  );
};

const AppDetailsSettings: React.FC = () => <AppDetailsSettingsView id={decodeURIComponent(useParams().id)} />;

const AppInstall: React.FC = props => {
  const qs = parseQs(location.search.substr(1));
  const params: AppInstallUrlQueryParams = qs;

  return <AppInstallView params={params} {...props} />;
};

interface CustomAppDetailsProps {
  token: string;
  onTokenClose: () => void;
}

const CustomAppDetails: React.FC<CustomAppDetailsProps> = ({
  token,
  onTokenClose
}) => {
  const qs = parseQs(location.search.substr(1));
  const params: CustomAppUrlQueryParams = qs;
  const id = useParams().id;

  if (!id) {
    throw new Error("No ID provided");
  }

  return (
    <CustomAppDetailsView
      id={decodeURIComponent(id)}
      params={params}
      token={token}
      onTokenClose={onTokenClose}
    />
  );
};

const AppsList: React.FC = () => {
  const qs = parseQs(location.search.substr(1));
  const params: AppListUrlQueryParams = qs;

  return <AppsListView params={params} />;
};
const Component = () => {
  const intl = useIntl();
  const [token, setToken] = React.useState<string>(null);

  return (
    <>
      <WindowTitle title={intl.formatMessage(sectionNames.apps)} />
      <Routes>
        <Route path="" element={<AppsList />} />
        <Route
          path="custom/add"
          element={<CustomAppCreateView setToken={setToken} />}
        />
        <Route path="install" element={<AppInstall />} />
        <Route path={appPath(":id", "")} element={<AppDetails />} />
        <Route
          path={appSettingsPath(":id", "")}
          element={<AppDetailsSettings />}
        />
        <Route
          path={customAppPath(":id", "custom")}
          element={
            <CustomAppDetails
              token={token}
              onTokenClose={() => setToken(null)}
            />
          }
        />
      </Routes>
      <WebhooksRoutes />
    </>
  );
};

export default Component;
