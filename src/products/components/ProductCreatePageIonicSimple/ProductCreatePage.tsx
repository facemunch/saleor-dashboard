import CannotDefineChannelsAvailabilityCard from "@saleor/channels/components/CannotDefineChannelsAvailabilityCard/CannotDefineChannelsAvailabilityCard";
import { ChannelData } from "@saleor/channels/utils";
import Attributes, { AttributeInput } from "@saleor/components/Attributes";
import CardSpacer from "@saleor/components/CardSpacer";
import ChannelsAvailabilityCard from "@saleor/components/ChannelsAvailabilityCard";

import { ConfirmButtonTransitionState } from "@saleor/components/ConfirmButton";
import Savebar from "@saleor/components/Savebar";
import { ProductChannelListingErrorFragment } from "@saleor/fragments/types/ProductChannelListingErrorFragment";
import { ProductErrorWithAttributesFragment } from "@saleor/fragments/types/ProductErrorWithAttributesFragment";
import useStateFromProps from "@saleor/hooks/useStateFromProps";
import ProductVariantPrice from "@saleor/products/components/ProductVariantPrice";
import { ProductType_productType } from "@saleor/products/types/ProductType";
import { getChoices } from "@saleor/products/utils/data";
import { SearchAttributeValues_attribute_choices_edges_node } from "@saleor/searches/types/SearchAttributeValues";
import { SearchCategories_search_edges_node } from "@saleor/searches/types/SearchCategories";

import { SearchPages_search_edges_node } from "@saleor/searches/types/SearchPages";
import { SearchProductTypes_search_edges_node } from "@saleor/searches/types/SearchProductTypes";
import { SearchWarehouses_search_edges_node } from "@saleor/searches/types/SearchWarehouses";
import { PermissionEnum } from "@saleor/types/globalTypes";
import React from "react";
import { useIntl } from "react-intl";

import { FetchMoreProps } from "../../../types";
import ProductDetailsForm from "../ProductDetailsForm";
import ProductOrganization from "../ProductOrganization";
import ProductStocks from "../ProductStocks";
import ProductCreateForm, {
  ProductCreateData,
  ProductCreateFormData
} from "./form";

import { IonContent } from "@ionic/react";
import PageHeader from "@saleor/components/PageHeader";

interface ProductCreatePageProps {
  errors: ProductErrorWithAttributesFragment[];
  channelsErrors: ProductChannelListingErrorFragment[];
  allChannelsCount: number;
  currentChannels: ChannelData[];

  categories: SearchCategories_search_edges_node[];
  attributeValues: SearchAttributeValues_attribute_choices_edges_node[];
  loading: boolean;

  fetchMoreProductTypes: FetchMoreProps;
  fetchMoreAttributeValues?: FetchMoreProps;
  initial?: Partial<ProductCreateFormData>;
  productTypes?: SearchProductTypes_search_edges_node[];
  referencePages?: SearchPages_search_edges_node[];
  header: string;
  saveButtonBarState: ConfirmButtonTransitionState;
  weightUnit: string;
  warehouses: SearchWarehouses_search_edges_node[];

  selectedProductType?: ProductType_productType;

  fetchProductTypes: (data: string) => void;
  fetchAttributeValues: (query: string, attributeId: string) => void;
  onWarehouseConfigure: () => void;
  openChannelsModal: () => void;
  onChannelsChange: (data: ChannelData[]) => void;
  assignReferencesAttributeId?: string;
  onAssignReferencesClick: (attribute: AttributeInput) => void;
  fetchReferencePages?: (data: string) => void;

  fetchMoreReferencePages?: FetchMoreProps;

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

  attributeValues,
  errors,

  fetchMoreProductTypes,
  header,
  initial,
  productTypes: productTypeChoiceList,
  saveButtonBarState,
  warehouses,

  selectedProductType,
  onBack,
  fetchProductTypes,
  onSubmit,
  onChannelsChange,
  onWarehouseConfigure,
  openChannelsModal,
  onAssignReferencesClick,
  fetchAttributeValues,
  fetchMoreAttributeValues,
  onSelectProductType,
  onAttributeSelectBlur
}: ProductCreatePageProps) => {
  const intl = useIntl();
  const isDigitalProduct = selectedProductType?.isDigital

  const [selectedCategory, setSelectedCategory] = useStateFromProps("");

  const categories = getChoices(categoryChoiceList);

  const productTypes = getChoices(productTypeChoiceList);

  return (
    <>
      <IonContent data-test-id="add-product-view">
        <ProductCreateForm
          onSubmit={onSubmit}
          initial={initial}
          selectedProductType={selectedProductType}
          onSelectProductType={onSelectProductType}
          categories={categories}
          productTypes={productTypeChoiceList}
          setSelectedCategory={setSelectedCategory}
          setChannels={onChannelsChange}
          warehouses={warehouses}
          currentChannels={currentChannels}
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
            const isSimpleProduct = data.productType?.hasVariants === false;
            return (
              <>
                <PageHeader title={header}></PageHeader>

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
                      <ProductVariantPrice
                        ProductVariantChannelListings={data.channelListings}
                        errors={channelsErrors}
                        loading={loading}
                        onChange={handlers.changeChannelPrice}
                      />
                      <CardSpacer />
                      <div
                        id="hide-isDigitalProduct"
                        style={{
                          height: "0",
                          overflow: "hidden"
                        }}
                      >
                        <ProductStocks
                          data={data}
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
                      height: "0",
                      overflow: "hidden"
                    }}
                  >
                    <ProductOrganization
                      canChangeType={true}
                      categories={categories}
                      categoryInputDisplayValue={selectedCategory}
                      data={data}
                      disabled={loading}
                      errors={errors}
                      fetchMoreProductTypes={fetchMoreProductTypes}
                      fetchProductTypes={fetchProductTypes}
                      productType={data.productType}
                      productTypeInputDisplayValue={
                        data.productType?.name || ""
                      }
                      productTypes={productTypes}
                      onCategoryChange={handlers.selectCategory}
                      onProductTypeChange={handlers.selectProductType}
                    />

                    <CardSpacer />
                    {isSimpleProduct ? (
                      <ChannelsAvailabilityCard
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
                  <div
                    style={{ height: "100px", padding: "24px 24px 24px 24px" }}
                  >
                    You can add media and specify more details in the next step.
                  </div>
                </div>

                <Savebar
                  onCancel={onBack}
                  onSubmit={submit}
                  state={saveButtonBarState}
                  disabled={
                    loading ||
                    !onSubmit ||
                    formDisabled ||
                    !hasChanged ||
                    Number(data?.channelListings?.[0]?.price) < 1
                  }
                />
              </>
            );
          }}
        </ProductCreateForm>
      </IonContent>
    </>
  );
};
ProductCreatePage.displayName = "ProductCreatePage";
export default ProductCreatePage;
