import useAppChannel from "@saleor/components/AppLayout/AppChannelContext";
import { useShopLimitsQuery } from "@saleor/components/Shop/query";
import {
  DEFAULT_INITIAL_PAGINATION_DATA,
  DEFAULT_INITIAL_SEARCH_DATA,
  defaultListSettings,
  ProductListColumns
} from "@saleor/config";
import useBulkActions from "@saleor/hooks/useBulkActions";
import useListSettings from "@saleor/hooks/useListSettings";
import useNavigator from "@saleor/hooks/useNavigator";
import { usePaginationReset } from "@saleor/hooks/usePaginationReset";
import usePaginator, {
  createPaginationState
} from "@saleor/hooks/usePaginator";
import { maybe } from "@saleor/misc";
import {
  getAttributeIdFromColumnValue,
  isAttributeColumnValue
} from "@saleor/products/components/ProductListPage/utils";
import {
  useAvailableInGridAttributesQuery,
  useGridAttributesQuery,
  useInitialProductFilterAttributesQuery,
  useInitialProductFilterCategoriesQuery,
  useInitialProductFilterCollectionsQuery,
  useInitialProductFilterProductTypesQuery,
  useProductListQuery
} from "@saleor/products/queries";
import { ProductListVariables } from "@saleor/products/types/ProductList";
import {
  productAddUrl,
  productListUrl,
  ProductListUrlQueryParams,
  ProductListUrlSortField,
  productUrl
} from "@saleor/products/urls";
import useAttributeValueSearch from "@saleor/searches/useAttributeValueSearch";
import useCategorySearch from "@saleor/searches/useCategorySearch";
import useCollectionSearch from "@saleor/searches/useCollectionSearch";
import useProductTypeSearch from "@saleor/searches/useProductTypeSearch";
import { ListViews } from "@saleor/types";
import createFilterHandlers from "@saleor/utils/handlers/filterHandlers";
import { mapEdgesToItems, mapNodeToChoice } from "@saleor/utils/maps";
import { getSortUrlVariables } from "@saleor/utils/sort";
import React, { useEffect, useState } from "react";

import ProductListPage from "../../components/ProductListPageIonic_";
import {
  getFilterOpts,
  getFilterQueryParam,
  getFiltersCurrentTab,
  getFilterTabs,
  getFilterVariables
} from "./filters";
import { canBeSorted, DEFAULT_SORT_KEY, getSortQueryVariables } from "./sort";

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

  // usePaginationReset(
  //   productListUrl({
  //     ...params,
  //     ...DEFAULT_INITIAL_PAGINATION_DATA
  //   }),
  //   settings.rowNumber
  // );
  const {
    data: initialFilterAttributes
  } = useInitialProductFilterAttributesQuery();
  const {
    data: initialFilterCategories
  } = useInitialProductFilterCategoriesQuery({
    variables: {
      categories: params.categories
    },
    skip: !params.categories?.length
  });
  const {
    data: initialFilterCollections
  } = useInitialProductFilterCollectionsQuery({
    variables: {
      collections: params.collections
    },
    skip: !params.collections?.length
  });
  const {
    data: initialFilterProductTypes
  } = useInitialProductFilterProductTypesQuery({
    variables: {
      productTypes: params.productTypes
    },
    skip: !params.productTypes?.length
  });
  const searchCategories = useCategorySearch({
    variables: {
      ...DEFAULT_INITIAL_SEARCH_DATA,
      first: 5
    }
  });
  const searchCollections = useCollectionSearch({
    variables: {
      ...DEFAULT_INITIAL_SEARCH_DATA,
      first: 5
    }
  });
  const searchProductTypes = useProductTypeSearch({
    variables: {
      ...DEFAULT_INITIAL_SEARCH_DATA,
      first: 5
    }
  });
  const [focusedAttribute, setFocusedAttribute] = useState<string>();
  const searchAttributeValues = useAttributeValueSearch({
    variables: {
      id: focusedAttribute,
      ...DEFAULT_INITIAL_SEARCH_DATA,
      first: 10
    },
    skip: !focusedAttribute
  });
  const { availableChannels } = useAppChannel(false);
  const limitOpts = useShopLimitsQuery({
    variables: {
      productVariants: true
    }
  });

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

  // useEffect(() => {
  //   const sortWithQuery = ProductListUrlSortField.rank;
  //   const sortWithoutQuery =
  //     params.sort === ProductListUrlSortField.rank
  //       ? DEFAULT_SORT_KEY
  //       : params.sort;
  //   navigate(
  //     productListUrl({
  //       ...params,
  //       asc: params.query ? undefined : params.asc,
  //       sort: params.query ? sortWithQuery : sortWithoutQuery
  //     })
  //   );
  // }, [params.query]);

  // useEffect(() => {
  //   if (!canBeSorted(params.sort, !!selectedChannel)) {
  //     navigate(
  //       productListUrl({
  //         ...params,
  //         sort: DEFAULT_SORT_KEY
  //       })
  //     );
  //   }
  // }, [params]);

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
  const channelOpts = availableChannels
    ? mapNodeToChoice(availableChannels, channel => channel.slug)
    : null;
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

  function filterColumnIds(columns: ProductListColumns[]) {
    return columns
      .filter(isAttributeColumnValue)
      .map(getAttributeIdFromColumnValue);
  }
  const availableInGridAttributes = useAvailableInGridAttributesQuery({
    variables: { first: 24 }
  });
  const gridAttributes = useGridAttributesQuery({
    variables: { ids: filterColumnIds(settings.columns) }
  });

  const filterOpts = getFilterOpts(
    params,
    mapEdgesToItems(initialFilterAttributes?.attributes) || [],
    searchAttributeValues,
    {
      initial: mapEdgesToItems(initialFilterCategories?.categories) || [],
      search: searchCategories
    },
    {
      initial: mapEdgesToItems(initialFilterCollections?.collections) || [],
      search: searchCollections
    },
    {
      initial: mapEdgesToItems(initialFilterProductTypes?.productTypes) || [],
      search: searchProductTypes
    },
    channelOpts
  );

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
        availableInGridAttributes={
          mapEdgesToItems(availableInGridAttributes?.data?.availableInGrid) ||
          []
        }
        currencySymbol={selectedChannel?.currencyCode || ""}
        currentTab={currentTab}
        defaultSettings={defaultListSettings[ListViews.PRODUCT_LIST]}
        filterOpts={filterOpts}
        gridAttributes={mapEdgesToItems(gridAttributes?.data?.grid) || []}
        totalGridAttributes={maybe(
          () => availableInGridAttributes.data.availableInGrid.totalCount,
          0
        )}
        settings={settings}
        loading={availableInGridAttributes.loading || gridAttributes.loading}
        hasMore={maybe(
          () =>
            availableInGridAttributes.data.availableInGrid.pageInfo.hasNextPage,
          false
        )}
        onAdd={params => navigate(productAddUrl(params))}
        disabled={loading}
        limits={limitOpts.data?.shop.limits}
        products={mapEdgesToItems(data?.products)}
        onFetchMore={() =>
          availableInGridAttributes.loadMore(
            (prev, next) => {
              if (
                prev.availableInGrid.pageInfo.endCursor ===
                next.availableInGrid.pageInfo.endCursor
              ) {
                return prev;
              }
              return {
                ...prev,
                availableInGrid: {
                  ...prev.availableInGrid,
                  edges: [
                    ...prev.availableInGrid.edges,
                    ...next.availableInGrid.edges
                  ],
                  pageInfo: next.availableInGrid.pageInfo
                }
              };
            },
            {
              after:
                availableInGridAttributes.data.availableInGrid.pageInfo
                  .endCursor
            }
          )
        }
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
        onFilterAttributeFocus={setFocusedAttribute}
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
