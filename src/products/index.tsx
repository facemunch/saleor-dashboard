import { Loader } from "frontend/ui/loader";
import { parse as parseQs } from "qs";
import React, { memo, Suspense, lazy } from "react";
import { useParams } from "react-router-dom";

import { ProductCreateUrlQueryParams, ProductUrlQueryParams } from "./urls";
const ProductUpdateComponent = lazy(() => import("./views/ProductUpdate"));
const ProductCreateComponent = lazy(() => import("./views/ProductCreate"));
const ProductListComponent = lazy(() => import("./views/ProductList"));

export const ProductList: React.FC = memo(() => {
  const qs = parseQs(location.search.substr(1));

  return (
    <Suspense fallback={<Loader />}>
      <ProductListComponent params={{ ...qs, asc: qs.asc === "true" }} />
    </Suspense>
  );
});

export const ProductUpdate: React.FC = memo(() => {
  const qs = parseQs(location.search.substr(1));
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
  const qs = parseQs(location.search.substr(1));
  const params: ProductCreateUrlQueryParams = qs;

  return (
    <Suspense fallback={<Loader />}>
      <ProductCreateComponent params={params} />
    </Suspense>
  );
};
