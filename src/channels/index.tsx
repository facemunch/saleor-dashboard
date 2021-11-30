import { sectionNames } from "@saleor/intl";
import { asSortParams } from "@saleor/utils/sort";
import { parse as parseQs } from "qs";
import React from "react";
import { useIntl } from "react-intl";
import { Route, Routes, useParams } from "react-router-dom";

import { WindowTitle } from "../components/WindowTitle";
import {
  channelPath,
  ChannelsListUrlQueryParams,
  ChannelsListUrlSortField
} from "./urls";
import ChannelCreateComponent from "./views/ChannelCreate";
import ChannelDetailsComponent from "./views/ChannelDetails";
import ChannelsListComponent from "./views/ChannelsList";

const ChannelDetails: React.FC = () => {
  const params = parseQs(location.search.substr(1));
  const match = useParams();
  return (
    <ChannelDetailsComponent
      id={decodeURIComponent(match.id)}
      params={params}
    />
  );
};

const ChannelsList: React.FC = () => {
  const qs = parseQs(location.search.substr(1));
  const params: ChannelsListUrlQueryParams = asSortParams(
    qs,
    ChannelsListUrlSortField
  );
  return <ChannelsListComponent params={params} />;
};

export const ChannelsSection: React.FC<{}> = () => {
  const intl = useIntl();

  return (
    <>
      <WindowTitle title={intl.formatMessage(sectionNames.channels)} />
      <Routes>
        <Route path="" element={<ChannelsList />} />
        <Route path="add" element={<ChannelCreateComponent />} />
        <Route path={channelPath(":id", "")} element={<ChannelDetails />} />
      </Routes>
    </>
  );
};
export default ChannelsSection;
