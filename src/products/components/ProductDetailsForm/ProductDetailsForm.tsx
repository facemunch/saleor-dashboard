import { OutputData } from "@editorjs/editorjs";
import { CardContent, TextField } from "@mui/material";
import CardTitle from "@saleor/components/CardTitle";
import FormSpacer from "@saleor/components/FormSpacer";
import RichTextEditor, {
  RichTextEditorChange
} from "@saleor/components/RichTextEditor";
import { ProductErrorFragment } from "@saleor/fragments/types/ProductErrorFragment";
import { commonMessages } from "@saleor/intl";
import { getFormErrors, getProductErrorMessage } from "@saleor/utils/errors";
import React, { memo } from "react";
import { useIntl } from "react-intl";

import { IonCard } from "@ionic/react";
interface ProductDetailsFormProps {
  data: {
    description: OutputData;
    name: string;
    rating: number;
  };
  disabled?: boolean;
  errors: ProductErrorFragment[];

  onDescriptionChange: RichTextEditorChange;
  onChange(event: any);
}

export const ProductDetailsForm: React.FC<ProductDetailsFormProps> = ({
  data,
  disabled,
  errors,
  onDescriptionChange,
  onChange
}) => {
  const intl = useIntl();

  const formErrors = getFormErrors(["name", "description", "rating"], errors);

  return (
    <IonCard>
      <CardTitle
        title={intl.formatMessage(commonMessages.generalInformations)}
      />
      <CardContent>
        <TextField
          inputProps={{ "data-test-id": "product-name-input" }}
          error={!!formErrors.name}
          helperText={getProductErrorMessage(formErrors.name, intl)}
          disabled={disabled}
          fullWidth
          label={intl.formatMessage({
            defaultMessage: "Name",
            description: "product name"
          })}
          name="name"
          value={data.name}
          onChange={onChange}
        />
        <FormSpacer />
        <RichTextEditor
          data={data.description}
          disabled={disabled}
          error={!!formErrors.description}
          helperText={getProductErrorMessage(formErrors.description, intl)}
          label={intl.formatMessage(commonMessages.description)}
          name="description"
          onChange={onDescriptionChange}
        />
      </CardContent>
    </IonCard>
  );
};
export default memo(ProductDetailsForm);
