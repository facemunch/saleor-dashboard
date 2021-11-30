import { stringifyQs } from "@saleor/utils/urls";
import urlJoin from "url-join";

import {
  ActiveTab,
  BulkAction,
  Dialog,
  Filters,
  Pagination,
  Sort,
  TabActionDialog
} from "../types";
import { CategoryPageTab } from "./components/CategoryUpdatePage";

const categorySectionUrl = "/categories/";

export const categoryListPath = categorySectionUrl;
export enum CategoryListUrlFiltersEnum {
  query = "query"
}
export type CategoryListUrlFilters = Filters<CategoryListUrlFiltersEnum>;
export type CategoryListUrlDialog = "delete" | TabActionDialog;
export enum CategoryListUrlSortField {
  name = "name",
  productCount = "products",
  subcategoryCount = "subcategories"
}
export type CategoryListUrlSort = Sort<CategoryListUrlSortField>;
export type CategoryListUrlQueryParams = ActiveTab &
  BulkAction &
  CategoryListUrlFilters &
  CategoryListUrlSort &
  Dialog<CategoryListUrlDialog> &
  Pagination;
export const categoryListUrl = (params?: CategoryListUrlQueryParams) =>
  categorySectionUrl + "?" + stringifyQs(params);

export const categoryPath = (id: string, section = categorySectionUrl) => urlJoin(section, id);
export type CategoryUrlDialog =
  | "delete"
  | "delete-categories"
  | "delete-products";
export type CategoryUrlQueryParams = BulkAction &
  Dialog<CategoryUrlDialog> &
  Pagination &
  ActiveTab<CategoryPageTab>;
export const categoryUrl = (id: string, params?: CategoryUrlQueryParams) =>
  categoryPath(encodeURIComponent(id)) + "?" + stringifyQs(params);

export const categoryAddPath = (parentId?: string, section = categorySectionUrl) => {
  if (parentId) {
    return urlJoin(categoryPath(parentId, section), "add");
  }
  return urlJoin(section, "add");
};
export const categoryAddUrl = (parentId?: string) =>
  categoryAddPath(parentId ? encodeURIComponent(parentId) : undefined);
