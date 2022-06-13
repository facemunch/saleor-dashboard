import FilterBar from "@saleor/components/FilterBarIonic";
import { ProductListColumns } from "@saleor/config";
import { AvailableInGridAttributes_availableInGrid_edges_node } from "@saleor/products/types/AvailableInGridAttributes";
import { GridAttributes_grid_edges_node } from "@saleor/products/types/GridAttributes";
import { ProductList_products_edges_node } from "@saleor/products/types/ProductList";
import {
  ChannelProps,
  FetchMoreProps,
  FilterPageProps,
  ListActions,
  PageListProps,
  SortPage
} from "@saleor/types";
import React from "react";
import { useIntl } from "react-intl";

import { ProductListUrlSortField } from "../../urls";
import ProductList from "../ProductList";
import { ProductFilterKeys, ProductListFilterOpts } from "./filters";

import { IonContent, IonCard } from "@ionic/react";

const options = [
  { label: "Product name A-Z", path: "?asc=true&sort=name" },
  { label: "Product name Z-A", path: "?asc=false&sort=name" },
  { label: "Price (lowest first)", path: "?asc=true&sort=price" },
  { label: "Price (highest first)", path: "?asc=false&sort=price" }
] as { label: string; path: string }[];

export interface ProductListPageProps
  extends PageListProps<ProductListColumns>,
    ListActions,
    FilterPageProps<ProductFilterKeys, ProductListFilterOpts>,
    FetchMoreProps,
    SortPage<ProductListUrlSortField>,
    ChannelProps {
  activeAttributeSortId: string;
  availableInGridAttributes: AvailableInGridAttributes_availableInGrid_edges_node[];
  channelsCount: number;
  currencySymbol: string;
  gridAttributes: GridAttributes_grid_edges_node[];
  totalGridAttributes: number;
  products: ProductList_products_edges_node[];
  onExport: () => void;
}

export const ProductListPage: React.FC<ProductListPageProps> = props => {
  const {
    channelsCount,
    currencySymbol,
    currentTab,
    defaultSettings,
    gridAttributes,
    availableInGridAttributes,
    filterOpts,
    hasMore,
    initialSearch,
    loading,
    settings,
    tabs,
    totalGridAttributes,
    onAdd,
    onAll,
    onExport,
    onFetchMore,
    onFilterChange,
    onFilterAttributeFocus,
    onSearchChange,
    onTabChange,
    onTabDelete,
    onTabSave,
    onUpdateListSettings,
    selectedChannelId,
    ...listProps
  } = props;
  const intl = useIntl();

  // const filterStructure = createFilterStructure(intl, filterOpts);
  return (
    <>
      <IonContent data-test-id="commerce-products-tab">
        <div style={{ height: "20px" }} />
        <IonCard>
          <FilterBar
            options={options}
            currencySymbol={currencySymbol}
            currentTab={currentTab}
            initialSearch={initialSearch}
            onAll={onAll}
            onFilterChange={onFilterChange}
            onFilterAttributeFocus={onFilterAttributeFocus}
            onSearchChange={onSearchChange}
            onTabChange={onTabChange}
            onTabDelete={onTabDelete}
            onTabSave={onTabSave}
            tabs={tabs}
            allTabLabel={intl.formatMessage({
              defaultMessage: "All Products",
              description: "tab name"
            })}
            // filterStructure={filterStructure}
            searchPlaceholder={intl.formatMessage({
              defaultMessage: "Search Products..."
            })}
          />
          <ProductList
            {...listProps}
            loading={loading}
            gridAttributes={gridAttributes}
            settings={settings}
            channelsCount={channelsCount}
            selectedChannelId={selectedChannelId}
            onUpdateListSettings={onUpdateListSettings}
          />
        </IonCard>
        <div
          style={{
            height: "100px"
          }}
        />
      </IonContent>
    </>
  );
};
ProductListPage.displayName = "ProductListPage";
export default ProductListPage;
