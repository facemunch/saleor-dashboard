/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { ProductErrorCode } from "./../../types/globalTypes";

// ====================================================
// GraphQL mutation operation: DigitalContentDelete
// ====================================================

export interface DigitalContentDelete_digitalContentDelete_errors {
  __typename: "ProductError";
  code: ProductErrorCode;
  field: string | null;
}

export interface DigitalContentDelete_digitalContentDelete_variant_product_variants_digitalContent_urls {
  __typename: "DigitalContentUrl";
  id: string;
  url: string | null;
}

export interface DigitalContentDelete_digitalContentDelete_variant_product_variants_digitalContent_productVariant {
  __typename: "ProductVariant";
  id: string;
}

export interface DigitalContentDelete_digitalContentDelete_variant_product_variants_digitalContent {
  __typename: "DigitalContent";
  id: string;
  urls: (DigitalContentDelete_digitalContentDelete_variant_product_variants_digitalContent_urls | null)[] | null;
  productVariant: DigitalContentDelete_digitalContentDelete_variant_product_variants_digitalContent_productVariant;
}

export interface DigitalContentDelete_digitalContentDelete_variant_product_variants {
  __typename: "ProductVariant";
  id: string;
  digitalContent: DigitalContentDelete_digitalContentDelete_variant_product_variants_digitalContent | null;
}

export interface DigitalContentDelete_digitalContentDelete_variant_product {
  __typename: "Product";
  id: string;
  variants: (DigitalContentDelete_digitalContentDelete_variant_product_variants | null)[] | null;
}

export interface DigitalContentDelete_digitalContentDelete_variant {
  __typename: "ProductVariant";
  id: string;
  product: DigitalContentDelete_digitalContentDelete_variant_product;
}

export interface DigitalContentDelete_digitalContentDelete {
  __typename: "DigitalContentDelete";
  errors: DigitalContentDelete_digitalContentDelete_errors[];
  variant: DigitalContentDelete_digitalContentDelete_variant | null;
}

export interface DigitalContentDelete {
  digitalContentDelete: DigitalContentDelete_digitalContentDelete | null;
}

export interface DigitalContentDeleteVariables {
  variantId: string;
}
