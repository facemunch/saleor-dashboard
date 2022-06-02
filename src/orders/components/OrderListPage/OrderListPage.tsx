import { Button, Card } from "@mui/material";
import CardMenu from "@saleor/components/CardMenu";
import Container from "@saleor/components/Container";
import FilterBar from "@saleor/components/FilterBar";
import PageHeader from "@saleor/components/PageHeader";
import { RefreshLimits_shop_limits } from "@saleor/components/Shop/types/RefreshLimits";
import { sectionNames } from "@saleor/intl";
import { makeStyles } from "@saleor/macaw-ui";
import { OrderListUrlSortField } from "@saleor/orders/urls";
import { FilterPageProps, PageListProps, SortPage } from "@saleor/types";
import { hasLimits, isLimitReached } from "@saleor/utils/limits";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import {
  IonContent,
  IonCard,
  IonFab,
  IonFabButton,
  IonIcon
} from "@ionic/react";
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

        // disabled={limitReached}
      >
        <IonFabButton onClick={onAdd}>
          <IonIcon icon={add} />
        </IonFabButton>
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
        <FilterBar
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
