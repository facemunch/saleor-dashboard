import { Button, Card } from "@mui/material";
import Container from "@saleor/components/Container";
import FilterBar from "@saleor/components/FilterBar";
import PageHeader from "@saleor/components/PageHeader";
import { sectionNames } from "@saleor/intl";
import { Backlink } from "@saleor/macaw-ui";
import { ProductTypeListUrlSortField } from "@saleor/productTypes/urls";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";
import {
  FilterPageProps,
  ListActions,
  PageListProps,
  SortPage,
  TabPageProps
} from "../../../types";
import { ProductTypeList_productTypes_edges_node } from "../../types/ProductTypeList";
import ProductTypeList from "../ProductTypeList";
import {
  createFilterStructure,
  ProductTypeFilterKeys,
  ProductTypeListFilterOpts
} from "./filters";
import { add } from "ionicons/icons";
import {
  IonFab,
  IonContent,
  IonIcon,
  IonFabButton,
  IonCard
} from "@ionic/react";

export interface ProductTypeListPageProps
  extends PageListProps,
    ListActions,
    FilterPageProps<ProductTypeFilterKeys, ProductTypeListFilterOpts>,
    SortPage<ProductTypeListUrlSortField>,
    TabPageProps {
  productTypes: ProductTypeList_productTypes_edges_node[];
  onBack: () => void;
}

const ProductTypeListPage: React.FC<ProductTypeListPageProps> = ({
  currentTab,
  filterOpts,
  initialSearch,
  onAdd,
  onAll,
  onBack,
  onFilterChange,
  onSearchChange,
  onTabChange,
  onTabDelete,
  onTabSave,
  tabs,
  ...listProps
}) => {
  const intl = useIntl();

  const structure = createFilterStructure(intl, filterOpts);

  return (
    <>
      <IonContent>
        <Backlink onClick={onBack}>
          {intl.formatMessage(sectionNames.configuration)}
        </Backlink>
        <IonFab
          vertical="bottom"
          horizontal="end"
          slot="fixed"
          style={{
            marginBottom: "50px"
          }}
          data-test="addProductType"
          
        >
          <IonFabButton onClick={onAdd}>
            <IonIcon icon={add} />
          </IonFabButton>
        </IonFab>

        <IonCard>
          <FilterBar
            allTabLabel={intl.formatMessage({
              defaultMessage: "All Product Types",
              description: "tab name"
            })}
            currentTab={currentTab}
            filterStructure={structure}
            initialSearch={initialSearch}
            searchPlaceholder={intl.formatMessage({
              defaultMessage: "Search Product Type"
            })}
            tabs={tabs}
            onAll={onAll}
            onFilterChange={onFilterChange}
            onSearchChange={onSearchChange}
            onTabChange={onTabChange}
            onTabDelete={onTabDelete}
            onTabSave={onTabSave}
          />
          <ProductTypeList {...listProps} />
        </IonCard>
      </IonContent>
    </>
  );
};
ProductTypeListPage.displayName = "ProductTypeListPage";
export default ProductTypeListPage;
