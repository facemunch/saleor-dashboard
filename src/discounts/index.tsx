import { sectionNames } from "@saleor/intl";
import { asSortParams } from "@saleor/utils/sort";
import { parse as parseQs } from "qs";
import React from "react";
import { useIntl } from "react-intl";
import { Route, Routes, useParams } from "react-router-dom";

import { WindowTitle } from "../components/WindowTitle";
import { saleDetailsPageTab } from "./components/SaleDetailsPage";
import { voucherDetailsPageTab } from "./components/VoucherDetailsPage";
import {
  SaleCreateUrlQueryParams,
  SaleListUrlQueryParams,
  SaleListUrlSortField,
  salePath,
  SaleUrlQueryParams,
  VoucherCreateUrlQueryParams,
  VoucherListUrlQueryParams,
  VoucherListUrlSortField,
  voucherPath,
  VoucherUrlQueryParams
} from "./urls";
import SaleCreateViewComponent from "./views/SaleCreate/SaleCreate";
import SaleDetailsViewComponent from "./views/SaleDetails";
import SaleListViewComponent from "./views/SaleList";
import VoucherCreateViewComponent from "./views/VoucherCreate";
import VoucherDetailsViewComponent from "./views/VoucherDetails";
import VoucherListViewComponent from "./views/VoucherList";

const SaleListView: React.FC = () => {
  const qs = parseQs(location.search.substr(1));
  const params: SaleListUrlQueryParams = asSortParams(qs, SaleListUrlSortField);
  return <SaleListViewComponent params={params} />;
};

const SaleDetailsView: React.FC = () => {
  const { activeTab, ...qs } = parseQs(location.search.substr(1));
  const params: SaleUrlQueryParams = {
    ...qs,
    activeTab: saleDetailsPageTab(activeTab)
  };
  const match = useParams();

  return (
    <SaleDetailsViewComponent
      id={decodeURIComponent(match.id)}
      params={params}
    />
  );
};

const SaleCreateView: React.FC = () => {
  const qs = parseQs(location.search.substr(1));
  const params: SaleCreateUrlQueryParams = qs;

  return <SaleCreateViewComponent params={params} />;
};

const VoucherListView: React.FC = () => {
  const qs = parseQs(location.search.substr(1));
  const params: VoucherListUrlQueryParams = asSortParams(
    qs,
    VoucherListUrlSortField,
    VoucherListUrlSortField.code
  );
  return <VoucherListViewComponent params={params} />;
};

const VoucherDetailsView: React.FC = () => {
  const { activeTab, ...qs } = parseQs(location.search.substr(1));
  const params: VoucherUrlQueryParams = {
    ...qs,
    activeTab: voucherDetailsPageTab(activeTab)
  };
  const match = useParams();

  return (
    <VoucherDetailsViewComponent
      id={decodeURIComponent(match.id)}
      params={params}
    />
  );
};

const VoucherCreateView: React.FC = () => {
  const qs = parseQs(location.search.substr(1));
  const params: VoucherCreateUrlQueryParams = qs;

  return <VoucherCreateViewComponent params={params} />;
};

export const DiscountSection: React.FC<{}> = () => {
  const intl = useIntl();

  return (
    <>
      <WindowTitle title={intl.formatMessage(sectionNames.vouchers)} />
      <Routes>
        <Route path="sales" element={<SaleListView />} />
        <Route path="sales/add" element={<SaleCreateView />} />
        <Route path="vouchers" element={<VoucherListView />} />
        <Route path="vouchers/add" element={<VoucherCreateView />} />
        <Route path={salePath(":id", "sales")} element={<SaleDetailsView />} />
        <Route path={voucherPath(":id", "vouchers")} element={<VoucherDetailsView />} />
      </Routes>
    </>
  );
};
export default DiscountSection;
