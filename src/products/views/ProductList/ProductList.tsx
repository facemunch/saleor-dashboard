import useAppChannel from "@saleor/components/AppLayout/AppChannelContext";
import {
  DEFAULT_INITIAL_PAGINATION_DATA,
  defaultListSettings,
  ProductListColumns
} from "@saleor/config";
import useBulkActions from "@saleor/hooks/useBulkActions";
import useListSettings from "@saleor/hooks/useListSettings";
import useNavigator from "@saleor/hooks/useNavigator";
import usePaginator, {
  createPaginationState
} from "@saleor/hooks/usePaginator";
import { useProductListQuery } from "@saleor/products/queries";
import { ProductListVariables } from "@saleor/products/types/ProductList";
import {
  productAddUrl,
  productListUrl,
  ProductListUrlQueryParams,
  ProductListUrlSortField,
  productUrl
} from "@saleor/products/urls";
import { ListViews } from "@saleor/types";
import createFilterHandlers from "@saleor/utils/handlers/filterHandlers";
import { mapEdgesToItems } from "@saleor/utils/maps";
import { getSortUrlVariables } from "@saleor/utils/sort";
import React, { useEffect } from "react";

import ProductListPage from "../../components/ProductListPage";
import {
  getFilterQueryParam,
  getFiltersCurrentTab,
  getFilterTabs,
  getFilterVariables
} from "./filters";
import { DEFAULT_SORT_KEY, getSortQueryVariables } from "./sort";

interface ProductListProps {
  params: ProductListUrlQueryParams;
}

export const ProductList: React.FC<ProductListProps> = ({ params }) => {
  const navigate = useNavigator();
  const paginate = usePaginator();
  const { isSelected, listElements, reset, toggle, toggleAll } = useBulkActions(
    params.ids
  );
  const { updateListSettings, settings } = useListSettings<ProductListColumns>(
    ListViews.PRODUCT_LIST
  );

  const { availableChannels } = useAppChannel(false);

  const selectedChannel = availableChannels.find(
    channel => channel.slug === "usd"
  );

  const tabs = getFilterTabs();

  const currentTab = getFiltersCurrentTab(params, tabs);

  const [
    changeFilters,
    resetFilters,
    handleSearchChange
  ] = createFilterHandlers({
    cleanupFn: reset,
    createUrl: productListUrl,
    getFilterQueryParam,
    navigate,
    params
  });

  useEffect(() => {
    const sortWithQuery = ProductListUrlSortField.rank;
    const sortWithoutQuery =
      params.sort === ProductListUrlSortField.rank
        ? DEFAULT_SORT_KEY
        : params.sort;
    if (!sortWithoutQuery) {
      return;
    }
    navigate(
      productListUrl({
        ...params,
        asc: params.query ? undefined : params.asc,
        sort: params.query ? sortWithQuery : sortWithoutQuery
      })
    );
  }, [params.query]);

  const handleTabChange = (tab: number) => {
    reset();
    navigate(
      productListUrl({
        activeTab: tab.toString(),
        ...getFilterTabs()[tab - 1].data
      })
    );
  };

  const handleSort = (field: ProductListUrlSortField, attributeId?: string) =>
    navigate(
      productListUrl({
        ...params,
        ...getSortUrlVariables(field, params),
        attributeId,
        ...DEFAULT_INITIAL_PAGINATION_DATA
      })
    );

  const paginationState = createPaginationState(settings.rowNumber, params);
  const filter = getFilterVariables(params, !!selectedChannel);
  const sort = getSortQueryVariables(params, !!selectedChannel);
  const queryVariables = React.useMemo<ProductListVariables>(
    () => ({
      ...paginationState,
      filter,
      sort,
      channel: selectedChannel?.slug
    }),
    [params, settings.rowNumber]
  );
  const { data, loading } = useProductListQuery({
    displayLoader: true,
    variables: queryVariables
  });

  const { loadNextPage, loadPreviousPage, pageInfo } = paginate(
    data?.products?.pageInfo,
    paginationState,
    params
  );

  return (
    <>
      <ProductListPage
        activeAttributeSortId={params.attributeId}
        sort={{
          asc: params.asc,
          sort: params.sort
        }}
        onSort={handleSort}
        currencySymbol={selectedChannel?.currencyCode || ""}
        currentTab={currentTab}
        defaultSettings={defaultListSettings[ListViews.PRODUCT_LIST]}
        gridAttributes={[]}
        settings={settings}
        loading={loading}
        onAdd={params => navigate(productAddUrl(params))}
        disabled={loading}
        products={mapEdgesToItems(data?.products)}
        onNextPage={loadNextPage}
        onPreviousPage={loadPreviousPage}
        onUpdateListSettings={updateListSettings}
        pageInfo={pageInfo}
        onRowClick={(id, type = "") => () => navigate(productUrl(id) + type)}
        onAll={resetFilters}
        isChecked={isSelected}
        selected={listElements.length}
        toggle={toggle}
        toggleAll={toggleAll}
        onSearchChange={handleSearchChange}
        onFilterChange={changeFilters}
        onTabChange={handleTabChange}
        initialSearch={params.query || ""}
        tabs={getFilterTabs().map(tab => tab.name)}
        channelsCount={availableChannels?.length}
        selectedChannelId={selectedChannel?.id}
      />
    </>
  );
};
export default ProductList;
