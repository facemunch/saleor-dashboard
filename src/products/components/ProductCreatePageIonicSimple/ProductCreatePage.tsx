import CannotDefineChannelsAvailabilityCard from "@saleor/channels/components/CannotDefineChannelsAvailabilityCard/CannotDefineChannelsAvailabilityCard";
import { ChannelData } from "@saleor/channels/utils";
import Attributes, { AttributeInput } from "@saleor/components/Attributes";
import CardSpacer from "@saleor/components/CardSpacer";
import ChannelsAvailabilityCard from "@saleor/components/ChannelsAvailabilityCard";
import generateHash from "random-hash";

import { ConfirmButtonTransitionState } from "@saleor/components/ConfirmButton";
import { MultiAutocompleteChoiceType } from "@saleor/components/MultiAutocompleteSelectField";
import Savebar from "@saleor/components/Savebar";
import { ProductChannelListingErrorFragment } from "@saleor/fragments/types/ProductChannelListingErrorFragment";
import { ProductErrorWithAttributesFragment } from "@saleor/fragments/types/ProductErrorWithAttributesFragment";
import { TaxTypeFragment } from "@saleor/fragments/types/TaxTypeFragment";
import useStateFromProps from "@saleor/hooks/useStateFromProps";
import { sectionNames } from "@saleor/intl";
import { Backlink } from "@saleor/macaw-ui";
import ProductVariantPrice from "@saleor/products/components/ProductVariantPrice";
import { ProductType_productType } from "@saleor/products/types/ProductType";
import { getChoices } from "@saleor/products/utils/data";
import { SearchAttributeValues_attribute_choices_edges_node } from "@saleor/searches/types/SearchAttributeValues";
import { SearchCategories_search_edges_node } from "@saleor/searches/types/SearchCategories";
import { SearchCollections_search_edges_node } from "@saleor/searches/types/SearchCollections";
import { SearchPages_search_edges_node } from "@saleor/searches/types/SearchPages";
import { SearchProducts_search_edges_node } from "@saleor/searches/types/SearchProducts";
import { SearchProductTypes_search_edges_node } from "@saleor/searches/types/SearchProductTypes";
import { SearchWarehouses_search_edges_node } from "@saleor/searches/types/SearchWarehouses";
import { PermissionEnum } from "@saleor/types/globalTypes";
import React, { useEffect, useMemo } from "react";
import { useIntl } from "react-intl";
import { useLocation } from "react-router-dom";

import { FetchMoreProps } from "../../../types";
import ProductDetailsForm from "../ProductDetailsForm";
import ProductOrganization from "../ProductOrganization";
import ProductStocks from "../ProductStocks";
import ProductCreateForm, {
  ProductCreateData,
  ProductCreateFormData
} from "./form";

import {
  IonPage,
  IonToolbar,
  IonHeader,
  IonContent,
  IonTitle
} from "@ionic/react";

interface ProductCreatePageProps {
  errors: ProductErrorWithAttributesFragment[];
  channelsErrors: ProductChannelListingErrorFragment[];
  allChannelsCount: number;
  currentChannels: ChannelData[];
  collections: SearchCollections_search_edges_node[];
  categories: SearchCategories_search_edges_node[];
  attributeValues: SearchAttributeValues_attribute_choices_edges_node[];
  loading: boolean;
  fetchMoreCategories: FetchMoreProps;
  fetchMoreCollections: FetchMoreProps;
  fetchMoreProductTypes: FetchMoreProps;
  fetchMoreAttributeValues?: FetchMoreProps;
  initial?: Partial<ProductCreateFormData>;
  productTypes?: SearchProductTypes_search_edges_node[];
  referencePages?: SearchPages_search_edges_node[];
  referenceProducts?: SearchProducts_search_edges_node[];
  header: string;
  saveButtonBarState: ConfirmButtonTransitionState;
  weightUnit: string;
  warehouses: SearchWarehouses_search_edges_node[];
  taxTypes: TaxTypeFragment[];
  selectedProductType?: ProductType_productType;
  fetchCategories: (data: string) => void;
  fetchCollections: (data: string) => void;
  fetchProductTypes: (data: string) => void;
  fetchAttributeValues: (query: string, attributeId: string) => void;
  onWarehouseConfigure: () => void;
  openChannelsModal: () => void;
  onChannelsChange: (data: ChannelData[]) => void;
  assignReferencesAttributeId?: string;
  onAssignReferencesClick: (attribute: AttributeInput) => void;
  fetchReferencePages?: (data: string) => void;
  fetchReferenceProducts?: (data: string) => void;
  fetchMoreReferencePages?: FetchMoreProps;
  fetchMoreReferenceProducts?: FetchMoreProps;
  onAttributeSelectBlur: () => void;
  onCloseDialog: () => void;
  onSelectProductType: (productTypeId: string) => void;
  onBack?();
  onSubmit?(data: ProductCreateData);
}

export const ProductCreatePage: React.FC<ProductCreatePageProps> = ({
  allChannelsCount,
  channelsErrors,
  currentChannels,
  loading,
  categories: categoryChoiceList,
  collections: collectionChoiceList,
  attributeValues,
  errors,
  fetchCategories,
  fetchCollections,
  fetchMoreCategories,
  fetchMoreCollections,
  fetchMoreProductTypes,
  header,
  initial,
  productTypes: productTypeChoiceList,
  referencePages = [],
  referenceProducts = [],
  saveButtonBarState,
  warehouses,
  taxTypes,
  selectedProductType,
  onBack,
  fetchProductTypes,
  onSubmit,
  onChannelsChange,
  onWarehouseConfigure,
  openChannelsModal,
  assignReferencesAttributeId,
  onAssignReferencesClick,
  fetchReferencePages,
  fetchMoreReferencePages,
  fetchReferenceProducts,
  fetchMoreReferenceProducts,
  fetchAttributeValues,
  fetchMoreAttributeValues,
  onCloseDialog,
  onSelectProductType,
  onAttributeSelectBlur
}: ProductCreatePageProps) => {
  const intl = useIntl();
  const { search } = useLocation();
  const isDigitalProduct = search.includes("isDigitalProduct");

  // Display values
  const [selectedCategory, setSelectedCategory] = useStateFromProps("");

  const [selectedCollections, setSelectedCollections] = useStateFromProps<
    MultiAutocompleteChoiceType[]
  >([]);

  const [selectedTaxType, setSelectedTaxType] = useStateFromProps(
    initial?.taxCode || null
  );

  const categories = getChoices(categoryChoiceList);
  const collections = getChoices(collectionChoiceList);
  const productTypes = getChoices(productTypeChoiceList);
  const taxTypeChoices =
    taxTypes?.map(taxType => ({
      label: taxType.description,
      value: taxType.taxCode
    })) || [];

  useEffect(() => {
    if (productTypes.length === 0 || selectedProductType) return;
    const digitalProduct = productTypes.find(
      x =>
        x.label === (isDigitalProduct ? "Digital product" : "Physical product")
    );
    digitalProduct?.value
      ? onSelectProductType(digitalProduct.value)
      : onSelectProductType(productTypes[0].value);
  }, [productTypes, isDigitalProduct]);

  const randomHash = useMemo(() => generateHash({ length: 4 }), []);

  return (
    <IonPage>
      <IonContent data-test-id="add-product-view">
        <ProductCreateForm
          onSubmit={onSubmit}
          initial={initial}
          selectedProductType={selectedProductType}
          onSelectProductType={onSelectProductType}
          categories={categories}
          collections={collections}
          productTypes={productTypeChoiceList}
          referencePages={referencePages}
          referenceProducts={referenceProducts}
          selectedCollections={selectedCollections}
          setSelectedCategory={setSelectedCategory}
          setSelectedCollections={setSelectedCollections}
          setSelectedTaxType={setSelectedTaxType}
          setChannels={onChannelsChange}
          taxTypes={taxTypeChoices}
          warehouses={warehouses}
          currentChannels={currentChannels}
          fetchReferencePages={fetchReferencePages}
          fetchMoreReferencePages={fetchMoreReferencePages}
          fetchReferenceProducts={fetchReferenceProducts}
          fetchMoreReferenceProducts={fetchMoreReferenceProducts}
          assignReferencesAttributeId={assignReferencesAttributeId}
        >
          {({
            change,
            data,
            formErrors,
            disabled: formDisabled,
            handlers,
            hasChanged,
            submit
          }) => {
            // Comparing explicitly to false because `hasVariants` can be undefined
            const isSimpleProduct = data.productType?.hasVariants === false;

            return (
              <>
                <IonHeader collapse="condense">
                  <IonToolbar>
                    <IonTitle className={"mt-1"} size="large">
                      {header}
                    </IonTitle>
                    <Backlink onClick={onBack}>
                      {intl.formatMessage(sectionNames.products)}
                    </Backlink>
                    {/* <PageHeader title={header} /> */}
                  </IonToolbar>
                </IonHeader>

                {/* <Grid> */}
                <div>
                  <ProductDetailsForm
                    data={data}
                    disabled={loading}
                    errors={errors}
                    onChange={change}
                    onDescriptionChange={handlers.changeDescription}
                  />
                  <CardSpacer />
                  {data.attributes.length > 0 && (
                    <Attributes
                      attributes={data.attributes}
                      attributeValues={attributeValues}
                      loading={loading}
                      disabled={loading}
                      errors={errors}
                      onChange={handlers.selectAttribute}
                      onMultiChange={handlers.selectAttributeMultiple}
                      onFileChange={handlers.selectAttributeFile}
                      onReferencesRemove={handlers.selectAttributeReference}
                      onReferencesAddClick={onAssignReferencesClick}
                      onReferencesReorder={handlers.reorderAttributeValue}
                      fetchAttributeValues={fetchAttributeValues}
                      fetchMoreAttributeValues={fetchMoreAttributeValues}
                      onAttributeSelectBlur={onAttributeSelectBlur}
                    />
                  )}
                  <CardSpacer />
                  {isSimpleProduct && (
                    <>
                      {/* {!isDigitalProduct && (
                      <ProductShipping
                        data={data}
                        disabled={loading}
                        errors={errors}
                        weightUnit={weightUnit}
                        onChange={change}
                      />
                    )} */}
                      {/* <CardSpacer /> */}
                      <ProductVariantPrice
                        isDigitalProduct={isDigitalProduct}
                        ProductVariantChannelListings={data.channelListings}
                        errors={channelsErrors}
                        loading={loading}
                        onChange={handlers.changeChannelPrice}
                      />
                      <CardSpacer />
                      <div
                        id="hide-isDigitalProduct"
                        style={{
                          // transform: !isDigitalProduct ? "scale(1)" : "scale(0)",
                          height: "0",
                          overflow: "hidden"
                        }}
                      >
                        <ProductStocks
                          data={data}
                          defaultSKU={
                            data.name.split(" ").join("-") + "-" + randomHash
                          }
                          disabled={loading}
                          hasVariants={false}
                          onFormDataChange={change}
                          errors={errors}
                          formErrors={formErrors}
                          isDigitalProduct={isDigitalProduct}
                          stocks={data.stocks}
                          warehouses={warehouses}
                          onChange={handlers.changeStock}
                          onChangePreorderEndDate={
                            handlers.changePreorderEndDate
                          }
                          onWarehouseStockAdd={handlers.addStock}
                          onWarehouseStockDelete={handlers.deleteStock}
                          onWarehouseConfigure={onWarehouseConfigure}
                        />

                        <CardSpacer />
                      </div>
                    </>
                  )}
            
                </div>
                <div>
                  <div
                    id="hide-isDigitalProduct"
                    style={{
                      // transform: !isDigitalProduct ? "scale(1)" : "scale(0)",
                      height: "0",
                      overflow: "hidden"
                    }}
                  >
                    <ProductOrganization
                      canChangeType={true}
                      categories={categories}
                      categoryInputDisplayValue={selectedCategory}
                      collections={collections}
                      data={data}
                      disabled={loading}
                      errors={errors}
                      fetchCategories={fetchCategories}
                      fetchCollections={fetchCollections}
                      fetchMoreCategories={fetchMoreCategories}
                      fetchMoreCollections={fetchMoreCollections}
                      fetchMoreProductTypes={fetchMoreProductTypes}
                      fetchProductTypes={fetchProductTypes}
                      productType={data.productType}
                      productTypeInputDisplayValue={
                        data.productType?.name || ""
                      }
                      productTypes={productTypes}
                      onCategoryChange={handlers.selectCategory}
                      onCollectionChange={handlers.selectCollection}
                      onProductTypeChange={handlers.selectProductType}
                      collectionsInputDisplayValue={selectedCollections}
                    />

                    <CardSpacer />
                    {isSimpleProduct ? (
                      <ChannelsAvailabilityCard
                        isDigitalProduct={isDigitalProduct}
                        isAutoPresentToPublished={true}
                        managePermissions={[PermissionEnum.MANAGE_PRODUCTS]}
                        messages={{
                          hiddenLabel: intl.formatMessage({
                            defaultMessage: "Not published",
                            description: "product label"
                          }),

                          visibleLabel: intl.formatMessage({
                            defaultMessage: "Published",
                            description: "product label"
                          })
                        }}
                        errors={channelsErrors}
                        selectedChannelsCount={
                          data.channelListings?.length || 0
                        }
                        allChannelsCount={allChannelsCount}
                        channels={data.channelListings || []}
                        disabled={loading}
                        onChange={handlers.changeChannels}
                        openModal={openChannelsModal}
                      />
                    ) : (
                      <CannotDefineChannelsAvailabilityCard />
                    )}
                    <CardSpacer />
                  </div>
                  <div style={{ height: "100px", padding: "24px" }}>
                    You can add media and specify more details in the next step.
                  </div>
                  {/* <ProductTaxes
                    data={data}
                    disabled={loading}
                    onChange={change}
                    onTaxTypeChange={handlers.selectTaxRate}
                    selectedTaxTypeDisplayName={selectedTaxType}
                    taxTypes={taxTypes}
                  /> */}
                </div>
                {/* </Grid> */}
                <Savebar
                  onCancel={onBack}
                  onSubmit={submit}
                  state={saveButtonBarState}
                  disabled={loading || !onSubmit || formDisabled || !hasChanged}
                />
                {/* {canOpenAssignReferencesAttributeDialog && (
                <AssignAttributeValueDialog
                  attributeValues={getAttributeValuesFromReferences(
                    assignReferencesAttributeId,
                    data.attributes,
                    referencePages,
                    referenceProducts
                  )}
                  hasMore={handlers.fetchMoreReferences?.hasMore}
                  open={canOpenAssignReferencesAttributeDialog}
                  onFetch={handlers.fetchReferences}
                  onFetchMore={handlers.fetchMoreReferences?.onFetchMore}
                  loading={handlers.fetchMoreReferences?.loading}
                  onClose={onCloseDialog}
                  onSubmit={attributeValues =>
                    handleAssignReferenceAttribute(
                      attributeValues,
                      data,
                      handlers
                    )
                  }
                />
              )} */}
              </>
            );
          }}
        </ProductCreateForm>
      </IonContent>
    </IonPage>
  );
};
ProductCreatePage.displayName = "ProductCreatePage";
export default ProductCreatePage;
