import { asSortParams } from "@saleor/utils/sort";
import { getArrayQueryParam } from "@saleor/utils/urls";
import { parse as parseQs } from "qs";
import React, { memo, useMemo, useRef } from "react";
import { useLocation, useParams } from "react-router-dom";
import ProductListComponent from "./views/ProductList";
import ProductCreateComponent from "./views/ProductCreate";
import ProductUpdateComponent from "./views/ProductUpdate";
import { useIonRouter } from "@ionic/react";

import {
  ProductCreateUrlQueryParams,
  ProductListUrlQueryParams,
  ProductListUrlSortField,
  ProductUrlQueryParams
} from "./urls";

export const ProductList: React.FC = () => {
  const { routeInfo } = useIonRouter();

  const { search, pathname } = useLocation();
  const oldQs = useRef<{ productTypes: string; ids: string }>();

  const params: ProductListUrlQueryParams = useMemo(() => {
    if (!pathname.includes("/products")) {
      return oldQs.current;
    }
    const qs = parseQs(search.substr(1));

    if (search.length > 0) {
      oldQs.current = asSortParams(
        {
          ...qs,
          ids: getArrayQueryParam(qs.ids),
          productTypes: getArrayQueryParam(qs.productTypes)
        },
        ProductListUrlSortField
      );
    }

    return oldQs.current;
  }, [search, pathname, routeInfo]);

  return <ProductListComponent params={params || {}} />;
};

export const ProductUpdate: React.FC = memo(() => {
  const { search } = useLocation();
  const qs = parseQs(search.substr(1));
  const params: ProductUrlQueryParams = qs;

  const match = useParams<{ id: string }>();
  return (
    <ProductUpdateComponent
      id={decodeURIComponent(match.id)}
      params={{
        ...params
      }}
    />
  );
});

export const ProductCreate: React.FC = () => {
  const { search } = useLocation();
  const qs = parseQs(search.substr(1));
  const params: ProductCreateUrlQueryParams = qs;

  return <ProductCreateComponent params={params} />;
};
