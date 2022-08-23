/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: DigitalContentFragment
// ====================================================

export interface DigitalContentFragment_urls {
  __typename: "DigitalContentUrl";
  id: string;
  url: string | null;
  token: any;
}

export interface DigitalContentFragment_productVariant {
  __typename: "ProductVariant";
  id: string;
  name: string;
  sku: string | null;
}

export interface DigitalContentFragment {
  __typename: "DigitalContent";
  id: string;
  contentFile: string;
  urls: (DigitalContentFragment_urls | null)[] | null;
  automaticFulfillment: boolean;
  productVariant: DigitalContentFragment_productVariant;
}
