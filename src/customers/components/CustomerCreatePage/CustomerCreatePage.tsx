import { CardSpacer } from "@saleor/components/CardSpacer";
import { ConfirmButtonTransitionState } from "@saleor/components/ConfirmButton";
import Form from "@saleor/components/Form";
import Grid from "@saleor/components/Grid";
import Savebar from "@saleor/components/Savebar";
import { AccountErrorFragment } from "@saleor/fragments/types/AccountErrorFragment";
import useAddressValidation from "@saleor/hooks/useAddressValidation";
import { sectionNames } from "@saleor/intl";
import { Backlink } from "@saleor/macaw-ui";
import { AddressInput } from "@saleor/types/globalTypes";
import createSingleAutocompleteSelectHandler from "@saleor/utils/handlers/singleAutocompleteSelectChangeHandler";
import { mapCountriesToChoices } from "@saleor/utils/maps";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { AddressTypeInput } from "../../types";
import { CustomerCreateData_shop_countries } from "../../types/CustomerCreateData";
import CustomerCreateAddress from "../CustomerCreateAddress/CustomerCreateAddress";
import CustomerCreateDetails from "../CustomerCreateDetails";
import CustomerCreateNote from "../CustomerCreateNote/CustomerCreateNote";

import { IonContent, IonPage } from "@ionic/react";

export interface CustomerCreatePageFormData {
  customerFirstName: string;
  customerLastName: string;
  email: string;
  note: string;
}
export interface CustomerCreatePageSubmitData
  extends CustomerCreatePageFormData {
  address: AddressInput;
}

const initialForm: CustomerCreatePageFormData & AddressTypeInput = {
  city: "",
  cityArea: "",
  companyName: "",
  country: "",
  countryArea: "",
  customerFirstName: "",
  customerLastName: "",
  email: "",
  firstName: "",
  lastName: "",
  note: "",
  phone: "",
  postalCode: "",
  streetAddress1: "",
  streetAddress2: ""
};

export interface CustomerCreatePageProps {
  countries: CustomerCreateData_shop_countries[];
  disabled: boolean;
  errors: AccountErrorFragment[];
  saveButtonBar: ConfirmButtonTransitionState;
  onBack: () => void;
  onSubmit: (data: CustomerCreatePageSubmitData) => void;
}

const CustomerCreatePage: React.FC<CustomerCreatePageProps> = ({
  countries,
  disabled,
  errors: apiErrors,
  saveButtonBar,
  onBack,
  onSubmit
}: CustomerCreatePageProps) => {
  const intl = useIntl();

  const [countryDisplayName, setCountryDisplayName] = React.useState("");
  const countryChoices = mapCountriesToChoices(countries);
  const {
    errors: validationErrors,
    submit: handleSubmitWithAddress
  } = useAddressValidation<CustomerCreatePageFormData, void>(formData =>
    onSubmit({
      address: {
        city: formData.city,
        cityArea: formData.cityArea,
        companyName: formData.companyName,
        country: formData.country,
        countryArea: formData.countryArea,
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        postalCode: formData.postalCode,
        streetAddress1: formData.streetAddress1,
        streetAddress2: formData.streetAddress2
      },
      customerFirstName: formData.customerFirstName,
      customerLastName: formData.customerLastName,
      email: formData.email,
      note: formData.note
    })
  );

  const errors = [...apiErrors, ...validationErrors];

  const handleSubmit = (
    formData: CustomerCreatePageFormData & AddressTypeInput
  ) => {
    const areAddressInputFieldsModified = ([
      "city",
      "companyName",
      "country",
      "countryArea",
      "firstName",
      "lastName",
      "phone",
      "postalCode",
      "streetAddress1",
      "streetAddress2"
    ] as Array<keyof AddressTypeInput>)
      .map(key => formData[key])
      .some(field => field !== "");

    if (areAddressInputFieldsModified) {
      handleSubmitWithAddress(formData);
    } else {
      onSubmit({
        address: null,
        customerFirstName: formData.customerFirstName,
        customerLastName: formData.customerLastName,
        email: formData.email,
        note: formData.note
      });
    }
  };

  return (
    <Form initial={initialForm} onSubmit={handleSubmit} confirmLeave>
      {({ change, data, hasChanged, submit }) => {
        const handleCountrySelect = createSingleAutocompleteSelectHandler(
          change,
          setCountryDisplayName,
          countryChoices
        );

        return (
          <IonPage>
            <IonContent>
              <Backlink onClick={onBack}>
                <FormattedMessage {...sectionNames.customers} />
              </Backlink>
              {/* <PageHeader
                title={intl.formatMessage({
                  defaultMessage: "Create Customer",
                  description: "page header"
                })}
              /> */}
              <Grid>
                <div>
                  <CustomerCreateDetails
                    data={data}
                    disabled={disabled}
                    errors={errors}
                    onChange={change}
                  />
                  <CardSpacer />
                  <CustomerCreateAddress
                    countries={countryChoices}
                    countryDisplayName={countryDisplayName}
                    data={data}
                    disabled={disabled}
                    errors={errors}
                    onChange={change}
                    onCountryChange={handleCountrySelect}
                  />
                  <CardSpacer />
                  <CustomerCreateNote
                    data={data}
                    disabled={disabled}
                    errors={errors}
                    onChange={change}
                  />
                </div>
              </Grid>
              <div style={{ height: "100px" }} />
              <Savebar
                disabled={disabled || !hasChanged}
                state={saveButtonBar}
                onSubmit={submit}
                onCancel={onBack}
              />
            </IonContent>
          </IonPage>
        );
      }}
    </Form>
  );
};
CustomerCreatePage.displayName = "CustomerCreatePage";
export default CustomerCreatePage;
