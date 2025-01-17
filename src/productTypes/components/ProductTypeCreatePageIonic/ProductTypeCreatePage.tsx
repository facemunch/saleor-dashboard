import CardSpacer from "@saleor/components/CardSpacer";
import { ConfirmButtonTransitionState } from "@saleor/components/ConfirmButton";
import Container from "@saleor/components/Container";
import Form from "@saleor/components/Form";
import Grid from "@saleor/components/Grid";
import Metadata, { MetadataFormData } from "@saleor/components/Metadata";
import PageHeader from "@saleor/components/PageHeader";
import Savebar from "@saleor/components/Savebar";
import { ChangeEvent, FormChange } from "@saleor/hooks/useForm";
import useStateFromProps from "@saleor/hooks/useStateFromProps";
import { sectionNames } from "@saleor/intl";
import { Backlink } from "@saleor/macaw-ui";
import { makeProductTypeKindChangeHandler } from "@saleor/productTypes/handlers";
import { ProductTypeDetails_taxTypes } from "@saleor/productTypes/types/ProductTypeDetails";
import { UserError } from "@saleor/types";
import {
  ProductTypeKindEnum,
  WeightUnitsEnum
} from "@saleor/types/globalTypes";
import useMetadataChangeTrigger from "@saleor/utils/metadata/useMetadataChangeTrigger";
import React from "react";
import { useIntl } from "react-intl";

import ProductTypeDetails from "../ProductTypeDetails/ProductTypeDetails";
import ProductTypeShipping from "../ProductTypeShipping/ProductTypeShipping";
import ProductTypeTaxes from "../ProductTypeTaxes/ProductTypeTaxes";
import { IonContent, IonPage } from "@ionic/react";

export interface ProductTypeForm extends MetadataFormData {
  name: string;
  kind: ProductTypeKindEnum;
  isShippingRequired: boolean;
  taxType: string;
  weight: number;
}

export interface ProductTypeCreatePageProps {
  errors: UserError[];
  defaultWeightUnit: WeightUnitsEnum;
  disabled: boolean;
  pageTitle: string;
  saveButtonBarState: ConfirmButtonTransitionState;
  taxTypes: ProductTypeDetails_taxTypes[];
  kind: ProductTypeKindEnum;
  onChangeKind: (kind: ProductTypeKindEnum) => void;
  onBack: () => void;
  onSubmit: (data: ProductTypeForm) => void;
}

const formInitialData: ProductTypeForm = {
  isShippingRequired: false,
  metadata: [],
  name: "",
  kind: ProductTypeKindEnum.NORMAL,
  privateMetadata: [],
  taxType: "",
  weight: 0
};

function handleTaxTypeChange(
  event: ChangeEvent,
  taxTypes: ProductTypeDetails_taxTypes[],
  formChange: FormChange,
  displayChange: (name: string) => void
) {
  formChange(event);
  displayChange(
    taxTypes.find(taxType => taxType.taxCode === event.target.value).description
  );
}

const ProductTypeCreatePage: React.FC<ProductTypeCreatePageProps> = ({
  defaultWeightUnit,
  disabled,
  errors,
  pageTitle,
  saveButtonBarState,
  taxTypes,
  kind,
  onChangeKind,
  onBack,
  onSubmit
}: ProductTypeCreatePageProps) => {
  const intl = useIntl();
  const [taxTypeDisplayName, setTaxTypeDisplayName] = useStateFromProps("");
  const {
    makeChangeHandler: makeMetadataChangeHandler
  } = useMetadataChangeTrigger();

  const initialData = {
    ...formInitialData,
    kind: kind || formInitialData.kind
  };

  return (
    <IonContent>
      <Form initial={initialData} onSubmit={onSubmit} confirmLeave>
        {({ change, data, hasChanged, submit }) => {
          const changeMetadata = makeMetadataChangeHandler(change);

          const changeKind = makeProductTypeKindChangeHandler(
            change,
            onChangeKind
          );

          return (
            <>
              <Backlink onClick={onBack}>
                {intl.formatMessage(sectionNames.productTypes)}
              </Backlink>
              <PageHeader title={pageTitle} />
              <Grid>
                <div>
                  <ProductTypeDetails
                    data={data}
                    disabled={disabled}
                    errors={errors}
                    onChange={change}
                    onKindChange={changeKind}
                  />
                  <CardSpacer />
                  <ProductTypeTaxes
                    disabled={disabled}
                    data={data}
                    taxTypes={taxTypes}
                    taxTypeDisplayName={taxTypeDisplayName}
                    onChange={event =>
                      handleTaxTypeChange(
                        event,
                        taxTypes,
                        change,
                        setTaxTypeDisplayName
                      )
                    }
                  />
                  <CardSpacer />
                  <Metadata data={data} onChange={changeMetadata} />
                </div>
                <div>
                  <ProductTypeShipping
                    disabled={disabled}
                    data={data}
                    weightUnit={defaultWeightUnit}
                    onChange={change}
                  />
                  <div style={{ height: "100px" }} />
                </div>
              </Grid>
              <Savebar
                onCancel={onBack}
                onSubmit={submit}
                disabled={disabled || !hasChanged}
                state={saveButtonBarState}
              />
            </>
          );
        }}
      </Form>
    </IonContent>
  );
};
ProductTypeCreatePage.displayName = "ProductTypeCreatePage";
export default ProductTypeCreatePage;
