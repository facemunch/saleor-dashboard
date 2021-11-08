import { sectionNames } from "@saleor/intl";
import { asSortParams } from "@saleor/utils/sort";
import { parse as parseQs } from "qs";
import React from "react";
import { useIntl } from "react-intl";
import { Route, Routes, useParams } from "react-router-dom";

import { WindowTitle } from "../components/WindowTitle";
import {
  ProductTypeAddUrlQueryParams,
  ProductTypeListUrlQueryParams,
  ProductTypeListUrlSortField,
  productTypePath,
  ProductTypeUrlQueryParams
} from "./urls";
import ProductTypeCreateComponent from "./views/ProductTypeCreate";
import ProductTypeListComponent from "./views/ProductTypeList";
import ProductTypeUpdateComponent from "./views/ProductTypeUpdate";

const ProductTypeList: React.FC = () => {
  const qs = parseQs(location.search.substr(1));
  const params: ProductTypeListUrlQueryParams = asSortParams(
    qs,
    ProductTypeListUrlSortField
  );
  return <ProductTypeListComponent params={params} />;
};

const ProductTypeCreate: React.FC = () => {
  const qs = parseQs(location.search.substr(1));
  const params: ProductTypeAddUrlQueryParams = qs;

  return <ProductTypeCreateComponent params={params} />;
};

const ProductTypeUpdate: React.FC = () => {
  const qs = parseQs(location.search.substr(1));
  const params: ProductTypeUrlQueryParams = qs;
  const match = useParams();

  return (
    <ProductTypeUpdateComponent
      id={decodeURIComponent(match.id)}
      params={params}
    />
  );
};

export const ProductTypeRouter: React.FC = () => {
  const intl = useIntl();

  return (
    <>
      <WindowTitle title={intl.formatMessage(sectionNames.productTypes)} />
      <Routes>
        <Route path="" element={<ProductTypeList />} />
        <Route path="add" element={<ProductTypeCreate />} />
        <Route path={productTypePath(":id", "")} element={<ProductTypeUpdate />} />
      </Routes>
    </>
  );
};
ProductTypeRouter.displayName = "ProductTypeRouter";
export default ProductTypeRouter;
