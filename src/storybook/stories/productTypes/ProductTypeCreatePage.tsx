import { formError } from "@saleor/storybook/misc";
import { storiesOf } from "@storybook/react";
import React from "react";

import ProductTypeCreatePage, {
  ProductTypeCreatePageProps,
  ProductTypeForm
} from "../../../productTypes/components/ProductTypeCreatePage";
import {
  ProductTypeKindEnum,
  WeightUnitsEnum
} from "../../../types/globalTypes";
import Decorator from "../../Decorator";

const props: Omit<ProductTypeCreatePageProps, "classes"> = {
  defaultWeightUnit: "kg" as WeightUnitsEnum,
  disabled: false,
  errors: [],
  onBack: () => undefined,
  onSubmit: () => undefined,
  pageTitle: "+ Product Type",
  saveButtonBarState: "default",
  taxTypes: [],
  kind: ProductTypeKindEnum.NORMAL,
  onChangeKind: () => undefined
};

storiesOf("Views / Product types / Create product type", module)
  .addDecorator(Decorator)
  .add("default", () => <ProductTypeCreatePage {...props} />)
  .add("loading", () => (
    <ProductTypeCreatePage {...props} disabled={true} pageTitle={undefined} />
  ))
  .add("form errors", () => (
    <ProductTypeCreatePage
      {...props}
      errors={(["name"] as Array<keyof ProductTypeForm>).map(formError)}
    />
  ));
