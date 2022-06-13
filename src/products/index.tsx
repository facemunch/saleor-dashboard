import { asSortParams } from "@saleor/utils/sort";
import { getArrayQueryParam } from "@saleor/utils/urls";
import { Loader } from "frontend/ui/loader";
import { parse as parseQs } from "qs";
import React, { memo, Suspense, lazy } from "react";
import { useLocation, useParams } from "react-router-dom";

import { ProductCreateUrlQueryParams, ProductListUrlQueryParams, ProductListUrlSortField, ProductUrlQueryParams } from "./urls";
const ProductUpdateComponent = lazy(() => import("./views/ProductUpdate"));
const ProductCreateComponent = lazy(() => import("./views/ProductCreate"));
const ProductListComponent = lazy(() => import("./views/ProductList"));

export const ProductList: React.FC = () => {
  const { search } = useLocation()
  const qs = parseQs(search.substr(1));
  const params: ProductListUrlQueryParams = location.pathname.includes(
    "/products"
  )
    ? asSortParams(
        {
          ...qs,
          categories: getArrayQueryParam(qs.categories),
          collections: getArrayQueryParam(qs.collections),
          ids: getArrayQueryParam(qs.ids),
          productTypes: getArrayQueryParam(qs.productTypes)
        },
        ProductListUrlSortField
      )
    : {};
  return (
    <Suspense fallback={<Loader />}>
      <ProductListComponent params={params} />
    </Suspense>
  );
};

export const ProductUpdate: React.FC = memo(() => {
  const { search } = useLocation()
  const qs = parseQs(search.substr(1));
  const params: ProductUrlQueryParams = qs;

  const match = useParams();
  return (
    <Suspense fallback={<Loader />}>
      <ProductUpdateComponent
        id={decodeURIComponent(match.id)}
        params={{
          ...params
        }}
      />
    </Suspense>
  );
});

export const ProductCreate: React.FC = () => {
  const { search } = useLocation()
  const qs = parseQs(search.substr(1));
  const params: ProductCreateUrlQueryParams = qs;

  return (
    <Suspense fallback={<Loader />}>
      <ProductCreateComponent params={params} />
    </Suspense>
  );
};
