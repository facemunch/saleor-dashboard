import placeholderImg from "@assets/images/placeholder255x255.png";
import { IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useAttributeValueDeleteMutation } from "@saleor/attributes/mutations";
import {
  ChannelData,
  createChannelsDataWithPrice,
  createSortedChannelsDataFromProduct
} from "@saleor/channels/utils";
import ActionDialog from "@saleor/components/ActionDialog";
import useAppChannel from "@saleor/components/AppLayout/AppChannelContext";
import { AttributeInput } from "@saleor/components/Attributes";
import NotFoundPage from "@saleor/components/NotFoundPage";

import {
  DEFAULT_INITIAL_SEARCH_DATA,
  VALUES_PAGINATE_BY
} from "@saleor/config";
import { useFileUploadMutation } from "@saleor/files/mutations";
import useBulkActions from "@saleor/hooks/useBulkActions";
import useChannels from "@saleor/hooks/useChannels";
import useNavigator from "@saleor/hooks/useNavigator";
import useNotifier from "@saleor/hooks/useNotifier";
import useOnSetDefaultVariant from "@saleor/hooks/useOnSetDefaultVariant";
import useShop from "@saleor/hooks/useShop";
import useStateFromProps from "@saleor/hooks/useStateFromProps";
import { commonMessages, errorMessages } from "@saleor/intl";
import {
  useDigitalContentCreateMutation,
  useDigitalContentDeleteMutation,
  useDigitalContentUrlCreateMutation,
  useProductChannelListingUpdate,
  useProductDeleteMutation,
  useProductMediaCreateMutation,
  useProductMediaDeleteMutation,
  useProductMediaReorder,
  useProductUpdateMutation,
  useProductVariantChannelListingUpdate,
  useProductVariantPreorderDeactivateMutation,
  useProductVariantReorderMutation,
  useSimpleProductUpdateMutation,
  useVariantCreateMutation
} from "@saleor/products/mutations";
import { getProductErrorMessage } from "@saleor/utils/errors";
import useAttributeValueSearchHandler from "@saleor/utils/handlers/attributeValueSearchHandler";
import createDialogActionHandlers from "@saleor/utils/handlers/dialogActionHandlers";
import createMetadataUpdateHandler from "@saleor/utils/handlers/metadataUpdateHandler";
import { mapEdgesToItems } from "@saleor/utils/maps";
import {
  useMetadataUpdate,
  usePrivateMetadataUpdate
} from "@saleor/utils/metadata/updateMetadata";
import { useWarehouseList } from "@saleor/warehouses/queries";
import { warehouseAddPath } from "@saleor/warehouses/urls";
import React from "react";
import { defineMessages, useIntl } from "react-intl";

import { getMutationState } from "../../../misc";
import ProductUpdatePage from "../../components/ProductUpdatePageIonic";
import { useProductDetails } from "../../queries";
import { ProductMediaCreateVariables } from "../../types/ProductMediaCreate";
import { ProductUpdate as ProductUpdateMutationResult } from "../../types/ProductUpdate";
import {
  productImageUrl,
  productListUrl,
  productUrl,
  ProductUrlDialog,
  ProductUrlQueryParams,
  productVariantAddUrl,
  productVariantEditUrl
} from "../../urls";
import {
  createFileUploadHandler,
  createImageReorderHandler,
  createImageUploadHandler,
  createUpdateHandler,
  createVariantReorderHandler
} from "./handlers";
import useChannelVariantListings from "./useChannelVariantListings";
import { DigitalContentCreateVariables } from "@saleor/products/types/DigitalContentCreate";
import { DigitalContentUrlCreateVariables } from "@saleor/products/types/DigitalContentUrlCreate";

const messages = defineMessages({
  deleteProductDialogTitle: {
    defaultMessage: "Delete Product",
    description: "delete product dialog title"
  },
  deleteProductDialogSubtitle: {
    defaultMessage: "Are you sure you want to delete {name}?",
    description: "delete product dialog subtitle"
  },
  deleteVariantDialogTitle: {
    defaultMessage: "Delete Product Variants",
    description: "delete variant dialog title"
  },
  deleteVariantDialogSubtitle: {
    defaultMessage:
      "{counter,plural,one{Are you sure you want to delete this variant?} other{Are you sure you want to delete {displayQuantity} variants?}}",
    description: "delete variant dialog subtitle"
  }
});

interface ProductUpdateProps {
  id: string;
  params: ProductUrlQueryParams;
}

export const ProductUpdate: React.FC<ProductUpdateProps> = ({ id, params }) => {
  const navigate = useNavigator();

  const notify = useNotifier();
  const { isSelected, listElements, toggle, toggleAll } = useBulkActions(
    params.ids
  );
  const intl = useIntl();

  const {
    loadMore: loadMoreAttributeValues,
    search: searchAttributeValues,
    result: searchAttributeValuesOpts,
    reset: searchAttributeReset
  } = useAttributeValueSearchHandler(DEFAULT_INITIAL_SEARCH_DATA);
  const warehouses = useWarehouseList({
    displayLoader: false,
    variables: {
      first: 1
    },
    fetchPolicy: "cache-first"
  });
  const shop = useShop();
  const [updateMetadata] = useMetadataUpdate({});
  const [updatePrivateMetadata] = usePrivateMetadataUpdate({});
  const [
    productVariantCreate,
    productVariantCreateOpts
  ] = useVariantCreateMutation({});

  const { data, loading } = useProductDetails({
    displayLoader: true,
    variables: {
      id,
      firstValues: VALUES_PAGINATE_BY
    },
    fetchPolicy: "cache-first"
  });
  const handleBack = () => navigate(productListUrl());

  const product = data?.product;

  const isSimpleProduct = !data?.product?.productType?.hasVariants;

  const { availableChannels, channel } = useAppChannel(!isSimpleProduct);

  const [uploadFile, uploadFileOpts] = useFileUploadMutation({});

  const handleUpdate = (data: ProductUpdateMutationResult) => {
    if (data.productUpdate.errors.length === 0) {
      notify({
        status: "success",
        text: intl.formatMessage(commonMessages.savedChanges)
      });
      handleBack();
    }
  };
  const [updateProduct, updateProductOpts] = useProductUpdateMutation({
    onCompleted: handleUpdate
  });
  const [
    updateSimpleProduct,
    updateSimpleProductOpts
  ] = useSimpleProductUpdateMutation({
    onCompleted: handleUpdate
  });

  const [
    reorderProductImages,
    reorderProductImagesOpts
  ] = useProductMediaReorder({});

  const [deleteProduct, deleteProductOpts] = useProductDeleteMutation({
    refetchQueries: ["ProductList"],
    onCompleted: () => {
      notify({
        status: "success",
        text: intl.formatMessage({
          defaultMessage: "Product removed"
        })
      });
      navigate(productListUrl());
    }
  });

  const [
    createProductImage,
    createProductImageOpts
  ] = useProductMediaCreateMutation({
    onCompleted: data => {
      const imageError = data.productMediaCreate.errors.find(
        error => error.field === ("image" as keyof ProductMediaCreateVariables)
      );
      if (imageError) {
        notify({
          status: "error",
          title: intl.formatMessage(errorMessages.imgageUploadErrorTitle),
          text: intl.formatMessage(errorMessages.imageUploadErrorText)
        });
      }
    }
  });

  const [
    createProductFile
  ] = useDigitalContentCreateMutation({
    onCompleted: data => {
      const fileError = data.digitalContentCreate.errors.find(
        error => error.field === ("contentFile" as keyof DigitalContentCreateVariables)
      );
      if (fileError) {
        notify({
          status: "error",
          title: intl.formatMessage(errorMessages.fileUploadErrorTitle),
          text: intl.formatMessage(errorMessages.fileUploadErrorText)
        });
      } else {
        createProductFileUrl({
          variables: {
            content: data.digitalContentCreate.content.id
          }
        })
      }
    }
  });

  const [
    createProductFileUrl,
  ] = useDigitalContentUrlCreateMutation({
    onCompleted: data => {
      const fileError = data.digitalContentUrlCreate.errors.find(
        error => error.field === ("content" as keyof DigitalContentUrlCreateVariables)
      );
      if (fileError) {
        notify({
          status: "error",
          title: intl.formatMessage(errorMessages.fileUploadErrorTitle),
          text: intl.formatMessage(errorMessages.fileUploadErrorText)
        });
      }
    }
  });

  const [deleteProductImage] = useProductMediaDeleteMutation({
    onCompleted: () =>
      notify({
        status: "success",
        text: intl.formatMessage(commonMessages.savedChanges)
      })
  });

  const [deleteDigitalContent] = useDigitalContentDeleteMutation({
    onCompleted: () =>
      notify({
        status: "success",
        text: intl.formatMessage(commonMessages.savedChanges)
      })
  });

  const [openModal, closeModal] = createDialogActionHandlers<
    ProductUrlDialog,
    ProductUrlQueryParams
  >(navigate, params => productUrl(id, params), params);


  const allChannels: ChannelData[] = createChannelsDataWithPrice(
    product,
    availableChannels
  ).sort((channel, nextChannel) =>
    channel.name.localeCompare(nextChannel.name)
  );

  const [channelsData, setChannelsData] = useStateFromProps(allChannels);
  const {
    channelsWithVariantsData,
    hasChanged: hasChannelVariantListingChanged
  } = useChannelVariantListings(allChannels);

  const productChannelsChoices: ChannelData[] = createSortedChannelsDataFromProduct(
    product
  );

  const {
    currentChannels,
    handleChannelsModalOpen,
    setCurrentChannels
  } = useChannels(productChannelsChoices, params?.action, {
    closeModal,
    openModal
  });

  const [updateChannels, updateChannelsOpts] = useProductChannelListingUpdate({
    onCompleted: data => {
      if (!!data.productChannelListingUpdate.errors.length) {
        data.productChannelListingUpdate.errors.forEach(error =>
          notify({
            status: "error",
            text: getProductErrorMessage(error, intl)
          })
        );
      }
    }
  });

  const [
    updateVariantChannels,
    updateVariantChannelsOpts
  ] = useProductVariantChannelListingUpdate({});

  const [
    createProductMedia,
    createProductMediaOpts
  ] = useProductMediaCreateMutation({
    onCompleted: data => {
      const errors = data.productMediaCreate.errors;

      if (errors.length) {
        errors.map(error =>
          notify({
            status: "error",
            text: getProductErrorMessage(error, intl)
          })
        );
      } else {
        notify({
          status: "success",
          text: intl.formatMessage(commonMessages.savedChanges)
        });
      }
    }
  });

  const handleMediaUrlUpload = (mediaUrl: string) => {
    const variables = {
      alt: "",
      mediaUrl,
      product: product.id
    };

    createProductMedia({
      variables
    });
  };

  const [
    deleteAttributeValue,
    deleteAttributeValueOpts
  ] = useAttributeValueDeleteMutation({});

  const handleVariantAdd = () => navigate(productVariantAddUrl(id));

  const handleImageDelete = (id: string) => () =>
    deleteProductImage({ variables: { id } });
  const handleImageEdit = (imageId: string) => () =>
    navigate(productImageUrl(id, imageId));

  const handleSubmit = createMetadataUpdateHandler(
    product,
    createUpdateHandler(
      product,
      allChannels,
      variables => uploadFile({ variables }),
      variables => updateProduct({ variables }),
      variables => updateSimpleProduct({ variables }),
      updateChannels,
      updateVariantChannels,
      productVariantCreate,
      variables => deleteAttributeValue({ variables })
    ),
    variables => updateMetadata({ variables }),
    variables => updatePrivateMetadata({ variables })
  );

  const handleImageUpload = createImageUploadHandler(id, variables =>
    createProductImage({ variables })
  );
  const handleFileUpload = createFileUploadHandler(data?.product?.variants?.[0]?.id, variables =>
    createProductFile({ variables })
  );

  const handleFileDelete = (id: string) => () =>
    deleteDigitalContent({ variables: { variantId: id } });
  
  const handleImageReorder = createImageReorderHandler(product, variables =>
    reorderProductImages({ variables })
  );

  const [
    reorderProductVariants,
    reorderProductVariantsOpts
  ] = useProductVariantReorderMutation({});

  const handleVariantReorder = createVariantReorderHandler(product, variables =>
    reorderProductVariants({ variables })
  );

  const [deactivatePreoderOpts] = useProductVariantPreorderDeactivateMutation(
    {}
  );

  const handleAssignAttributeReferenceClick = (attribute: AttributeInput) =>
    navigate(
      productUrl(id, {
        action: "assign-attribute-value",
        id: attribute.id
      })
    );

  const disableFormSave =
    uploadFileOpts.loading ||
    createProductImageOpts.loading ||
    deleteProductOpts.loading ||
    reorderProductImagesOpts.loading ||
    updateProductOpts.loading ||
    reorderProductVariantsOpts.loading ||
    updateChannelsOpts.loading ||
    updateVariantChannelsOpts.loading ||
    productVariantCreateOpts.loading ||
    deleteAttributeValueOpts.loading ||
    createProductMediaOpts.loading ||
    loading;

  const formTransitionState = getMutationState(
    updateProductOpts.called || updateSimpleProductOpts.called,
    updateProductOpts.loading || updateSimpleProductOpts.loading,
    updateProductOpts.data?.productUpdate.errors,
    updateSimpleProductOpts.data?.productUpdate.errors,
    updateSimpleProductOpts.data?.productVariantUpdate.errors,
    createProductMediaOpts.data?.productMediaCreate.errors
  );

  const attributeValues =
    mapEdgesToItems(searchAttributeValuesOpts?.data?.attribute.choices) || [];

  const errors = [
    ...(updateProductOpts.data?.productUpdate.errors || []),
    ...(updateSimpleProductOpts.data?.productUpdate.errors || []),
    ...(productVariantCreateOpts.data?.productVariantCreate.errors || [])
  ];

  const onSetDefaultVariant = useOnSetDefaultVariant(
    product ? product.id : null,
    null
  );
  const channelsErrors = [
    ...(updateChannelsOpts?.data?.productChannelListingUpdate?.errors || []),
    ...(updateVariantChannelsOpts?.data?.productVariantChannelListingUpdate
      ?.errors || [])
  ];

  const fetchMoreAttributeValues = {
    hasMore: !!searchAttributeValuesOpts.data?.attribute?.choices?.pageInfo
      ?.hasNextPage,
    loading: !!searchAttributeValuesOpts.loading,
    onFetchMore: loadMoreAttributeValues
  };

  if (product === null) {
    return <NotFoundPage onBack={handleBack} />;
  }

  return (
    <>
      <ProductUpdatePage
        hasChannelChanged={
          hasChannelVariantListingChanged ||
          productChannelsChoices?.length !== currentChannels?.length
        }
        isSimpleProduct={isSimpleProduct}
        openChannelsModal={handleChannelsModalOpen}
        onChannelsChange={setCurrentChannels}
        channelsErrors={channelsErrors}
        currentChannels={currentChannels}
        allChannelsCount={allChannels?.length}
        channelsData={channelsData}
        setChannelsData={setChannelsData}
        attributeValues={attributeValues}
        channelsWithVariantsData={channelsWithVariantsData}
        defaultWeightUnit={shop?.defaultWeightUnit}
        disabled={disableFormSave}
        onSetDefaultVariant={onSetDefaultVariant}
        errors={errors}
        fetchAttributeValues={searchAttributeValues}
        saveButtonBarState={formTransitionState}
        media={data?.product?.media}
        header={product?.name}
        placeholderImage={placeholderImg}
        product={product}
        warehouses={mapEdgesToItems(warehouses?.data?.warehouses) || []}
        taxTypes={data?.taxTypes}
        variants={product?.variants}
        onBack={handleBack}
        onDelete={() => openModal("remove")}
        onImageReorder={handleImageReorder}
        onMediaUrlUpload={handleMediaUrlUpload}
        onSubmit={handleSubmit}
        onWarehouseConfigure={() => navigate(warehouseAddPath)}
        onVariantAdd={handleVariantAdd}
        onVariantsAdd={() => openModal("add-variants")}
        onVariantShow={variantId => () =>
          navigate(productVariantEditUrl(product.id, variantId))}
        onVariantReorder={handleVariantReorder}
        onImageUpload={handleImageUpload}
        onFileUpload={handleFileUpload}
        onFileDelete={handleFileDelete}
        onImageEdit={handleImageEdit}
        onImageDelete={handleImageDelete}
        toolbar={
          <IconButton
            color="primary"
            onClick={() =>
              openModal("remove-variants", {
                ids: listElements
              })
            }
          >
            <DeleteIcon />
          </IconButton>
        }
        isChecked={isSelected}
        selected={listElements.length}
        toggle={toggle}
        toggleAll={toggleAll}
        selectedChannelId={channel?.id}
        assignReferencesAttributeId={
          params.action === "assign-attribute-value" && params.id
        }
        onAssignReferencesClick={handleAssignAttributeReferenceClick}
        fetchMoreAttributeValues={fetchMoreAttributeValues}
        onCloseDialog={() => navigate(productUrl(id))}
        onAttributeSelectBlur={searchAttributeReset}
      />
      <ActionDialog
        open={params.action === "remove"}
        onClose={closeModal}
        confirmButtonState={deleteProductOpts.status}
        onConfirm={() => deleteProduct({ variables: { id } })}
        variant="delete"
        title={intl.formatMessage(messages.deleteProductDialogTitle)}
        message={String(
          messages?.deleteProductDialogSubtitle?.defaultMessage
        ).replace("{name}", product?.name)}
      ></ActionDialog>
    </>
  );
};
export default ProductUpdate;
