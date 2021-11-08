import { Pagination } from "@saleor/types";
import { stringifyQs } from "@saleor/utils/urls";
import urlJoin from "url-join";

import { TranslationsEntitiesListFilterTab } from "./components/TranslationsEntitiesListPage";

export enum TranslatableEntities {
  categories = "categories",
  products = "products",
  productVariants = "variants",
  collections = "collections",
  sales = "sales",
  vouchers = "vouchers",
  pages = "pages",
  attributes = "attributes",
  shippingMethods = "shippingMethods"
}

const translationsSection = "/translations/";

export const languageListPath = translationsSection;
export const languageListUrl = translationsSection;

export const languageEntitiesPath = (code: string, section = translationsSection) =>
  urlJoin(section, code);
export type LanguageEntitiesUrlQueryParams = Pagination &
  Partial<{
    query: string;
    tab: TranslationsEntitiesListFilterTab;
  }>;
export const languageEntitiesUrl = (
  code: string,
  params: LanguageEntitiesUrlQueryParams,
  section = translationsSection
) => { 
  console.log(section)
  return languageEntitiesPath(code, section) + "?" + stringifyQs(params);
}

export const languageEntityPath = (
  section = translationsSection,
  code: string,
  entity: TranslatableEntities,
  id: string,
  ...args: string[]
) => urlJoin(languageEntitiesPath(code, section), entity.toString(), id, ...args);
export const languageEntityUrl = (
  code: string,
  entity: TranslatableEntities,
  id: string,
  section = translationsSection,
  ...args: string[]
) => {
  console.log(section)
  return languageEntityPath(section, code, entity, encodeURIComponent(id), ...args);
}

export const productVariantUrl = (
  code: string,
  productId: string,
  variantId: string,
  section = translationsSection
) =>
  languageEntityUrl(
    code,
    TranslatableEntities.products,
    productId,
    section,
    TranslatableEntities.productVariants,
    variantId
  );
