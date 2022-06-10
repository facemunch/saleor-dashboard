import { Card, CardContent } from "@mui/material";
import CardTitle from "@saleor/components/CardTitle";
import SingleAutocompleteSelectField from "@saleor/components/SingleAutocompleteSelectField";
import { makeStyles } from "@saleor/macaw-ui";
import { ProductTypeDetails_taxTypes } from "@saleor/productTypes/types/ProductTypeDetails";
import React from "react";
import { useIntl } from "react-intl";

import { IonCard } from "@ionic/react";
import { maybe } from "../../../misc";
import { ProductTypeForm } from "../ProductTypeDetailsPage/ProductTypeDetailsPage";

interface ProductTypeTaxesProps {
  data: {
    taxType: string;
  };
  taxTypeDisplayName: string;
  taxTypes: ProductTypeDetails_taxTypes[];
  disabled: boolean;
  onChange: (event: React.ChangeEvent<any>) => void;
}

const useStyles = makeStyles(
  {
    root: {
      overflow: "visible"
    }
  },
  { name: "ProductTypeTaxes" }
);

const ProductTypeTaxes: React.FC<ProductTypeTaxesProps> = props => {
  const { data, disabled, taxTypes, taxTypeDisplayName, onChange } = props;
  const classes = useStyles(props);

  const intl = useIntl();

  return (
    <IonCard className={classes.root}>
      <CardTitle
        title={intl.formatMessage({
          defaultMessage: "Taxes",
          description: "section header",
          id: "productTypeTaxesHeader"
        })}
      />
      <CardContent>
        <SingleAutocompleteSelectField
          disabled={disabled}
          displayValue={taxTypeDisplayName}
          label={intl.formatMessage({
            defaultMessage: "Taxes",
            id: "productTypeTaxesInputLabel"
          })}
          name={"taxType" as keyof ProductTypeForm}
          onChange={onChange}
          value={data.taxType}
          choices={maybe(
            () =>
              taxTypes.map(c => ({ label: c.description, value: c.taxCode })),
            []
          )}
          InputProps={{
            autoComplete: "off"
          }}
        />
      </CardContent>
    </IonCard>
  );
};
ProductTypeTaxes.displayName = "ProductTypeTaxes";
export default ProductTypeTaxes;
