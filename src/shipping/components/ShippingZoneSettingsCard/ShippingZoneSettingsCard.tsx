import { Card, CardContent, Divider } from "@mui/material";
import { BaseChannels_channels } from "@saleor/channels/types/BaseChannels";
import CardTitle from "@saleor/components/CardTitle";
import { MultiAutocompleteChoiceType } from "@saleor/components/MultiAutocompleteSelectField";
import { FormChange } from "@saleor/hooks/useForm";
import React, { useEffect } from "react";
import { defineMessages, useIntl } from "react-intl";
import { ShippingZone_shippingZone } from "@saleor/shipping/types/ShippingZone";

import { FormData } from "../../components/ShippingZoneDetailsPage/types";
import ChannelsSection from "./ChannelsSection";
import WarehousesSection from "./WarehousesSection";

const messages = defineMessages({
  title: {
    defaultMessage: "Settings",
    description: "ShippingZoneSettingsCard title"
  }
});

export interface ShippingZoneSettingsCardProps {
  formData: FormData;
  warehousesDisplayValues: MultiAutocompleteChoiceType[];
  warehousesChoices: MultiAutocompleteChoiceType[];
  onWarehouseAdd: () => void;
  onWarehouseChange: FormChange;
  hasMoreWarehouses: boolean;
  selectedChannelId?: string;
  onFetchMoreWarehouses: () => void;
  // submit?: () => void;
  onWarehousesSearchChange: (query: string) => void;
  channelsDisplayValues: MultiAutocompleteChoiceType[];
  onChannelChange: FormChange;
  allChannels?: BaseChannels_channels[];
  shippingZone?: ShippingZone_shippingZone;
  loading: boolean;
}

export const ShippingZoneSettingsCard: React.FC<ShippingZoneSettingsCardProps> = ({
  formData,
  warehousesDisplayValues,
  hasMoreWarehouses,
  loading,
  warehousesChoices,
  onFetchMoreWarehouses,
  // selectedChannelId,
  onWarehousesSearchChange,
  onWarehouseAdd,
  // shippingZone,
  onWarehouseChange,
  allChannels,
  // submit,
  onChannelChange,
  channelsDisplayValues
}) => {
  const intl = useIntl();

  return (
    <Card>
      <CardTitle title={intl.formatMessage(messages.title)} />
      <CardContent>
        <ChannelsSection
          channelsDisplayValues={channelsDisplayValues}
          onChange={onChannelChange}
          allChannels={allChannels}
          selectedChannels={formData.channels}
        />
      </CardContent>
      <Divider />
      <CardContent>
        <WarehousesSection
          onAdd={onWarehouseAdd}
          onSearchChange={onWarehousesSearchChange}
          onChange={onWarehouseChange}
          onFetchMore={onFetchMoreWarehouses}
          displayValues={warehousesDisplayValues}
          choices={warehousesChoices}
          selectedWarehouses={formData.warehouses}
          hasMore={hasMoreWarehouses}
          loading={loading}
        />
      </CardContent>
    </Card>
  );
};

export default ShippingZoneSettingsCard;
