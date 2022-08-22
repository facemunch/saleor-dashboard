/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { ProductErrorCode } from "./../../types/globalTypes";

// ====================================================
// GraphQL mutation operation: DigitalContentUrlCreate
// ====================================================

export interface DigitalContentUrlCreate_digitalContentUrlCreate_errors {
  __typename: "ProductError";
  code: ProductErrorCode;
  field: string | null;
}

export interface DigitalContentUrlCreate_digitalContentUrlCreate_digitalContentUrl_content_urls {
  __typename: "DigitalContentUrl";
  id: string;
  url: string | null;
}

export interface DigitalContentUrlCreate_digitalContentUrlCreate_digitalContentUrl_content_productVariant {
  __typename: "ProductVariant";
  id: string;
}

export interface DigitalContentUrlCreate_digitalContentUrlCreate_digitalContentUrl_content {
  __typename: "DigitalContent";
  id: string;
  urls: (DigitalContentUrlCreate_digitalContentUrlCreate_digitalContentUrl_content_urls | null)[] | null;
  productVariant: DigitalContentUrlCreate_digitalContentUrlCreate_digitalContentUrl_content_productVariant;
}

export interface DigitalContentUrlCreate_digitalContentUrlCreate_digitalContentUrl {
  __typename: "DigitalContentUrl";
  id: string;
  url: string | null;
  content: DigitalContentUrlCreate_digitalContentUrlCreate_digitalContentUrl_content;
}

export interface DigitalContentUrlCreate_digitalContentUrlCreate {
  __typename: "DigitalContentUrlCreate";
  errors: DigitalContentUrlCreate_digitalContentUrlCreate_errors[];
  digitalContentUrl: DigitalContentUrlCreate_digitalContentUrlCreate_digitalContentUrl | null;
}

export interface DigitalContentUrlCreate {
  digitalContentUrlCreate: DigitalContentUrlCreate_digitalContentUrlCreate | null;
}

export interface DigitalContentUrlCreateVariables {
  content: string;
}
