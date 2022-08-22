import { OutputData } from "@editorjs/editorjs";
import {
  getAttributeValuesFromReferences,
  mergeAttributeValues
} from "@saleor/attributes/utils/data";
import { ChannelData } from "@saleor/channels/utils";
import AssignAttributeValueDialog from "@saleor/components/AssignAttributeValueDialog";
import Attributes, { AttributeInput } from "@saleor/components/Attributes";
import CardSpacer from "@saleor/components/CardSpacer";
import ChannelsAvailabilityCard from "@saleor/components/ChannelsAvailabilityCard";
import { ConfirmButtonTransitionState } from "@saleor/components/ConfirmButton";
import Grid from "@saleor/components/Grid";
import Metadata from "@saleor/components/Metadata/Metadata";
import Savebar from "@saleor/components/Savebar";

import { ProductChannelListingErrorFragment } from "@saleor/fragments/types/ProductChannelListingErrorFragment";
import { ProductErrorWithAttributesFragment } from "@saleor/fragments/types/ProductErrorWithAttributesFragment";
import { TaxTypeFragment } from "@saleor/fragments/types/TaxTypeFragment";
import { WarehouseFragment } from "@saleor/fragments/types/WarehouseFragment";
import { SubmitPromise } from "@saleor/hooks/useForm";
import { FormsetData } from "@saleor/hooks/useFormset";
import useStateFromProps from "@saleor/hooks/useStateFromProps";
import { sectionNames } from "@saleor/intl";
import { Backlink } from "@saleor/macaw-ui";
import ProductExternalMediaDialog from "@saleor/products/components/ProductExternalMediaDialog";
import ProductVariantPrice from "@saleor/products/components/ProductVariantPrice";
import { ChannelsWithVariantsData } from "@saleor/products/views/ProductUpdate/types";
import { SearchAttributeValues_attribute_choices_edges_node } from "@saleor/searches/types/SearchAttributeValues";

import {
  ChannelProps,
  FetchMoreProps,
  ListActions,
  ReorderAction
} from "@saleor/types";
import { PermissionEnum } from "@saleor/types/globalTypes";
import React, { memo } from "react";
import { useIntl } from "react-intl";
import { IonContent } from "@ionic/react";
import ChannelsWithVariantsAvailabilityCard from "../../../channels/ChannelsWithVariantsAvailabilityCard/ChannelsWithVariantsAvailabilityCard";
import {
  ProductDetails_product,
  ProductDetails_product_media,
  ProductDetails_product_variants
} from "../../types/ProductDetails";
import { ProductUpdatePageFormData } from "../../utils/data";
import ProductDetailsForm from "../ProductDetailsForm";
import ProductMedia from "../ProductMedia";

import ProductShipping from "../ProductShipping/ProductShipping";
import ProductStocks, { ProductStockInput } from "../ProductStocks";
import ProductVariants from "../ProductVariants";
import ProductUpdateForm, {
  ProductUpdateData,
  ProductUpdateHandlers
} from "./form";
import { Loader } from "frontend/ui/loader";
import PageHeader from "@saleor/components/PageHeader";
import ProductDigitalContent from "../ProductDigitalContent";

export interface ProductUpdatePageProps extends ListActions, ChannelProps {
  channelsWithVariantsData: ChannelsWithVariantsData;
  setChannelsData: (data: ChannelData[]) => void;
  onChannelsChange: (data: ChannelData[]) => void;
  channelsData: ChannelData[];
  currentChannels: ChannelData[];
  allChannelsCount: number;
  channelsErrors: ProductChannelListingErrorFragment[];
  defaultWeightUnit: string;
  errors: ProductErrorWithAttributesFragment[];
  placeholderImage: string;

  attributeValues: SearchAttributeValues_attribute_choices_edges_node[];
  disabled: boolean;

  isMediaUrlModalVisible?: boolean;

  variants: ProductDetails_product_variants[];
  media: ProductDetails_product_media[];
  hasChannelChanged: boolean;
  product: ProductDetails_product;
  header: string;
  saveButtonBarState: ConfirmButtonTransitionState;
  warehouses: WarehouseFragment[];
  taxTypes: TaxTypeFragment[];

  assignReferencesAttributeId?: string;

  fetchMoreAttributeValues?: FetchMoreProps;
  isSimpleProduct: boolean;

  fetchAttributeValues: (query: string, attributeId: string) => void;
  onAssignReferencesClick: (attribute: AttributeInput) => void;
  onCloseDialog: () => void;
  onVariantsAdd: () => void;
  onVariantShow: (id: string) => () => void;
  onVariantReorder: ReorderAction;
  onImageDelete: (id: string) => () => void;
  onFileDelete: (id: string) => () => void;
  onSubmit: (data: ProductUpdatePageSubmitData) => SubmitPromise;
  openChannelsModal: () => void;
  onAttributeSelectBlur: () => void;
  onBack?();
  onDelete();
  onImageEdit?(id: string);
  onImageReorder?(event: { oldIndex: number; newIndex: number });
  onImageUpload(file: File);
  onFileUpload(file: File);
  onMediaUrlUpload(mediaUrl: string);
  onSeoClick?();
  onVariantAdd?();
  onSetDefaultVariant(variant: ProductDetails_product_variants);
  onWarehouseConfigure();
}

export interface ProductUpdatePageSubmitData extends ProductUpdatePageFormData {
  addStocks: ProductStockInput[];
  attributes: AttributeInput[];
  attributesWithNewFileValue: FormsetData<null, File>;

  description: OutputData;
  removeStocks: string[];
  updateStocks: ProductStockInput[];
}

export const ProductUpdatePage: React.FC<ProductUpdatePageProps> = ({
  defaultWeightUnit,
  disabled,

  channelsErrors,

  attributeValues,
  isSimpleProduct,
  errors,
  media,
  hasChannelChanged,

  placeholderImage,
  product,
  saveButtonBarState,
  variants,
  warehouses,
  setChannelsData,
  taxTypes,

  onBack,
  onDelete,
  allChannelsCount,
  currentChannels,
  onImageDelete,
  onImageEdit,
  onImageReorder,
  onImageUpload,
  onFileUpload,
  onFileDelete,
  onMediaUrlUpload,
  openChannelsModal,
  onSubmit,
  onVariantAdd,
  channelsData,
  onVariantsAdd,
  onSetDefaultVariant,
  onVariantShow,
  onVariantReorder,
  onWarehouseConfigure,
  isChecked,
  isMediaUrlModalVisible,
  selected,
  selectedChannelId,
  toggle,
  toggleAll,
  toolbar,
  header,
  assignReferencesAttributeId,
  onAssignReferencesClick,

  fetchAttributeValues,
  fetchMoreAttributeValues,
  onCloseDialog,
  channelsWithVariantsData,
  onChannelsChange,
  onAttributeSelectBlur
}) => {
  const intl = useIntl();

  const [mediaUrlModalStatus, setMediaUrlModalStatus] = useStateFromProps(
    isMediaUrlModalVisible || false
  );

  const [selectedTaxType, setSelectedTaxType] = useStateFromProps(
    product?.taxType.description
  );

  const hasVariants = product?.productType?.hasVariants;
  const taxTypeChoices =
    taxTypes?.map(taxType => ({
      label: taxType.description,
      value: taxType.taxCode
    })) || [];

  const canOpenAssignReferencesAttributeDialog = !!assignReferencesAttributeId;

  const handleAssignReferenceAttribute = (
    attributeValues: string[],
    data: ProductUpdateData,
    handlers: ProductUpdateHandlers
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

  return (
    <>
      <IonContent data-test-id="update-product-view">
        {product === undefined && <Loader />}
        <ProductUpdateForm
          isSimpleProduct={isSimpleProduct}
          currentChannels={currentChannels}
          channelsData={channelsData}
          setChannelsData={setChannelsData}
          onSubmit={onSubmit}
          product={product}
          channelsWithVariants={channelsWithVariantsData}
          setSelectedTaxType={setSelectedTaxType}
          setChannels={onChannelsChange}
          taxTypes={taxTypeChoices}
          warehouses={warehouses}
          hasVariants={hasVariants}
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
            return (
              <>
                <Backlink onClick={onBack}>
                  {intl.formatMessage(sectionNames.products)}
                </Backlink>
                <PageHeader title={header}></PageHeader>
                <Grid>
                  <div>
                    <ProductDetailsForm
                      data={data}
                      disabled={disabled}
                      errors={errors}
                      onDescriptionChange={handlers.changeDescription}
                      onChange={change}
                    />
                    <CardSpacer />
                    <ProductMedia
                      media={media}
                      placeholderImage={placeholderImage}
                      onImageDelete={onImageDelete}
                      onImageReorder={onImageReorder}
                      onImageEdit={onImageEdit}
                      onImageUpload={onImageUpload}
                      openMediaUrlModal={() => setMediaUrlModalStatus(true)}
                    />
                    <ProductDigitalContent
                      content={variants?.[0]?.digitalContent}
                      onFileDelete={onFileDelete}
                      onFileUpload={onFileUpload}
                    />
                    <CardSpacer />

                    <CardSpacer />
                    {data.attributes.length > 0 && (
                      <Attributes
                        attributes={data.attributes}
                        attributeValues={attributeValues}
                        errors={errors}
                        loading={disabled}
                        disabled={disabled}
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
                          loading={disabled}
                          onChange={handlers.changeChannelPrice}
                        />
                        <CardSpacer />
                      </>
                    )}
                    {hasVariants ? (
                      <ProductVariants
                        disabled={disabled}
                        variants={variants}
                        product={product}
                        onRowClick={onVariantShow}
                        onVariantAdd={onVariantAdd}
                        onVariantsAdd={onVariantsAdd}
                        onVariantReorder={onVariantReorder}
                        onSetDefaultVariant={onSetDefaultVariant}
                        toolbar={toolbar}
                        isChecked={isChecked}
                        selected={selected}
                        selectedChannelId={selectedChannelId}
                        toggle={toggle}
                        toggleAll={toggleAll}
                      />
                    ) : (
                      <>
                        <ProductShipping
                          data={data}
                          disabled={disabled}
                          errors={errors}
                          weightUnit={
                            product?.weight?.unit || defaultWeightUnit
                          }
                          onChange={change}
                        />

                        <CardSpacer />
                        <ProductStocks
                          onVariantChannelListingChange={
                            handlers.changeChannelPreorder
                          }
                          productVariantChannelListings={data.channelListings}
                          data={data}
                          disabled={disabled}
                          hasVariants={false}
                          errors={errors}
                          formErrors={formErrors}
                          stocks={data.stocks}
                          warehouses={warehouses}
                          onChange={handlers.changeStock}
                          onFormDataChange={change}
                          onChangePreorderEndDate={
                            handlers.changePreorderEndDate
                          }
                          onWarehouseStockAdd={handlers.addStock}
                          onWarehouseStockDelete={handlers.deleteStock}
                          onWarehouseConfigure={onWarehouseConfigure}
                        />
                      </>
                    )}
                    <CardSpacer />

                    <CardSpacer />
                    <Metadata data={data} onChange={handlers.changeMetadata} />
                  </div>
                  <div>
                    {isSimpleProduct ? (
                      <>
                        <CardSpacer />
                        <ChannelsAvailabilityCard
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
                          selectedChannelsCount={data.channelListings.length}
                          allChannelsCount={allChannelsCount}
                          channels={data.channelListings}
                          disabled={disabled}
                          onChange={handlers.changeChannels}
                          openModal={openChannelsModal}
                        />
                      </>
                    ) : (
                      <ChannelsWithVariantsAvailabilityCard
                        messages={{
                          hiddenLabel: intl.formatMessage({
                            defaultMessage: "Not published",
                            description: "product label",
                            id: "not published channel"
                          }),

                          visibleLabel: intl.formatMessage({
                            defaultMessage: "Published",
                            description: "product label",
                            id: "published channel"
                          })
                        }}
                        errors={channelsErrors}
                        channels={data.channelsData}
                        channelsWithVariantsData={channelsWithVariantsData}
                        variants={variants}
                        onChange={handlers.changeChannels}
                        openModal={openChannelsModal}
                      />
                    )}
                    <CardSpacer />
                    <div style={{ height: "100px" }} />
                  </div>
                </Grid>
                <Savebar
                  onCancel={onBack}
                  onDelete={onDelete}
                  onSubmit={submit}
                  state={saveButtonBarState}
                  disabled={
                    disabled ||
                    formDisabled ||
                    (!hasChanged && !hasChannelChanged)
                  }
                />
                {canOpenAssignReferencesAttributeDialog && (
                  <AssignAttributeValueDialog
                    attributeValues={getAttributeValuesFromReferences(
                      assignReferencesAttributeId,
                      data.attributes
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

                <ProductExternalMediaDialog
                  product={product}
                  onClose={() => setMediaUrlModalStatus(false)}
                  open={mediaUrlModalStatus}
                  onSubmit={onMediaUrlUpload}
                />
              </>
            );
          }}
        </ProductUpdateForm>
      </IonContent>
    </>
  );
};
ProductUpdatePage.displayName = "ProductUpdatePage";
export default memo(ProductUpdatePage);
