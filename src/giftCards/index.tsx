import { WindowTitle } from "@saleor/components/WindowTitle";
import { sectionNames } from "@saleor/intl";
import { parse as parseQs } from "qs";
import React from "react";
import { useIntl } from "react-intl";
import { Route, Routes, useParams } from "react-router-dom";

import GiftCardSettings from "./GiftCardSettings";
import GiftCardListComponent from "./GiftCardsList";
import { GiftCardListUrlQueryParams } from "./GiftCardsList/types";
import GiftCardUpdateComponent from "./GiftCardUpdate";
import { GiftCardUpdatePageUrlQueryParams } from "./GiftCardUpdate/types";
import { giftCardUrl } from "./urls";

const GiftCardUpdatePage: React.FC = () => {
  const qs = parseQs(location.search.substr(1));
  const params: GiftCardUpdatePageUrlQueryParams = qs;
  const match = useParams();

  return (
    <GiftCardUpdateComponent
      id={decodeURIComponent(match.id)}
      params={params}
    />
  );
};

const GiftCardList: React.FC = () => {
  const qs = parseQs(location.search.substr(1));
  const params: GiftCardListUrlQueryParams = qs;

  return <GiftCardListComponent params={params} />;
};

const Component: React.FC = ({}) => {
  const intl = useIntl();

  return (
    <>
      <WindowTitle title={intl.formatMessage(sectionNames.giftCards)} />
      <Routes>
        <Route path="" element={<GiftCardList />} />
        <Route path="settings" element={<GiftCardSettings />} />
        <Route path={giftCardUrl(":id", null, "")} element={<GiftCardUpdatePage />} />
      </Routes>
    </>
  );
};

export default Component;
