import FilterBar from "@saleor/components/FilterBarIonic";
import { RefreshLimits_shop_limits } from "@saleor/components/Shop/types/RefreshLimits";
import { OrderDraftListUrlSortField } from "@saleor/orders/urls";
import { add } from "ionicons/icons";

import {
  FilterPageProps,
  ListActions,
  PageListProps,
  SortPage,
  TabPageProps
} from "@saleor/types";
import { IonContent, IonCard, IonFab, IonButton, IonIcon } from "@ionic/react";

import { isLimitReached } from "@saleor/utils/limits";
import React from "react";
import { useIntl } from "react-intl";

import { OrderDraftList_draftOrders_edges_node } from "../../types/OrderDraftList";
import OrderDraftList from "../OrderDraftList";
import OrderLimitReached from "../OrderLimitReached";
import {
  createFilterStructure,
  OrderDraftFilterKeys,
  OrderDraftListFilterOpts
} from "./filters";

export interface OrderDraftListPageProps
  extends PageListProps,
    ListActions,
    FilterPageProps<OrderDraftFilterKeys, OrderDraftListFilterOpts>,
    SortPage<OrderDraftListUrlSortField>,
    TabPageProps {
  limits: RefreshLimits_shop_limits;
  orders: OrderDraftList_draftOrders_edges_node[];
}

const options = [
  { label: "Order no. (highest first)", path: "?asc=true&sort=number" },
  { label: "Order no. (lowest first)", path: "?asc=false&sort=number" },
  { label: "Customer name A-Z", path: "?asc=true&sort=customer" },
  { label: "Customer name Z-A", path: "?asc=false&sort=customer" },
  { label: "Date (newest first)", path: "?asc=true&sort=date" },
  { label: "Date (oldest first)", path: "?asc=false&sort=date" }
];

const OrderDraftListPage: React.FC<OrderDraftListPageProps> = ({
  currentTab,
  disabled,
  filterOpts,
  initialSearch,
  limits,
  onAdd,
  onAll,
  onFilterChange,
  onSearchChange,
  onTabChange,
  onTabDelete,
  onTabSave,
  tabs,
  ...listProps
}) => {
  const intl = useIntl();
  const structure = createFilterStructure(intl, filterOpts);
  const limitsReached = isLimitReached(limits, "orders");

  return (
    <IonContent>
      <IonFab
        vertical="bottom"
        horizontal="end"
        slot="fixed"
        data-test-id="create-order-button"
      >
        <IonButton
          onClick={() => {
            onAdd();
          }}
          shape="round"
        >
          <IonIcon slot="start" icon={add} />
          New Order
        </IonButton>
      </IonFab>
      {limitsReached && <OrderLimitReached />}
      <IonCard>
        <FilterBar
          options={options}
          allTabLabel={intl.formatMessage({
            defaultMessage: "All Drafts",
            description: "tab name"
          })}
          currentTab={currentTab}
          filterStructure={structure}
          initialSearch={initialSearch}
          searchPlaceholder={intl.formatMessage({
            defaultMessage: "Search Draft"
          })}
          tabs={tabs}
          onAll={onAll}
          onFilterChange={onFilterChange}
          onSearchChange={onSearchChange}
          onTabChange={onTabChange}
          onTabDelete={onTabDelete}
          onTabSave={onTabSave}
        />
        <OrderDraftList disabled={disabled} {...listProps} />
      </IonCard>
      <div
        style={{
          height: "100px"
        }}
      />
    </IonContent>
  );
};
OrderDraftListPage.displayName = "OrderDraftListPage";
export default OrderDraftListPage;
