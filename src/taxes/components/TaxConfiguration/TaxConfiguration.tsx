import { Button, Card, CardActions, CardContent } from "@mui/material";
import CardTitle from "@saleor/components/CardTitle";
import ControlledCheckbox from "@saleor/components/ControlledCheckbox";
import FormSpacer from "@saleor/components/FormSpacer";
import Hr from "@saleor/components/Hr";
import { sectionNames } from "@saleor/intl";
import { makeStyles } from "@saleor/macaw-ui";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { IonCard } from "@ionic/react";
import { FormData } from "../CountryListPage";

interface TaxConfigurationProps {
  data: FormData;
  disabled: boolean;
  onChange: (event: React.ChangeEvent<any>) => void;
  onTaxFetch: () => void;
}

const useStyles = makeStyles(
  {
    content: {
      paddingBottom: 0
    }
  },
  { name: "TaxConfiguration" }
);

export const TaxConfiguration: React.FC<TaxConfigurationProps> = props => {
  const { data, disabled, onChange, onTaxFetch } = props;

  const classes = useStyles(props);
  const intl = useIntl();

  return (
    <IonCard>
      <CardTitle title={intl.formatMessage(sectionNames.configuration)} />
      <CardContent className={classes.content}>
        <ControlledCheckbox
          name={"includeTax" as keyof FormData}
          label={intl.formatMessage({
            defaultMessage: "All products prices are entered with tax included"
          })}
          checked={data.includeTax}
          onChange={onChange}
          disabled={disabled}
        />
        <FormSpacer />
        <ControlledCheckbox
          name={"showGross" as keyof FormData}
          label={intl.formatMessage({
            defaultMessage: "Show gross prices to customers in the storefront"
          })}
          checked={data.showGross}
          onChange={onChange}
          disabled={disabled}
        />
        <FormSpacer />
        <ControlledCheckbox
          name={"chargeTaxesOnShipping" as keyof FormData}
          label={intl.formatMessage({
            defaultMessage: "Charge taxes on shipping rates"
          })}
          checked={data.chargeTaxesOnShipping}
          onChange={onChange}
          disabled={disabled}
        />
        <FormSpacer />
      </CardContent>
      <Hr />
      <CardActions>
        <Button disabled={disabled} onClick={onTaxFetch} color="primary">
          <FormattedMessage defaultMessage="Fetch taxes" description="button" />
        </Button>
      </CardActions>
    </IonCard>
  );
};
export default TaxConfiguration;
