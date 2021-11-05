import { sectionNames } from "@saleor/intl";
import { asSortParams } from "@saleor/utils/sort";
import { getArrayQueryParam } from "@saleor/utils/urls";
import { parse as parseQs } from "qs";
import React from "react";
import { useIntl } from "react-intl";
import { Location, PathMatch, Route, Routes, useLocation, useMatch, useParams } from "react-router-dom";

import { WindowTitle } from "../components/WindowTitle";
import {
  productAddPath,
  ProductCreateUrlQueryParams,
  productImagePath,
  ProductImageUrlQueryParams,
  productListPath,
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

// const ProductVariant: React.FC<RouteComponentProps<any>> = ({ match }) => {
//   const qs = parseQs(location.search.substr(1));
//   const params: ProductVariantEditUrlQueryParams = qs;

//   return (
//     <ProductVariantComponent
//       variantId={decodeURIComponent(match.params.variantId)}
//       productId={decodeURIComponent(match.params.productId)}
//       params={params}
//     />
//   );
// };

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

// const ProductVariantCreate: React.FC<RouteComponentProps<any>> = ({
//   match
// }) => {
//   const qs = parseQs(location.search.substr(1));
//   const params: ProductVariantAddUrlQueryParams = qs;

//   return (
//     <ProductVariantCreateComponent
//       productId={decodeURIComponent(match.params.id)}
//       params={params}
//     />
//   );
// };

// const ProductVariantCreator: React.FC<RouteComponentProps<{
//   id: string;
// }>> = ({ match }) => (
//   <ProductVariantCreatorComponent id={decodeURIComponent(match.params.id)} />
// );

const Component = () => {
  const intl = useIntl();

  return (
    <>
      <WindowTitle title={intl.formatMessage(sectionNames.products)} />
      <Routes>
        <Route path="" element={<ProductList />} />
        <Route path="add" element={<ProductCreate />} />
        {/* <Route
          path={productVariantCreatorPath(":id")}
          element={ProductVariantCreator}
        />
        <Route
          path={productVariantAddPath(":id")}
          element={ProductVariantCreate}
        />
        <Route
          path={productVariantEditPath(":productId", ":variantId")}
          element={ProductVariant}
        />*/}
        <Route
          path={":productId/image/:imageId"}
          element={<ProductImage />}
        /> 
        <Route path=":id" element={<ProductUpdate />} />
      </Routes>
    </>
  );
};

export default Component;
