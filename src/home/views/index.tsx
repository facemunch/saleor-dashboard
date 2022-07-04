import { channelsListUrl } from "@saleor/channels/urls";
import useAppChannel from "@saleor/components/AppLayout/AppChannelContext";
import useNavigator from "@saleor/hooks/useNavigator";
import useUser from "@saleor/hooks/useUser";
import { mapEdgesToItems } from "@saleor/utils/maps";
import React, { memo } from "react";

import { getDatePeriod, getUserName } from "../../misc";
import { orderListUrl } from "../../orders/urls";
import { productListUrl, productVariantEditUrl } from "../../products/urls";
import { OrderStatusFilter, StockAvailability } from "../../types/globalTypes";
import HomePage from "../components/HomePage";
import { useHomePage } from "../queries";

const HomeSection = () => {
  const navigate = useNavigator();
  const { user } = useUser();
  const { channel } = useAppChannel();
  const noChannel = !channel && typeof channel !== "undefined";

  const { data, loading } = useHomePage({
    displayLoader: true,
    skip: noChannel,
    variables: { channel: "usd", datePeriod: getDatePeriod(1) }
  });

  return (
    <HomePage
      loading={loading}
      activities={mapEdgesToItems(data?.activities)?.reverse()}
      orders={data?.ordersToday?.totalCount}
      sales={data?.salesToday?.gross}
      topProducts={mapEdgesToItems(data?.productTopToday)}
      onProductClick={(productId, variantId) =>
        navigate(productVariantEditUrl(productId, variantId))
      }
      onCreateNewChannelClick={() => {
        navigate(channelsListUrl());
      }}
      onOrdersToCaptureClick={() =>
        navigate(
          orderListUrl({
            status: [OrderStatusFilter.READY_TO_CAPTURE],
            channel: [channel?.id]
          })
        )
      }
      onOrdersToFulfillClick={() =>
        navigate(
          orderListUrl({
            status: [OrderStatusFilter.READY_TO_FULFILL],
            channel: [channel?.id]
          })
        )
      }
      onProductsOutOfStockClick={() =>
        navigate(
          productListUrl({
            stockStatus: StockAvailability.OUT_OF_STOCK,
            channel: channel?.slug
          })
        )
      }
      ordersToCapture={data?.ordersToCapture?.totalCount}
      ordersToFulfill={data?.ordersToFulfill?.totalCount}
      productsOutOfStock={data?.productsOutOfStock?.totalCount}
      userName={getUserName(user, true)}
      userPermissions={user?.userPermissions}
      noChannel={noChannel}
    />
  );
};

export default memo(HomeSection);
