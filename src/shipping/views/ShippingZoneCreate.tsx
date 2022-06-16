import useAppChannel from "@saleor/components/AppLayout/AppChannelContext";
import useNavigator from "@saleor/hooks/useNavigator";
import useNotifier from "@saleor/hooks/useNotifier";
import useShop from "@saleor/hooks/useShop";
import { commonMessages } from "@saleor/intl";
import { useWarehouseList } from "@saleor/warehouses/queries";
import React from "react";
import { useIntl } from "react-intl";

import ShippingZoneCreatePage from "../components/ShippingZoneCreatePage";
import { useShippingZoneCreate } from "../mutations";
import { shippingZonesListUrl, shippingZoneUrl } from "../urls";

const ShippingZoneCreate = ({ shippingCreateModalRef }) => {
  const navigate = useNavigator();
  const notify = useNotifier();
  const shop = useShop();
  const intl = useIntl();
  const { channel } = useAppChannel();
  const { data } = useWarehouseList({
    displayLoader: false,
    variables: {
      first: 1
    }
  });

  const [createShippingZone, createShippingZoneOpts] = useShippingZoneCreate({
    onCompleted: data => {
      if (data.shippingZoneCreate.errors.length === 0) {
        notify({
          status: "success",
          text: intl.formatMessage(commonMessages.savedChanges)
        });
        navigate(shippingZoneUrl(data.shippingZoneCreate.shippingZone.id));
      }
    },
    refetchQueries: ["ShippingZones"]
  });
  return (
    <ShippingZoneCreatePage
      shippingCreateModalRef={shippingCreateModalRef}
      countries={shop?.countries || []}
      disabled={createShippingZoneOpts.loading}
      errors={createShippingZoneOpts.data?.shippingZoneCreate.errors || []}
      onBack={() => navigate(shippingZonesListUrl())}
      onSubmit={formData => {
        createShippingZone({
          variables: {
            input: {
              ...formData,
              addChannels: [channel.id],
              addWarehouses:
                data.warehouses?.edges && data.warehouses.edges?.length > 0
                  ? [data.warehouses.edges[0].node.id]
                  : []
            }
          }
        });
        navigate(shippingZonesListUrl());
      }}
      saveButtonBarState={createShippingZoneOpts.status}
    />
  );
};
export default ShippingZoneCreate;
