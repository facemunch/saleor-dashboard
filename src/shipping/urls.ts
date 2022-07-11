import { ChannelsAction } from "@saleor/channels/urls";
import { stringifyQs } from "@saleor/utils/urls";
import urlJoin from "url-join";

import { BulkAction, Dialog, Pagination, SingleAction } from "../types";
import { ShippingMethodTypeEnum } from "../types/globalTypes";

export const shippingSection = "/c/shipping/";

export const shippingZonesListPath = shippingSection;
export type ShippingZonesListUrlDialog = "remove" | "remove-many";
export type ShippingZonesListUrlQueryParams = BulkAction &
  Dialog<ShippingZonesListUrlDialog> &
  Pagination &
  SingleAction;
export const shippingZonesListUrl = (
  params?: ShippingZonesListUrlQueryParams
) => shippingZonesListPath + "?" + stringifyQs(params);

export const shippingZonePath = (id: string, section = shippingZonesListPath) =>
  urlJoin(section, id);
export type ShippingZoneUrlDialog =
  | "add-rate"
  | "add-warehouse"
  | "assign-country"
  | "edit-rate"
  | "remove"
  | "remove-rate"
  | "unassign-country";

export type ShippingMethodActions = "assign-product" | "unassign-product";

export type ShippingZoneUrlQueryParams = Dialog<ShippingZoneUrlDialog> &
  SingleAction &
  Partial<{
    type: ShippingMethodTypeEnum;
  }> &
  Pagination;
export const shippingZoneUrl = (
  id: string,
  params?: ShippingZoneUrlQueryParams
) => shippingZonePath(encodeURIComponent(id)) + "?" + stringifyQs(params);

type ZipCodeRangeActions = "add-range" | "remove-range";
export type ShippingRateUrlDialog =
  | ZipCodeRangeActions
  | "remove"
  | ShippingMethodActions
  | ChannelsAction;

export type ShippingRateUrlQueryParams = Dialog<ShippingRateUrlDialog> &
  SingleAction &
  BulkAction &
  Pagination;
export type ShippingRateCreateUrlDialog = ZipCodeRangeActions | ChannelsAction;
export type ShippingRateCreateUrlQueryParams = Dialog<
  ShippingRateCreateUrlDialog
> &
  SingleAction;

export const shippingPriceRatesPath = (id: string, section = shippingZonesListPath) =>
  urlJoin(shippingZonePath(id, section), "price", "add");
export const shippingPriceRatesUrl = (
  id: string,
  params?: ShippingRateCreateUrlQueryParams
) => shippingPriceRatesPath(encodeURIComponent(id)) + "?" + stringifyQs(params);

export const shippingWeightRatesPath = (id: string, section = shippingZonesListPath) =>
  urlJoin(shippingZonePath(id, section), "weight", "add");
export const shippingWeightRatesUrl = (
  id: string,
  params?: ShippingRateCreateUrlQueryParams
) =>
  shippingWeightRatesPath(encodeURIComponent(id)) + "?" + stringifyQs(params);

export const shippingPriceRatesEditPath = (id: string, rateId: string, section = shippingZonesListPath) =>
  urlJoin(shippingZonePath(id, section), "price", rateId);
export const shippingPriceRatesEditUrl = (
  id: string,
  rateId: string,
  params?: ShippingRateUrlQueryParams
) =>
  shippingPriceRatesEditPath(
    encodeURIComponent(id),
    encodeURIComponent(rateId)
  ) +
  "?" +
  stringifyQs(params);

export const shippingWeightRatesEditPath = (id: string, rateId: string, section = shippingZonesListPath) =>
  urlJoin(shippingZonePath(id, section), "weight", rateId);
export const shippingWeightRatesEditUrl = (
  id: string,
  rateId: string,
  params?: ShippingRateUrlQueryParams
) =>
  shippingWeightRatesEditPath(
    encodeURIComponent(id),
    encodeURIComponent(rateId)
  ) +
  "?" +
  stringifyQs(params);

export const shippingZoneAddPath = urlJoin(shippingZonesListPath, "add");
export const shippingZoneAddUrl = shippingZoneAddPath + "?";
