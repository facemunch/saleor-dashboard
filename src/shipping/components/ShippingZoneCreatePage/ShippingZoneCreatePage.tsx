import CardSpacer from "@saleor/components/CardSpacer";
import { ConfirmButtonTransitionState } from "@saleor/components/ConfirmButton";
import CountryList from "@saleor/components/CountryList";
import Form from "@saleor/components/Form";
import Grid from "@saleor/components/Grid";
import Savebar from "@saleor/components/Savebar";
import { CountryFragment } from "@saleor/fragments/types/CountryFragment";
import { ShippingErrorFragment } from "@saleor/fragments/types/ShippingErrorFragment";
import React, { RefObject } from "react";
import { defineMessages, useIntl } from "react-intl";

import { IonContent } from "@ionic/react";

import ShippingZoneCountriesAssignDialog from "../ShippingZoneCountriesAssignDialog";
import ShippingZoneInfo from "../ShippingZoneInfo";
import PageHeader from "@saleor/components/PageHeader";

export interface FormData {
  countries: string[];
  default: boolean;
  description: string;
  name: string;
}

const messages = defineMessages({
  countries: {
    defaultMessage: "Countries",
    description: "country list header"
  },
  createZone: {
    defaultMessage: "Create New Shipping Zone",
    description: "section header"
  },
  defaultZone: {
    defaultMessage:
      "This is default shipping zone, which means that it covers all of the countries which are not assigned to other shipping zones"
  },
  noCountriesAssigned: {
    defaultMessage:
      "Currently, there are no countries assigned to this shipping zone"
  }
});

export interface ShippingZoneCreatePageProps {
  countries: CountryFragment[];
  disabled: boolean;
  errors: ShippingErrorFragment[];
  saveButtonBarState: ConfirmButtonTransitionState;
  onBack: () => void;
  onSubmit: (data: FormData) => void;
  shippingCreateModalRef: RefObject<HTMLIonModalElement>;
}

const ShippingZoneCreatePage: React.FC<ShippingZoneCreatePageProps> = ({
  countries,
  disabled,
  errors,
  onBack,
  onSubmit,
  saveButtonBarState,
  shippingCreateModalRef
}) => {
  const intl = useIntl();
  const [isModalOpened, setModalStatus] = React.useState(false);
  const toggleModal = () => setModalStatus(!isModalOpened);

  const initialForm: FormData = {
    countries: [],
    default: false,
    description: "",
    name: ""
  };

  return (
    <IonContent data-test-id="shipping-zone-create">
      <Form initial={initialForm} onSubmit={onSubmit}>
        {({ change, data, hasChanged, submit }) => (
          <>
            <PageHeader title={intl.formatMessage(messages.createZone)} />
            <Grid>
              <div>
                <ShippingZoneInfo
                  data={data}
                  disabled={disabled}
                  errors={errors}
                  onChange={change}
                />
                <CardSpacer />
                <CountryList
                  countries={data.countries.map(selectedCountry =>
                    countries.find(country => country.code === selectedCountry)
                  )}
                  disabled={disabled}
                  emptyText={
                    data.default
                      ? intl.formatMessage(messages.defaultZone)
                      : intl.formatMessage(messages.noCountriesAssigned)
                  }
                  onCountryAssign={toggleModal}
                  onCountryUnassign={countryCode =>
                    change({
                      target: {
                        name: "countries",
                        value: data.countries.filter(
                          country => country !== countryCode
                        )
                      }
                    } as any)
                  }
                  title={intl.formatMessage(messages.countries)}
                />
              </div>
              <div style={{ height: "100px" }} />
            </Grid>
            <Savebar
              disabled={disabled || !hasChanged}
              onCancel={onBack}
              onSubmit={submit}
              state={saveButtonBarState}
            />

            <ShippingZoneCountriesAssignDialog
              open={isModalOpened}
              shippingCreateModalRef={shippingCreateModalRef}
              onConfirm={formData => {
                change({
                  target: {
                    name: "countries",
                    value: formData.restOfTheWorld ? [] : formData.countries
                  }
                } as any);
                toggleModal();
              }}
              confirmButtonState="default"
              countries={countries}
              initial={data.countries}
              isDefault={data.default}
              onClose={toggleModal}
            />
          </>
        )}
      </Form>
    </IonContent>
  );
};
ShippingZoneCreatePage.displayName = "ShippingZoneCreatePage";
export default ShippingZoneCreatePage;
