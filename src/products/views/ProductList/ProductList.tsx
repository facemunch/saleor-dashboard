import useAppChannel from "@saleor/components/AppLayout/AppChannelContext";
import { defaultListSettings } from "@saleor/config";
import useBulkActions from "@saleor/hooks/useBulkActions";
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
  productUrl
} from "@saleor/products/urls";
import { ListViews } from "@saleor/types";
import createFilterHandlers from "@saleor/utils/handlers/filterHandlers";
import { mapEdgesToItems } from "@saleor/utils/maps";
import React, { useMemo } from "react";

import ProductListPage from "../../components/ProductListPage";
import {
  getFilterQueryParam,
  getFilterTabs,
  getFilterVariables
} from "./filters";
import { getSortQueryVariables } from "./sort";

interface ProductListProps {
  params: ProductListUrlQueryParams;
}

export const ProductList: React.FC<ProductListProps> = ({ params }) => {
  const navigate = useNavigator();

  const paginate = usePaginator();
  const { isSelected, listElements, reset, toggle, toggleAll } = useBulkActions(
    params.ids
  );

  const { availableChannels } = useAppChannel(false);

  const selectedChannel = availableChannels.find(
    channel => channel.slug === "usd"
  );

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

  const handleTabChange = (tab: number) => {
    reset();
    navigate(
      productListUrl({
        activeTab: tab.toString(),
        ...getFilterTabs()[tab - 1].data
      })
    );
  };

  const paginationState = createPaginationState(100, params);
  const filter = getFilterVariables(params, !!selectedChannel);
  const sort = getSortQueryVariables(params, !!selectedChannel);
  const queryVariables = useMemo<ProductListVariables>(
    () => ({
      ...paginationState,
      filter,
      sort,
      channel: selectedChannel?.slug
    }),
    [sort, filter, selectedChannel, paginationState]
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
        currencySymbol={selectedChannel?.currencyCode || ""}
        defaultSettings={defaultListSettings[ListViews.PRODUCT_LIST]}
        gridAttributes={[]}
        loading={loading}
        onAdd={params => navigate(productAddUrl(params))}
        disabled={loading}
        products={mapEdgesToItems(data?.products)}
        onNextPage={loadNextPage}
        onPreviousPage={loadPreviousPage}
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
        toolbar={""}
        filterOpts={undefined}
      />
    </>
  );
};
export default ProductList;
