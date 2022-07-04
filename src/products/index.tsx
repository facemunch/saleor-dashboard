import { asSortParams } from "@saleor/utils/sort";
import { getArrayQueryParam } from "@saleor/utils/urls";
import { Loader } from "frontend/ui/loader";
import { parse as parseQs } from "qs";
import React, { memo, Suspense, lazy, useMemo } from "react";
import { useLocation, useParams } from "react-router-dom";
import ProductListComponent from "./views/ProductList";

import {
  ProductCreateUrlQueryParams,
  ProductListUrlQueryParams,
  ProductListUrlSortField,
  ProductUrlQueryParams
} from "./urls";
const ProductUpdateComponent = lazy(() => import("./views/ProductUpdate"));
const ProductCreateComponent = lazy(() => import("./views/ProductCreate"));

export const ProductList: React.FC = () => {
  const { search, pathname } = useLocation();
  const qs = parseQs(search.substr(1));
  const params: ProductListUrlQueryParams = useMemo(() => {
    if (!pathname.includes("products")) {
      return;
    }

    return asSortParams(
      {
        ...qs,
        categories: getArrayQueryParam(qs.categories),
        collections: getArrayQueryParam(qs.collections),
        ids: getArrayQueryParam(qs.ids),
        productTypes: getArrayQueryParam(qs.productTypes)
      },
      ProductListUrlSortField
    );
  }, [pathname, search]);
  return (
    <Suspense fallback={<Loader />}>
      <ProductListComponent params={params || {}} />
    </Suspense>
  );
};

export const ProductUpdate: React.FC = memo(() => {
  const { search } = useLocation();
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
  const { search } = useLocation();
  const qs = parseQs(search.substr(1));
  const params: ProductCreateUrlQueryParams = qs;

  return (
    <Suspense fallback={<Loader />}>
      <ProductCreateComponent params={params} />
    </Suspense>
  );
};
