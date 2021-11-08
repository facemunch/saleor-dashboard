import { parse as parseQs } from "qs";
import React from "react";
import { Route, Routes } from "react-router-dom";


import { SiteSettingsUrlQueryParams } from "./urls";
import SiteSettingsComponent from "./views/";

const SiteSettings: React.FC = () => {
  const qs = parseQs(location.search.substr(1));
  const params: SiteSettingsUrlQueryParams = qs;

  return <SiteSettingsComponent params={params} />;
};

export const SiteSettingsSection: React.FC = () => (
  <Routes>
    <Route path="" element={<SiteSettings />} />
  </Routes>
);
export default SiteSettingsSection;
