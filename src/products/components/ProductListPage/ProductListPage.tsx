import FilterBar from "@saleor/components/FilterBarIonic";
import { ProductListColumns } from "@saleor/config";
import { GridAttributes_grid_edges_node } from "@saleor/products/types/GridAttributes";
import { ProductList_products_edges_node } from "@saleor/products/types/ProductList";
import {
  ChannelProps,
  FilterPageProps,
  ListActions,
  PageListProps
} from "@saleor/types";
import React, { memo } from "react";
import { useIntl } from "react-intl";

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
    ChannelProps {
  activeAttributeSortId: string;
  channelsCount: number;
  currencySymbol: string;
  loading: boolean;
  gridAttributes: GridAttributes_grid_edges_node[];
  products: ProductList_products_edges_node[];
}

export const ProductListPage: React.FC<ProductListPageProps> = memo(props => {
  const {
    channelsCount,
    currencySymbol,
    gridAttributes,
    initialSearch,
    loading,
    tabs,
    onAdd,
    onAll,
    onFilterChange,
    onFilterAttributeFocus,
    onSearchChange,
    onTabChange,
    selectedChannelId,
    ...listProps
  } = props;
  const intl = useIntl();

  return (
    <>
      <IonContent data-test-id="commerce-products-tab">
        <div style={{ height: "20px" }} />
        <IonCard>
          <FilterBar
            options={options}
            currencySymbol={currencySymbol}
            initialSearch={initialSearch}
            onAll={onAll}
            onFilterChange={onFilterChange}
            onFilterAttributeFocus={onFilterAttributeFocus}
            onSearchChange={onSearchChange}
            onTabChange={onTabChange}
            tabs={tabs}
            allTabLabel={intl.formatMessage({
              defaultMessage: "All Products",
              description: "tab name"
            })}
            searchPlaceholder={intl.formatMessage({
              defaultMessage: "Search Products..."
            })}
          />
          <ProductList
            {...listProps}
            loading={loading}
            gridAttributes={gridAttributes}
            channelsCount={channelsCount}
            selectedChannelId={selectedChannelId}
          />
        </IonCard>
        <div
          style={{
            height: "300px"
          }}
        />
      </IonContent>
    </>
  );
});
ProductListPage.displayName = "ProductListPage";
export default memo(ProductListPage);
