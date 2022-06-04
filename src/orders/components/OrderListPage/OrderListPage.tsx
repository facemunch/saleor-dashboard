import FilterBar from "@saleor/components/FilterBarIonic";
import { RefreshLimits_shop_limits } from "@saleor/components/Shop/types/RefreshLimits";
import { makeStyles } from "@saleor/macaw-ui";
import { OrderListUrlSortField } from "@saleor/orders/urls";
import { FilterPageProps, PageListProps, SortPage } from "@saleor/types";
import { isLimitReached } from "@saleor/utils/limits";
import React from "react";
import { useIntl } from "react-intl";

import { IonContent, IonCard, IonFab, IonButton, IonIcon } from "@ionic/react";

import { add } from "ionicons/icons";

import { OrderList_orders_edges_node } from "../../types/OrderList";
import OrderLimitReached from "../OrderLimitReached";
import OrderList from "../OrderList";
import {
  createFilterStructure,
  OrderFilterKeys,
  OrderListFilterOpts
} from "./filters";

export interface OrderListPageProps
  extends PageListProps,
    FilterPageProps<OrderFilterKeys, OrderListFilterOpts>,
    SortPage<OrderListUrlSortField> {
  limits: RefreshLimits_shop_limits;
  orders: OrderList_orders_edges_node[];
  onSettingsOpen: () => void;
}

const useStyles = makeStyles(
  theme => ({
    settings: {
      marginRight: theme.spacing(2)
    }
  }),
  { name: "OrderListPage" }
);

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
  const classes = useStyles({});
  const filterStructure = createFilterStructure(intl, filterOpts);
  const limitsReached = isLimitReached(limits, "orders");

  return (
    <IonContent>
      <IonFab
        vertical="bottom"
        horizontal="end"
        slot="fixed"
        style={{
          marginBottom: "50px"
        }}
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

      {/* {!!onSettingsOpen && (
        <CardMenu
          className={classes.settings}
          menuItems={[
            {
              label: intl.formatMessage({
                defaultMessage: "Order Settings",
                description: "button"
              }),
              onSelect: onSettingsOpen
            }
          ]}
        />
      )} */}

      {limitsReached && <OrderLimitReached />}
      <IonCard>
        {/* <IonSegment
          value={"live"}
          onIonChange={e => console.log("Segment selected", e.detail.value)}
        >
          <IonSegmentButton value="live">
            <IonLabel>Live</IonLabel>
          </IonSegmentButton>
          <IonSegmentButton value="drafts">
            <IonLabel>Drafts</IonLabel>
          </IonSegmentButton>
        </IonSegment> */}
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
          filterStructure={filterStructure}
          searchPlaceholder={intl.formatMessage({
            defaultMessage: "Search Orders..."
          })}
        />
        <OrderList {...listProps} />
      </IonCard>
    </IonContent>
  );
};
OrderListPage.displayName = "OrderListPage";
export default OrderListPage;
