import { sectionNames } from "@saleor/intl";
import { parse as parseQs } from "qs";
import React from "react";
import { useIntl } from "react-intl";
import { Route, Routes, useParams } from "react-router-dom";

import { WindowTitle } from "../components/WindowTitle";
import { LanguageCodeEnum } from "../types/globalTypes";
import {
  languageEntitiesPath,
  languageEntityPath,
  TranslatableEntities
} from "./urls";
import TranslationsAttributesComponent, {
  TranslationsAttributesQueryParams
} from "./views/TranslationsAttributes";
import TranslationsCategoriesComponent, {
  TranslationsCategoriesQueryParams
} from "./views/TranslationsCategories";
import TranslationsCollectionsComponent, {
  TranslationsCollectionsQueryParams
} from "./views/TranslationsCollections";
import TranslationsEntitiesComponent from "./views/TranslationsEntities";
import TranslationsLanguageList from "./views/TranslationsLanguageList";
import TranslationsPagesComponent, {
  TranslationsPagesQueryParams
} from "./views/TranslationsPages";
import TranslationsProductsComponent, {
  TranslationsProductsQueryParams
} from "./views/TranslationsProducts";
import TranslationsProductVariantsComponent, {
  TranslationsProductVariantsQueryParams
} from "./views/TranslationsProductVariants";
import TranslationsSaleComponent, {
  TranslationsSalesQueryParams
} from "./views/TranslationsSales";
import TranslationsShippingMethodComponent, {
  TranslationsShippingMethodQueryParams
} from "./views/TranslationsShippingMethod";
import TranslationsVouchersComponent, {
  TranslationsVouchersQueryParams
} from "./views/TranslationsVouchers";

const TranslationsEntities: React.FC = () => {
  const qs = parseQs(location.search.substr(1));
  const match = useParams();

  return (
    <TranslationsEntitiesComponent
      language={match.languageCode}
      params={qs}
    />
  );
};

const TranslationsCategories: React.FC = () => {
  const qs = parseQs(location.search.substr(1));
  const params: TranslationsCategoriesQueryParams = {
    activeField: qs.activeField
  };
  const match = useParams();
  return (
    <TranslationsCategoriesComponent
      id={decodeURIComponent(match.id)}
      languageCode={LanguageCodeEnum[match.languageCode]}
      params={params}
    />
  );
};
const TranslationsCollections: React.FC = () => {
  const qs = parseQs(location.search.substr(1));
  const params: TranslationsCollectionsQueryParams = {
    activeField: qs.activeField
  };
  const match = useParams();
  return (
    <TranslationsCollectionsComponent
      id={decodeURIComponent(match.id)}
      languageCode={LanguageCodeEnum[match.languageCode]}
      params={params}
    />
  );
};
const TranslationsProducts: React.FC = () => {
  const qs = parseQs(location.search.substr(1));
  const params: TranslationsProductsQueryParams = {
    activeField: qs.activeField
  };
  const match = useParams();
  return (
    <TranslationsProductsComponent
      id={decodeURIComponent(match.id)}
      languageCode={LanguageCodeEnum[match.languageCode]}
      params={params}
    />
  );
};

const TranslationsProductVariants: React.FC = () => {
  const qs = parseQs(location.search.substr(1));
  const params: TranslationsProductVariantsQueryParams = {
    activeField: qs.activeField
  };
  const match = useParams();
  return (
    <TranslationsProductVariantsComponent
      id={decodeURIComponent(match.id)}
      productId={decodeURIComponent(match.productId)}
      languageCode={LanguageCodeEnum[match.languageCode]}
      params={params}
    />
  );
};
const TranslationsSales: React.FC = () => {
  const qs = parseQs(location.search.substr(1));
  const params: TranslationsSalesQueryParams = {
    activeField: qs.activeField
  };
  const match = useParams();
  return (
    <TranslationsSaleComponent
      id={decodeURIComponent(match.id)}
      languageCode={LanguageCodeEnum[match.languageCode]}
      params={params}
    />
  );
};
const TranslationsVouchers: React.FC = () => {
  const qs = parseQs(location.search.substr(1));
  const params: TranslationsVouchersQueryParams = {
    activeField: qs.activeField
  };
  const match = useParams();
  return (
    <TranslationsVouchersComponent
      id={decodeURIComponent(match.id)}
      languageCode={LanguageCodeEnum[match.languageCode]}
      params={params}
    />
  );
};
const TranslationsPages: React.FC = () => {
  const qs = parseQs(location.search.substr(1));
  const params: TranslationsPagesQueryParams = {
    activeField: qs.activeField
  };
  const match = useParams();
  return (
    <TranslationsPagesComponent
      id={decodeURIComponent(match.id)}
      languageCode={LanguageCodeEnum[match.languageCode]}
      params={params}
    />
  );
};
const TranslationsAttributes: React.FC = () => {
  const qs = parseQs(location.search.substr(1));
  const params: TranslationsAttributesQueryParams = {
    activeField: qs.activeField
  };
  const match = useParams();
  return (
    <TranslationsAttributesComponent
      id={decodeURIComponent(match.id)}
      languageCode={LanguageCodeEnum[match.languageCode]}
      params={params}
    />
  );
};
const TranslationsShippingMethod: React.FC = () => {
  const qs = parseQs(location.search.substr(1));
  const params: TranslationsShippingMethodQueryParams = {
    activeField: qs.activeField
  };
  const match = useParams();
  return (
    <TranslationsShippingMethodComponent
      id={decodeURIComponent(match.id)}
      languageCode={LanguageCodeEnum[match.languageCode]}
      params={params}
    />
  );
};

const TranslationsRouter: React.FC = () => {
  const intl = useIntl();

  return (
    <>
      <WindowTitle title={intl.formatMessage(sectionNames.translations)} />
      <Routes>
        <Route
          path=""
          element={<TranslationsLanguageList />}
        />
        <Route
          path={languageEntitiesPath(":languageCode", "")}
          element={<TranslationsEntities />}
        />
        <Route
          path={languageEntityPath(
            "",
            ":languageCode",
            TranslatableEntities.products,
            ":id"
          )}
          element={<TranslationsProducts />}
        />
        <Route
          path={languageEntityPath(
            "",
            ":languageCode",
            TranslatableEntities.products,
            ":productId",
            TranslatableEntities.productVariants,
            ":id"
          )}
          element={<TranslationsProductVariants />}
        />
        <Route
          path={languageEntityPath(
            "",
            ":languageCode",
            TranslatableEntities.categories,
            ":id"
          )}
          element={<TranslationsCategories />}
        />
        <Route
          path={languageEntityPath(
            "",
            ":languageCode",
            TranslatableEntities.collections,
            ":id"
          )}
          element={<TranslationsCollections />}
        />
        <Route
          path={languageEntityPath(
            "",
            ":languageCode",
            TranslatableEntities.sales,
            ":id"
          )}
          element={<TranslationsSales />}
        />
        <Route
          path={languageEntityPath(
            "",
            ":languageCode",
            TranslatableEntities.vouchers,
            ":id"
          )}
          element={<TranslationsVouchers />}
        />
        <Route
          path={languageEntityPath(
            "",
            ":languageCode",
            TranslatableEntities.pages,
            ":id"
          )}
          element={<TranslationsPages />}
        />
        <Route
          path={languageEntityPath(
            "",
            ":languageCode",
            TranslatableEntities.attributes,
            ":id"
          )}
          element={<TranslationsAttributes />}
        />
        <Route
          path={languageEntityPath(
            "",
            ":languageCode",
            TranslatableEntities.shippingMethods,
            ":id"
          )}
          element={<TranslationsShippingMethod />}
        />
      </Routes>
    </>
  );
};
TranslationsRouter.displayName = "TranslationsRouter";
export default TranslationsRouter;
