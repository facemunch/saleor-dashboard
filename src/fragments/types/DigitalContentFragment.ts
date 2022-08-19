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
}

export interface DigitalContentFragment_productVariant {
  __typename: "ProductVariant";
  id: string;
}

export interface DigitalContentFragment {
  __typename: "DigitalContent";
  id: string;
  urls: (DigitalContentFragment_urls | null)[] | null;
  productVariant: DigitalContentFragment_productVariant;
}
