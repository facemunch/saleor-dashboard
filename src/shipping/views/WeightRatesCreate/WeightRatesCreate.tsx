import { IonContent } from "@ionic/react";
import {
  createShippingChannels,
  createSortedShippingChannels
} from "@saleor/channels/utils";
import ChannelsAvailabilityDialog from "@saleor/components/ChannelsAvailabilityDialog";
import { WindowTitle } from "@saleor/components/WindowTitle";
import useChannels from "@saleor/hooks/useChannels";
import useNavigator from "@saleor/hooks/useNavigator";
import { sectionNames } from "@saleor/intl";
import ShippingZoneRatesCreatePage from "@saleor/shipping/components/ShippingZoneRatesCreatePage";
import { useShippingRateCreator } from "@saleor/shipping/handlers";
import { useShippingZoneChannels } from "@saleor/shipping/queries";
import {
  ShippingRateCreateUrlDialog,
  ShippingRateCreateUrlQueryParams,
  shippingWeightRatesUrl,
  shippingZoneUrl
} from "@saleor/shipping/urls";
import postalCodesReducer from "@saleor/shipping/views/reducer";
import { filterPostalCodes } from "@saleor/shipping/views/utils";
import {
  PostalCodeRuleInclusionTypeEnum,
  ShippingMethodTypeEnum
} from "@saleor/types/globalTypes";
import createDialogActionHandlers from "@saleor/utils/handlers/dialogActionHandlers";
import React from "react";
import { useIntl } from "react-intl";

export interface WeightRatesCreateProps {
  id: string;
  params: ShippingRateCreateUrlQueryParams;
}

export const WeightRatesCreate: React.FC<WeightRatesCreateProps> = ({
  id,
  params
}) => {
  const navigate = useNavigator();
  const intl = useIntl();

  const {
    data: shippingZoneData,
    loading: channelsLoading
  } = useShippingZoneChannels({
    displayLoader: true,
    variables: { id }
  });

  const [openModal, closeModal] = createDialogActionHandlers<
    ShippingRateCreateUrlDialog,
    ShippingRateCreateUrlQueryParams
  >(navigate, params => shippingWeightRatesUrl(id, params), params);

  const shippingChannels = createShippingChannels(
    shippingZoneData?.shippingZone?.channels
  );
  const allChannels = createSortedShippingChannels(
    shippingZoneData?.shippingZone?.channels
  );

  const {
    channelListElements,
    channelsToggle,
    currentChannels,
    handleChannelsConfirm,
    handleChannelsModalClose,
    handleChannelsModalOpen,
    isChannelSelected,
    isChannelsModalOpen,
    setCurrentChannels,
    toggleAllChannels
  } = useChannels(shippingChannels, params?.action, { closeModal, openModal });

  const [state, dispatch] = React.useReducer(postalCodesReducer, {
    codesToDelete: [],
    havePostalCodesChanged: false,
    inclusionType: PostalCodeRuleInclusionTypeEnum.EXCLUDE,
    originalCodes: [],
    postalCodeRules: []
  });

  const {
    channelErrors,
    createShippingRate,
    errors,
    status
  } = useShippingRateCreator(
    id,
    ShippingMethodTypeEnum.WEIGHT,
    state.postalCodeRules,
    state.inclusionType
  );

  const handleBack = () => navigate(shippingZoneUrl(id));

  const onPostalCodeInclusionChange = (
    inclusion: PostalCodeRuleInclusionTypeEnum
  ) => {
    dispatch({
      inclusionType: inclusion,
      postalCodeRules: []
    });
  };

  const onPostalCodeUnassign = code => {
    dispatch({
      havePostalCodesChanged: true,
      postalCodeRules: filterPostalCodes(state.postalCodeRules, code)
    });
  };

  return (
    <>
      <WindowTitle title={intl.formatMessage(sectionNames.shipping)} />
      {!!allChannels?.length && (
        <ChannelsAvailabilityDialog
          isSelected={isChannelSelected}
          disabled={!channelListElements.length}
          channels={allChannels}
          onChange={channelsToggle}
          onClose={handleChannelsModalClose}
          open={isChannelsModalOpen}
          title={intl.formatMessage({
            defaultMessage: "Manage Channels Availability"
          })}
          confirmButtonState="default"
          selected={channelListElements.length}
          onConfirm={handleChannelsConfirm}
          toggleAll={toggleAllChannels}
        />
      )}
      <ShippingZoneRatesCreatePage
        allChannelsCount={allChannels?.length}
        shippingChannels={currentChannels}
        disabled={channelsLoading || status === "loading"}
        saveButtonBarState={status}
        onSubmit={createShippingRate}
        onBack={handleBack}
        errors={errors}
        channelErrors={channelErrors}
        postalCodes={state.postalCodeRules}
        openChannelsModal={handleChannelsModalOpen}
        onChannelsChange={setCurrentChannels}
        onPostalCodeAssign={() => openModal("add-range")}
        onPostalCodeUnassign={onPostalCodeUnassign}
        onPostalCodeInclusionChange={onPostalCodeInclusionChange}
        variant={ShippingMethodTypeEnum.WEIGHT}
      />
    </>
  );
};

export default WeightRatesCreate;
