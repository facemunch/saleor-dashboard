import useAppChannel from "@saleor/components/AppLayout/AppChannelContext";
import { useShopLimitsQuery } from "@saleor/components/Shop/query";
import useListSettings from "@saleor/hooks/useListSettings";
import useNavigator from "@saleor/hooks/useNavigator";
import useNotifier from "@saleor/hooks/useNotifier";
import usePaginator, {
  createPaginationState
} from "@saleor/hooks/usePaginator";
import { ListViews } from "@saleor/types";
import createDialogActionHandlers from "@saleor/utils/handlers/dialogActionHandlers";
import createFilterHandlers from "@saleor/utils/handlers/filterHandlers";
import createSortHandler from "@saleor/utils/handlers/sortHandler";
import { mapEdgesToItems, mapNodeToChoice } from "@saleor/utils/maps";
import { getSortParams } from "@saleor/utils/sort";
import React, { memo } from "react";
import { useIntl } from "react-intl";

import OrderListPage from "../../components/OrderListPage/OrderListPage";
import { useOrderDraftCreateMutation } from "../../mutations";
import { useOrderListQuery } from "../../queries";
import { OrderDraftCreate } from "../../types/OrderDraftCreate";
import {
  orderListUrl,
  OrderListUrlDialog,
  OrderListUrlQueryParams,
  orderSettingsPath,
  orderUrl
} from "../../urls";
import {
  getFilterOpts,
  getFilterQueryParam,
  getFiltersCurrentTab,
  getFilterTabs,
  getFilterVariables
} from "./filters";
import { getSortQueryVariables } from "./sort";

interface OrderListProps {
  params: OrderListUrlQueryParams;
}

export const OrderList: React.FC<OrderListProps> = ({ params }) => {
  const navigate = useNavigator();
  const notify = useNotifier();
  const paginate = usePaginator();
  const { updateListSettings, settings } = useListSettings(
    ListViews.ORDER_LIST
  );

  const intl = useIntl();

  const handleCreateOrderCreateSuccess = (data: OrderDraftCreate) => {
    notify({
      status: "success",
      text: intl.formatMessage({
        defaultMessage: "Order draft successfully created"
      })
    });
    navigate(orderUrl(data.draftOrderCreate.order.id));
  };

  const [createOrder] = useOrderDraftCreateMutation({
    onCompleted: handleCreateOrderCreateSuccess
  });

  const { channel, availableChannels } = useAppChannel(false);

  const channelOpts = availableChannels
    ? mapNodeToChoice(availableChannels)
    : null;

  const tabs = getFilterTabs();

  const currentTab = getFiltersCurrentTab(params, tabs);

  const [
    changeFilters,
    resetFilters,
    handleSearchChange
  ] = createFilterHandlers({
    createUrl: orderListUrl,
    getFilterQueryParam,
    navigate,
    params
  });

  const [openModal, closeModal] = createDialogActionHandlers<
    OrderListUrlDialog,
    OrderListUrlQueryParams
  >(navigate, orderListUrl, params);

  const handleTabChange = (tab: number) =>
    navigate(
      orderListUrl({
        activeTab: tab.toString(),
        ...getFilterTabs()[tab - 1].data
      })
    );

  const paginationState = createPaginationState(settings.rowNumber, params);

  const queryVariables = React.useMemo(
    () => ({
      ...paginationState,
      filter: getFilterVariables(params),
      sort: getSortQueryVariables(params)
    }),
    [params, settings.rowNumber]
  );
  const { data, loading } = useOrderListQuery({
    displayLoader: true,
    variables: queryVariables
  });

  const { loadNextPage, loadPreviousPage, pageInfo } = paginate(
    data?.orders?.pageInfo,
    paginationState,
    params
  );

  const handleSort = createSortHandler(navigate, orderListUrl, params);

  return (
    <>
      <OrderListPage
        settings={settings}
        currentTab={currentTab}
        disabled={loading}
        loading={loading}
        filterOpts={getFilterOpts(params, channelOpts)}
        orders={mapEdgesToItems(data?.orders)}
        pageInfo={pageInfo}
        sort={getSortParams(params)}
        onAdd={() => {
          createOrder({
            variables: {
              input: { channelId: channel?.id }
            }
          });
        }}
        onNextPage={loadNextPage}
        onPreviousPage={loadPreviousPage}
        onUpdateListSettings={updateListSettings}
        onRowClick={id => () => navigate(orderUrl(id))}
        onSort={handleSort}
        onSearchChange={handleSearchChange}
        onFilterChange={changeFilters}
        onTabSave={() => openModal("save-search")}
        onTabDelete={() => openModal("delete-search")}
        onTabChange={handleTabChange}
        initialSearch={params.query || ""}
        tabs={getFilterTabs().map(tab => tab.name)}
        onAll={resetFilters}
        onSettingsOpen={() => navigate(orderSettingsPath)}
      />
    </>
  );
};

export default memo(OrderList);
