import { IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import useBulkActions from "@saleor/hooks/useBulkActions";
import useListSettings from "@saleor/hooks/useListSettings";
import useNavigator from "@saleor/hooks/useNavigator";
import useNotifier from "@saleor/hooks/useNotifier";
import usePaginator, {
  createPaginationState
} from "@saleor/hooks/usePaginator";
import { maybe } from "@saleor/misc";
import { ListViews } from "@saleor/types";
import createDialogActionHandlers from "@saleor/utils/handlers/dialogActionHandlers";
import createFilterHandlers from "@saleor/utils/handlers/filterHandlers";
import createSortHandler from "@saleor/utils/handlers/sortHandler";
import { mapEdgesToItems } from "@saleor/utils/maps";
import { getSortParams } from "@saleor/utils/sort";
import React from "react";
import { useIntl } from "react-intl";

import CustomerListPage from "../../components/CustomerListPage";
import { useCustomerListQuery } from "../../queries";
import {
  customerAddUrl,
  customerListUrl,
  CustomerListUrlDialog,
  CustomerListUrlQueryParams,
  customerUrl
} from "../../urls";
import {
  getFilterOpts,
  getFilterQueryParam,
  getFiltersCurrentTab,
  getFilterTabs,
  getFilterVariables,
} from "./filters";
import { getSortQueryVariables } from "./sort";

interface CustomerListProps {
  params: CustomerListUrlQueryParams;
}

export const CustomerList: React.FC<CustomerListProps> = ({ params }) => {
  const navigate = useNavigator();
  const notify = useNotifier();
  const paginate = usePaginator();
  const { isSelected, listElements, reset, toggle, toggleAll } = useBulkActions(
    params.ids
  );
  const { updateListSettings, settings } = useListSettings(
    ListViews.CUSTOMER_LIST
  );

  
  
  
  
  
  
  

  const intl = useIntl();

  const paginationState = createPaginationState(settings.rowNumber, params);
  const queryVariables = React.useMemo(
    () => ({
      ...paginationState,
      filter: getFilterVariables(params),
      sort: getSortQueryVariables(params)
    }),
    [params, settings.rowNumber]
  );
  const { data, loading, refetch } = useCustomerListQuery({
    displayLoader: true,
    variables: queryVariables
  });

  const tabs = getFilterTabs();

  const currentTab = getFiltersCurrentTab(params, tabs);

  const [
    changeFilters,
    resetFilters,
    handleSearchChange
  ] = createFilterHandlers({
    cleanupFn: reset,
    createUrl: customerListUrl,
    getFilterQueryParam,
    navigate,
    params
  });

  const [openModal, closeModal] = createDialogActionHandlers<
    CustomerListUrlDialog,
    CustomerListUrlQueryParams
  >(navigate, customerListUrl, params);

  const handleTabChange = (tab: number) => {
    reset();
    navigate(
      customerListUrl({
        activeTab: tab.toString(),
        ...getFilterTabs()[tab - 1].data
      })
    );
  };


  const { loadNextPage, loadPreviousPage, pageInfo } = paginate(
    maybe(() => data.customers.pageInfo),
    paginationState,
    params
  );



  const handleSort = createSortHandler(navigate, customerListUrl, params);

  return (
        <CustomerListPage
          currentTab={currentTab}
          filterOpts={getFilterOpts(params)}
          initialSearch={params.query || ""}
          onSearchChange={handleSearchChange}
          onFilterChange={changeFilters}
          onAll={resetFilters}
          onTabChange={handleTabChange}
          onTabDelete={() => openModal("delete-search")}
          onTabSave={() => openModal("save-search")}
          tabs={tabs.map(tab => tab.name)}
          customers={mapEdgesToItems(data?.customers)}
          settings={settings}
          disabled={loading}
          loading={loading}
          pageInfo={pageInfo}
          onAdd={() => navigate(customerAddUrl)}
          onNextPage={loadNextPage}
          onPreviousPage={loadPreviousPage}
          onUpdateListSettings={updateListSettings}
          onRowClick={id => () => navigate(customerUrl(id))}
          onSort={handleSort}
          toolbar={
            <IconButton
              color="primary"
              onClick={() =>
                openModal("remove", {
                  ids: listElements
                })
              }
            >
              <DeleteIcon />
            </IconButton>
          }
          isChecked={isSelected}
          selected={listElements.length}
          sort={getSortParams(params)}
          toggle={toggle}
          toggleAll={toggleAll}
        />
  );
};
export default CustomerList;
