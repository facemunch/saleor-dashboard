import FilterBar from "@saleor/components/FilterBarIonic";
import { RefreshLimits_shop_limits } from "@saleor/components/Shop/types/RefreshLimits";
import { OrderListUrlSortField } from "@saleor/orders/urls";
import { FilterPageProps, PageListProps, SortPage } from "@saleor/types";
import React, { memo } from "react";
import { useIntl } from "react-intl";

import { IonContent, IonCard } from "@ionic/react";

import { OrderList_orders_edges_node } from "../../types/OrderList";
import OrderList from "../OrderList";
import {
  OrderFilterKeys,
  OrderListFilterOpts
} from "./filters";

export interface OrderListPageProps
  extends PageListProps,
    FilterPageProps<OrderFilterKeys, OrderListFilterOpts>,
    SortPage<OrderListUrlSortField> {
  limits: RefreshLimits_shop_limits;
  orders: OrderList_orders_edges_node[];
  loading?: boolean;
  onSettingsOpen: () => void;
}

const options = [
  { label: "Order no. (highest first)", path: "?asc=true&sort=number" },
  { label: "Order no. (lowest first)", path: "?asc=false&sort=number" },
  { label: "Customer name A-Z", path: "?asc=true&sort=customer" },
  { label: "Customer name Z-A", path: "?asc=false&sort=customer" },
  { label: "Date (newest first)", path: "?asc=true&sort=date" },
  { label: "Date (oldest first)", path: "?asc=false&sort=date" },
  { label: "Payment (paid first)", path: "?asc=true&sort=payment" },
  { label: "Payment (unpid first)", path: "?asc=false&sort=payment" },
  { label: "Fulfilment (fulfilled first)", path: "?asc=true&sort=status" },
  { label: "Fulfilment (unfulfilled first)", path: "?asc=false&sort=status" }
];

const OrderListPage: React.FC<OrderListPageProps> = ({
  currentTab,
  initialSearch,
  filterOpts,
  limits,
  tabs,
  onAdd,
  onAll,
  onSearchChange,
  onSettingsOpen,
  onFilterChange,
  onTabChange,
  onTabDelete,
  onTabSave,
  ...listProps
}) => {
  const intl = useIntl();
  return (
    <>
      <IonContent data-test-id="commerce-orders-tab">
        <div style={{ height: "20px" }} />
        <IonCard>
          <FilterBar
            options={options}
            currentTab={currentTab}
            initialSearch={initialSearch}
            onAll={onAll}
            onFilterChange={onFilterChange}
            onSearchChange={onSearchChange}
            onTabChange={onTabChange}
            onTabDelete={onTabDelete}
            onTabSave={onTabSave}
            tabs={tabs}
            allTabLabel={intl.formatMessage({
              defaultMessage: "All Orders",
              description: "tab name"
            })}
            searchPlaceholder={intl.formatMessage({
              defaultMessage: "Search Orders..."
            })}
          />
          <OrderList {...listProps} />
        </IonCard>
        <div
          style={{
            height: "300px"
          }}
        />
      </IonContent>
    </>
  );
};
OrderListPage.displayName = "OrderListPage";
export default memo(OrderListPage);
