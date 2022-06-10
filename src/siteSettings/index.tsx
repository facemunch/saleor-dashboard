import { parse as parseQs } from "qs";
import React from "react";
import { Route } from "react-router-dom";

import { SiteSettingsUrlQueryParams } from "./urls";
import SiteSettingsComponent from "./views/";

const SiteSettings: React.FC = () => {
  const qs = parseQs(location.search.substr(1));
  const params: SiteSettingsUrlQueryParams = qs;

  return <SiteSettingsComponent params={params} />;
};

export const SiteSettingsSection: React.FC = () => (
  <>
    <Route path="/site-settings" render={() => <SiteSettings />} />
  </>
);
export default SiteSettingsSection;
