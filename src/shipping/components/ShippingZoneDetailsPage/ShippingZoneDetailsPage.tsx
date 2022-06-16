import { BaseChannels_channels } from "@saleor/channels/types/BaseChannels";
import CardSpacer from "@saleor/components/CardSpacer";
import { ConfirmButtonTransitionState } from "@saleor/components/ConfirmButton";
import CountryList from "@saleor/components/CountryList";
import Form from "@saleor/components/Form";
import Grid from "@saleor/components/Grid";
import Metadata from "@saleor/components/Metadata/Metadata";
import PageHeader from "@saleor/components/PageHeader";
import Savebar from "@saleor/components/Savebar";
import { ShippingErrorFragment } from "@saleor/fragments/types/ShippingErrorFragment";
import { ShippingZoneDetailsFragment_warehouses } from "@saleor/fragments/types/ShippingZoneDetailsFragment";
import { SubmitPromise } from "@saleor/hooks/useForm";
import { ShippingZone_shippingZone } from "@saleor/shipping/types/ShippingZone";
import useMetadataChangeTrigger from "@saleor/utils/metadata/useMetadataChangeTrigger";
import React from "react";
import { defineMessages, useIntl } from "react-intl";

import { IonContent, IonPage } from "@ionic/react";

import { getStringOrPlaceholder } from "../../../misc";
import { ChannelProps, FetchMoreProps, SearchProps } from "../../../types";
import { ShippingMethodTypeEnum } from "../../../types/globalTypes";
import { FormData } from "../../components/ShippingZoneDetailsPage/types";
import ShippingZoneInfo from "../ShippingZoneInfo";
import ShippingZoneRates from "../ShippingZoneRates";
import { getInitialFormData } from "./utils";
import { MultiAutocompleteChoiceType } from "@saleor/components/MultiAutocompleteSelectField";
import useStateFromProps from "@saleor/hooks/useStateFromProps";
import { mapNodeToChoice } from "@saleor/utils/maps";
import { SingleAutocompleteChoiceType } from "@saleor/components/SingleAutocompleteSelectField";
import createMultiAutocompleteSelectHandler from "@saleor/utils/handlers/multiAutocompleteSelectChangeHandler";

const messages = defineMessages({
  countries: {
    defaultMessage: "Countries",
    description: "country list header"
  },
  defaultZone: {
    defaultMessage:
      "This is default shipping zone, which means that it covers all of the countries which are not assigned to other shipping zones"
  },
  noCountriesAssigned: {
    defaultMessage:
      "Currently, there are no countries assigned to this shipping zone"
  },
  shipping: {
    defaultMessage: "Shipping",
    description: "shipping section header"
  }
});

export interface ShippingZoneDetailsPageProps
  extends FetchMoreProps,
    SearchProps,
    ChannelProps {
  disabled: boolean;
  errors: ShippingErrorFragment[];
  saveButtonBarState: ConfirmButtonTransitionState;
  shippingZone: ShippingZone_shippingZone;
  warehouses: ShippingZoneDetailsFragment_warehouses[];
  onBack: () => void;
  onCountryAdd: () => void;
  onCountryRemove: (code: string) => void;
  onDelete: () => void;
  onPriceRateAdd: () => void;
  onPriceRateEdit: (id: string) => void;
  onRateRemove: (rateId: string) => void;
  onSubmit: (data: FormData) => SubmitPromise;
  onWarehouseAdd: () => void;
  onWeightRateAdd: () => void;
  onWeightRateEdit: (id: string) => void;
  allChannels?: BaseChannels_channels[];
}

function warehouseToChoice(
  warehouse: Record<"id" | "name", string>
): SingleAutocompleteChoiceType {
  return {
    label: warehouse.name,
    value: warehouse.id
  };
}

const ShippingZoneDetailsPage: React.FC<ShippingZoneDetailsPageProps> = ({
  disabled,
  errors,
  loading,
  onBack,
  onCountryAdd,
  onCountryRemove,
  onDelete,
  onPriceRateAdd,
  onPriceRateEdit,
  onRateRemove,
  onSubmit,
  onWeightRateAdd,
  onWeightRateEdit,
  saveButtonBarState,
  selectedChannelId,
  shippingZone,
  warehouses,
  allChannels
}) => {
  const intl = useIntl();
  const initialForm = getInitialFormData(shippingZone);

  const [warehouseDisplayValues, setWarehouseDisplayValues] = useStateFromProps<
    MultiAutocompleteChoiceType[]
  >(mapNodeToChoice(shippingZone?.warehouses));

  const warehouseChoices = warehouses.map(warehouseToChoice);

  const channelChoices = mapNodeToChoice(allChannels);

  const [channelsDisplayValues, setChannelDisplayValues] = useStateFromProps<
    MultiAutocompleteChoiceType[]
  >(mapNodeToChoice(shippingZone?.channels));

  const {
    makeChangeHandler: makeMetadataChangeHandler
  } = useMetadataChangeTrigger();

  return (
    <IonPage>
      <IonContent data-test-id="shipping-zone-details-page">
        <Form
          initial={initialForm}
          onSubmit={e => {
            console.log("onSubmit", e);
            onSubmit(e);
          }}
        >
          {({ change, data, hasChanged, submit, toggleValue }) => {
            const changeMetadata = makeMetadataChangeHandler(change);



            return (
              <>
                <PageHeader title={shippingZone?.name + " shipping zone"} />
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
                      countries={shippingZone?.countries}
                      disabled={disabled}
                      emptyText={getStringOrPlaceholder(
                        shippingZone?.default === undefined
                          ? undefined
                          : shippingZone.default
                          ? intl.formatMessage(messages.defaultZone)
                          : intl.formatMessage(messages.noCountriesAssigned)
                      )}
                      onCountryAssign={onCountryAdd}
                      onCountryUnassign={onCountryRemove}
                      title={intl.formatMessage(messages.countries)}
                    />
                    <CardSpacer />
                    <ShippingZoneRates
                      disabled={shippingZone?.channels.length === 0 || loading}
                      onRateAdd={onPriceRateAdd}
                      onRateEdit={onPriceRateEdit}
                      onRateRemove={onRateRemove}
                      rates={shippingZone?.shippingMethods?.filter(
                        method => method.type === ShippingMethodTypeEnum.PRICE
                      )}
                      variant="price"
                      selectedChannelId={selectedChannelId}
                      testId="add-price-rate"
                    />
                    <CardSpacer />
                    <ShippingZoneRates
                      disabled={shippingZone?.channels.length === 0 || loading}
                      onRateAdd={onWeightRateAdd}
                      onRateEdit={onWeightRateEdit}
                      onRateRemove={onRateRemove}
                      rates={shippingZone?.shippingMethods?.filter(
                        method => method.type === ShippingMethodTypeEnum.WEIGHT
                      )}
                      variant="weight"
                      selectedChannelId={selectedChannelId}
                      testId="add-weight-rate"
                    />
                    <CardSpacer />
                    <Metadata data={data} onChange={changeMetadata} />
                  </div>
                  <div style={{ height: "100px" }} />
                </Grid>
                <Savebar
                  disabled={disabled || !hasChanged}
                  onCancel={onBack}
                  onDelete={onDelete}
                  onSubmit={submit}
                  state={saveButtonBarState}
                />
              </>
            );
          }}
        </Form>
      </IonContent>
    </IonPage>
  );
};
ShippingZoneDetailsPage.displayName = "ShippingZoneDetailsPage";
export default ShippingZoneDetailsPage;
