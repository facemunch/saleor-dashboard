/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { ProductErrorCode } from "./../../types/globalTypes";

// ====================================================
// GraphQL mutation operation: DigitalContentCreate
// ====================================================

export interface DigitalContentCreate_digitalContentCreate_errors {
  __typename: "ProductError";
  code: ProductErrorCode;
  field: string | null;
}

export interface DigitalContentCreate_digitalContentCreate_content_urls {
  __typename: "DigitalContentUrl";
  id: string;
  url: string | null;
}

export interface DigitalContentCreate_digitalContentCreate_content_productVariant {
  __typename: "ProductVariant";
  id: string;
}

export interface DigitalContentCreate_digitalContentCreate_content {
  __typename: "DigitalContent";
  id: string;
  urls: (DigitalContentCreate_digitalContentCreate_content_urls | null)[] | null;
  productVariant: DigitalContentCreate_digitalContentCreate_content_productVariant;
}

export interface DigitalContentCreate_digitalContentCreate_variant_product_variants_digitalContent_urls {
  __typename: "DigitalContentUrl";
  id: string;
  url: string | null;
}

export interface DigitalContentCreate_digitalContentCreate_variant_product_variants_digitalContent_productVariant {
  __typename: "ProductVariant";
  id: string;
}

export interface DigitalContentCreate_digitalContentCreate_variant_product_variants_digitalContent {
  __typename: "DigitalContent";
  id: string;
  urls: (DigitalContentCreate_digitalContentCreate_variant_product_variants_digitalContent_urls | null)[] | null;
  productVariant: DigitalContentCreate_digitalContentCreate_variant_product_variants_digitalContent_productVariant;
}

export interface DigitalContentCreate_digitalContentCreate_variant_product_variants {
  __typename: "ProductVariant";
  id: string;
  digitalContent: DigitalContentCreate_digitalContentCreate_variant_product_variants_digitalContent | null;
}

export interface DigitalContentCreate_digitalContentCreate_variant_product {
  __typename: "Product";
  id: string;
  variants: (DigitalContentCreate_digitalContentCreate_variant_product_variants | null)[] | null;
}

export interface DigitalContentCreate_digitalContentCreate_variant {
  __typename: "ProductVariant";
  id: string;
  product: DigitalContentCreate_digitalContentCreate_variant_product;
}

export interface DigitalContentCreate_digitalContentCreate {
  __typename: "DigitalContentCreate";
  errors: DigitalContentCreate_digitalContentCreate_errors[];
  content: DigitalContentCreate_digitalContentCreate_content | null;
  variant: DigitalContentCreate_digitalContentCreate_variant | null;
}

export interface DigitalContentCreate {
  digitalContentCreate: DigitalContentCreate_digitalContentCreate | null;
}

export interface DigitalContentCreateVariables {
  variantId: string;
  contentFile: any;
}
