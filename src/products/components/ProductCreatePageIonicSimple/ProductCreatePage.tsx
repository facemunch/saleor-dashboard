import {
  getAttributeValuesFromReferences,
  mergeAttributeValues
} from "@saleor/attributes/utils/data";
import CannotDefineChannelsAvailabilityCard from "@saleor/channels/components/CannotDefineChannelsAvailabilityCard/CannotDefineChannelsAvailabilityCard";
import { ChannelData } from "@saleor/channels/utils";
import AssignAttributeValueDialog from "@saleor/components/AssignAttributeValueDialog";
import Attributes, { AttributeInput } from "@saleor/components/Attributes";
import CardSpacer from "@saleor/components/CardSpacer";
import ChannelsAvailabilityCard from "@saleor/components/ChannelsAvailabilityCard";
import { ConfirmButtonTransitionState } from "@saleor/components/ConfirmButton";
import Container from "@saleor/components/Container";
import Grid from "@saleor/components/Grid";
import Metadata from "@saleor/components/Metadata";
import { MultiAutocompleteChoiceType } from "@saleor/components/MultiAutocompleteSelectField";
import PageHeader from "@saleor/components/PageHeader";
import Savebar from "@saleor/components/Savebar";
import SeoForm from "@saleor/components/SeoForm";
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
import React, { useEffect } from "react";
import { useIntl } from "react-intl";
import { useLocation } from "react-router-dom";

import { FetchMoreProps } from "../../../types";
import ProductDetailsForm from "../ProductDetailsForm";
import ProductOrganization from "../ProductOrganization";
import ProductShipping from "../ProductShipping/ProductShipping";
import ProductStocks from "../ProductStocks";
import ProductTaxes from "../ProductTaxes";
import ProductCreateForm, {
  ProductCreateData,
  ProductCreateFormData,
  ProductCreateHandlers
} from "./form";

import {
  IonModal,
  IonRange,
  IonItem,
  IonPage,
  IonButton,
  IonToolbar,
  IonHeader,
  IonContent,
  IonList,
  IonLabel,
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
  weightUnit,
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

  const canOpenAssignReferencesAttributeDialog = !!assignReferencesAttributeId;

  const handleAssignReferenceAttribute = (
    attributeValues: string[],
    data: ProductCreateData,
    handlers: ProductCreateHandlers
  ) => {
    handlers.selectAttributeReference(
      assignReferencesAttributeId,
      mergeAttributeValues(
        assignReferencesAttributeId,
        attributeValues,
        data.attributes
      )
    );
    onCloseDialog();
  };

  useEffect(() => {
    if (productTypes.length === 0 || selectedProductType) return;
    const digitalProduct = productTypes.find(
      x =>
        x.label === (isDigitalProduct ? "Digital product" : "Physical product")
    );
    digitalProduct?.value && onSelectProductType(digitalProduct.value);
  }, [productTypes, isDigitalProduct]);

  useEffect(() => {
    // if (productTypes.length === 0 || selectedProductType) return;
    // const digitalProduct = productTypes.find(x => x.label === "Digital product");
    // digitalProduct?.value && onSelectProductType(digitalProduct.value);
  }, [productTypes]);

  return (
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
        console.log(" ProductCreateForm data", data);

        return (
          <IonPage>
            <IonContent>
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
                    <ProductStocks
                      data={data}
                      defaultSKU={data.name.split(" ").join("-")}
                      disabled={loading}
                      hasVariants={false}
                      onFormDataChange={change}
                      errors={errors}
                      formErrors={formErrors}
                      isDigitalProduct={isDigitalProduct}
                      stocks={data.stocks}
                      warehouses={warehouses}
                      onChange={handlers.changeStock}
                      onChangePreorderEndDate={handlers.changePreorderEndDate}
                      onWarehouseStockAdd={handlers.addStock}
                      onWarehouseStockDelete={handlers.deleteStock}
                      onWarehouseConfigure={onWarehouseConfigure}
                    />
                    <CardSpacer />
                  </>
                )}
                {/* <SeoForm
                    allowEmptySlug={true}
                    helperText={intl.formatMessage({
                      defaultMessage:
                        "Add search engine title and description to make this product easier to find"
                    })}
                    title={data.seoTitle}
                    slug={data.slug}
                    slugPlaceholder={data.name}
                    titlePlaceholder={data.name}
                    description={data.seoDescription}
                    descriptionPlaceholder={data.seoTitle}
                    loading={loading}
                    onChange={change}
                  />
                  <CardSpacer /> */}
                {/* <Metadata data={data} onChange={handlers.changeMetadata} /> */}
              </div>
              <div>
                <div
                  id="hide-isDigitalProduct"
                  style={{
                    // transform: !isDigitalProduct ? "scale(1)" : "scale(0)",
                    height: isDigitalProduct ? "0" : "auto",
                    overflow: isDigitalProduct ? "hidden" : "auto"
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
                    productTypeInputDisplayValue={data.productType?.name || ""}
                    productTypes={productTypes}
                    onCategoryChange={handlers.selectCategory}
                    onCollectionChange={handlers.selectCollection}
                    onProductTypeChange={handlers.selectProductType}
                    collectionsInputDisplayValue={selectedCollections}
                  />
                </div>
                <CardSpacer />
                {isSimpleProduct ? (
                  <ChannelsAvailabilityCard
                    isDigitalProduct={isDigitalProduct}
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
                    selectedChannelsCount={data.channelListings?.length || 0}
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
                <div style={{ height: "100px" }} />
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
              {canOpenAssignReferencesAttributeDialog && (
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
              )}
            </IonContent>
          </IonPage>
        );
      }}
    </ProductCreateForm>
  );
};
ProductCreatePage.displayName = "ProductCreatePage";
export default ProductCreatePage;
