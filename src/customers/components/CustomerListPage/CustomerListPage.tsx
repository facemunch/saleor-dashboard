import FilterBar from "@saleor/components/FilterBarIonic";
import { CustomerListUrlSortField } from "@saleor/customers/urls";
import {
  FilterPageProps,
  ListActions,
  PageListProps,
  SortPage,
  TabPageProps
} from "@saleor/types";
import React, { memo } from "react";
import { useIntl } from "react-intl";
import { IonContent, IonCard } from "@ionic/react";
import { ListCustomers_customers_edges_node } from "../../types/ListCustomers";
import CustomerList from "../CustomerList/CustomerList";
import {
  createFilterStructure,
  CustomerFilterKeys,
  CustomerListFilterOpts
} from "./filters";

export interface CustomerListPageProps
  extends PageListProps,
    ListActions,
    FilterPageProps<CustomerFilterKeys, CustomerListFilterOpts>,
    SortPage<CustomerListUrlSortField>,
    TabPageProps {
  customers: ListCustomers_customers_edges_node[];
}
const options = [
  { label: "Customer name A-Z", path: "?asc=true&sort=name" },
  { label: "Customer name Z-A", path: "?asc=false&sort=name" },
  { label: "Email A-Z ", path: "?asc=true&sort=email" },
  { label: "Email Z-A", path: "?asc=false&sort=email" },
  { label: "No. of order (most first)", path: "?asc=true&sort=orders" },
  { label: "No. of order (least first)", path: "?asc=false&sort=orders" }
];

const CustomerListPage: React.FC<CustomerListPageProps> = ({
  currentTab,
  filterOpts,
  initialSearch,
  onAdd,
  onAll,
  onFilterChange,
  onSearchChange,
  onTabChange,
  onTabDelete,
  onTabSave,
  tabs,
  ...customerListProps
}) => {
  const intl = useIntl();

  const structure = createFilterStructure(intl, filterOpts);

  return (
    <IonContent data-test-id="commerce-customers-tab">
      <div style={{ height: "20px" }} />
      <IonCard>
        <FilterBar
          options={options}
          allTabLabel={intl.formatMessage({
            defaultMessage: "All Customers",
            description: "tab name"
          })}
          currentTab={currentTab}
          filterStructure={structure}
          initialSearch={initialSearch}
          searchPlaceholder={intl.formatMessage({
            defaultMessage: "Search Customer"
          })}
          tabs={tabs}
          onAll={onAll}
          onFilterChange={onFilterChange}
          onSearchChange={onSearchChange}
          onTabChange={onTabChange}
          onTabDelete={onTabDelete}
          onTabSave={onTabSave}
        />
        <CustomerList {...customerListProps} />
      </IonCard>
      <div
        style={{
          height: "100px"
        }}
      />
    </IonContent>
  );
};
CustomerListPage.displayName = "CustomerListPage";
export default memo(CustomerListPage);
