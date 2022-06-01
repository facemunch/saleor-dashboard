import { sectionNames } from "@saleor/intl";
import { asSortParams } from "@saleor/utils/sort";
import { getArrayQueryParam } from "@saleor/utils/urls";
import { parse as parseQs } from "qs";
import React from "react";
import { useIntl } from "react-intl";
import { Route, Routes, useParams } from "react-router-dom";

import { WindowTitle } from "../components/WindowTitle";
import {
  ProductCreateUrlQueryParams,
  productImagePath,
  ProductImageUrlQueryParams,
  ProductListUrlQueryParams,
  ProductListUrlSortField,
  productPath,
  ProductUrlQueryParams,
  productVariantAddPath,
  ProductVariantAddUrlQueryParams,
  productVariantCreatorPath,
  productVariantEditPath,
  ProductVariantEditUrlQueryParams
} from "./urls";
import ProductCreateComponent from "./views/ProductCreate";
import ProductImageComponent from "./views/ProductImage";
import ProductListComponent from "./views/ProductList";
import ProductUpdateComponent from "./views/ProductUpdate";
import ProductVariantComponent from "./views/ProductVariant";
import ProductVariantCreateComponent from "./views/ProductVariantCreate";
import ProductVariantCreatorComponent from "./views/ProductVariantCreator";

const ProductList: React.FC = () => {
  const qs = parseQs(location.search.substr(1));
  const params: ProductListUrlQueryParams = asSortParams(
    {
      ...qs,
      categories: getArrayQueryParam(qs.categories),
      collections: getArrayQueryParam(qs.collections),
      ids: getArrayQueryParam(qs.ids),
      productTypes: getArrayQueryParam(qs.productTypes)
    },
    ProductListUrlSortField
  );

  return <ProductListComponent params={params} />;
};

const ProductUpdate: React.FC = () => {
  const qs = parseQs(location.search.substr(1));
  const params: ProductUrlQueryParams = qs;

  const match = useParams();

  return (
    <ProductUpdateComponent
      id={decodeURIComponent(match.id)}
      params={{
        ...params,
        ids: getArrayQueryParam(qs.ids)
      }}
    />
  );
};

const ProductCreate: React.FC = () => {
  const qs = parseQs(location.search.substr(1));
  const params: ProductCreateUrlQueryParams = qs;

  return <ProductCreateComponent params={params} />;
};

const ProductVariant: React.FC = () => {
  const qs = parseQs(location.search.substr(1));
  const params: ProductVariantEditUrlQueryParams = qs;
  const match = useParams();

  return (
    <ProductVariantComponent
      variantId={decodeURIComponent(match.variantId)}
      productId={decodeURIComponent(match.productId)}
      params={params}
    />
  );
};

const ProductImage: React.FC = () => {
  const qs = parseQs(location.search.substr(1));
  const params: ProductImageUrlQueryParams = qs;
  const match = useParams();

  return (
    <ProductImageComponent
      mediaId={decodeURIComponent(match.imageId)}
      productId={decodeURIComponent(match.productId)}
      params={params}
    />
  );
};

const ProductVariantCreate: React.FC = () => {
  const qs = parseQs(location.search.substr(1));
  const params: ProductVariantAddUrlQueryParams = qs;
  const match = useParams();

  return (
    <ProductVariantCreateComponent
      productId={decodeURIComponent(match.id)}
      params={params}
    />
  );
};

const ProductVariantCreator: React.FC = () => {
  const match = useParams();
  return <ProductVariantCreatorComponent id={decodeURIComponent(match.id)} />;
};

const Component = () => {
  const intl = useIntl();

  return (
    <>
      <WindowTitle title={intl.formatMessage(sectionNames.products)} />
      <Routes>
        <Route path="" element={<ProductList />} />
        <Route path="add" element={<ProductCreate />} />
        <Route
          path={productVariantCreatorPath(":id", "")}
          element={<ProductVariantCreator />}
        />
        <Route
          path={productVariantAddPath(":id", "")}
          element={<ProductVariantCreate />}
        />
        <Route
          path={productVariantEditPath(":productId", ":variantId", "")}
          element={<ProductVariant />}
        />
        <Route
          path={productImagePath(":productId", ":imageId", "")}
          element={<ProductImage />}
        />
        <Route path={productPath(":id", "")} element={<ProductUpdate />} />
      </Routes>
    </>
  );
};

export default Component;
