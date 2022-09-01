import { ChannelData, createSortedChannelsData } from "@saleor/channels/utils";
import useAppChannel from "@saleor/components/AppLayout/AppChannelContext";
import { AttributeInput } from "@saleor/components/Attributes";
import {
  DEFAULT_INITIAL_SEARCH_DATA,
  VALUES_PAGINATE_BY
} from "@saleor/config";
import { useFileUploadMutation } from "@saleor/files/mutations";
import useChannels from "@saleor/hooks/useChannels";
import useNavigator from "@saleor/hooks/useNavigator";
import useNotifier from "@saleor/hooks/useNotifier";
import useShop from "@saleor/hooks/useShop";
import ProductCreatePage from "@saleor/products/components/ProductCreatePageIonicSimple";
import {
  useProductChannelListingUpdate,
  useProductDeleteMutation,
  useProductVariantChannelListingUpdate,
  useVariantCreateMutation
} from "@saleor/products/mutations";
import { useProductCreateMutation } from "@saleor/products/mutations";
import { useProductTypeQuery } from "@saleor/products/queries";
import {
  productAddUrl,
  ProductCreateUrlDialog,
  ProductCreateUrlQueryParams,
  productUrl
} from "@saleor/products/urls";
import useCategorySearch from "@saleor/searches/useCategorySearch";

import useProductTypeSearch from "@saleor/searches/useProductTypeSearch";

import { getProductErrorMessage } from "@saleor/utils/errors";
import useAttributeValueSearchHandler from "@saleor/utils/handlers/attributeValueSearchHandler";
import createDialogActionHandlers from "@saleor/utils/handlers/dialogActionHandlers";
import createMetadataCreateHandler from "@saleor/utils/handlers/metadataCreateHandler";
import { mapEdgesToItems } from "@saleor/utils/maps";
import {
  useMetadataUpdate,
  usePrivateMetadataUpdate
} from "@saleor/utils/metadata/updateMetadata";
import { useWarehouseList } from "@saleor/warehouses/queries";
import { warehouseAddPath } from "@saleor/warehouses/urls";
import React from "react";
import { useIntl } from "react-intl";
import { useHistory, useLocation } from "react-router-dom";

import { createHandler } from "./handlers";

interface ProductCreateProps {
  params: ProductCreateUrlQueryParams;
  defaultProductTypeId?: string;
}

export const ProductCreateView: React.FC<ProductCreateProps> = ({
  params,
  defaultProductTypeId = ""
}) => {
  const navigate = useNavigator();
  const notify = useNotifier();
  const shop = useShop();

  const { goBack } = useHistory();

  const { search } = useLocation();
  const isDigitalProduct = search.includes("isDigitalProduct");

  const intl = useIntl();
  const [productCreateComplete, setProductCreateComplete] = React.useState(
    false
  );
  const [selectedProductTypeId, setSelectedProductTypeId] = React.useState<
    string
  >(defaultProductTypeId);

  const [openModal, closeModal] = createDialogActionHandlers<
    ProductCreateUrlDialog,
    ProductCreateUrlQueryParams
  >(navigate, params => productAddUrl(params), params);

  const { result: searchCategoryOpts } = useCategorySearch({
    variables: DEFAULT_INITIAL_SEARCH_DATA,
    fetchPolicy: "cache-first"
  });

  const {
    loadMore: loadMoreProductTypes,
    search: searchProductTypes,
    result: searchProductTypesOpts
  } = useProductTypeSearch({
    variables: DEFAULT_INITIAL_SEARCH_DATA,
    fetchPolicy: "cache-first"
  });

  const {
    loadMore: loadMoreAttributeValues,
    search: searchAttributeValues,
    result: searchAttributeValuesOpts,
    reset: searchAttributeReset
  } = useAttributeValueSearchHandler(DEFAULT_INITIAL_SEARCH_DATA);
  const warehouses = useWarehouseList({
    displayLoader: false,
    variables: {
      first: 50
    },
    fetchPolicy: "cache-first"
  });
  const [updateMetadata] = useMetadataUpdate({});
  const [updatePrivateMetadata] = usePrivateMetadataUpdate({});

  const productTypes =
    mapEdgesToItems(searchProductTypesOpts?.data?.search) || [];

  const productType = productTypes.find(type => type.isDigital == isDigitalProduct)

  const { data: selectedProductType } = useProductTypeQuery({
    variables: {
      id: productType?.id,
      firstValues: VALUES_PAGINATE_BY
    },
    skip: !productType?.id,
    fetchPolicy: "cache-first"
  });

  const { availableChannels } = useAppChannel(false);
  const allChannels: ChannelData[] = createSortedChannelsData(
    availableChannels
  );

  const {
    currentChannels,
    handleChannelsModalOpen,
    setCurrentChannels
  } = useChannels(allChannels, params?.action, {
    closeModal,
    openModal
  });

  const handleSuccess = (productId: string) => {
    notify({
      status: "success",
      text: intl.formatMessage({
        defaultMessage: "Product created"
      })
    });
    navigate(productUrl(productId));
  };

  const [uploadFile, uploadFileOpts] = useFileUploadMutation({});

  const [updateChannels, updateChannelsOpts] = useProductChannelListingUpdate(
    {}
  );
  const [
    updateVariantChannels,
    updateVariantChannelsOpts
  ] = useProductVariantChannelListingUpdate({});

  const handleBack = () => goBack();

  const [productCreate, productCreateOpts] = useProductCreateMutation({
    refetchQueries: ["ProductList"]
  });
  const [deleteProduct] = useProductDeleteMutation({
    refetchQueries: ["ProductList"]
  });
  const [
    productVariantCreate,
    productVariantCreateOpts
  ] = useVariantCreateMutation({
    onCompleted: data => {
      const errors = data.productVariantCreate.errors;
      if (errors.length) {
        errors.map(error =>
          notify({
            status: "error",
            text: getProductErrorMessage(error, intl)
          })
        );
      }
    },
    refetchQueries: ["ProductList"]
  });

  const handleSubmit = async data => {
    const result = await createMetadataCreateHandler(
      createHandler(
        selectedProductType.productType,
        variables => uploadFile({ variables }),
        variables => productCreate({ variables }),
        variables => productVariantCreate({ variables }),
        updateChannels,
        updateVariantChannels,
        deleteProduct
      ),
      updateMetadata,
      updatePrivateMetadata
    )(data);

    if (result) {
      setProductCreateComplete(true);
    }
  };

  const handleAssignAttributeReferenceClick = (attribute: AttributeInput) =>
    navigate(
      productAddUrl({
        action: "assign-attribute-value",
        id: attribute.id
      })
    );

  React.useEffect(() => {
    const productId = productCreateOpts.data?.productCreate?.product?.id;

    if (productCreateComplete && productId) {
      handleSuccess(productId);
    }
  }, [productCreateComplete]);

  const fetchMoreProductTypes = {
    hasMore: searchProductTypesOpts.data?.search?.pageInfo?.hasNextPage,
    loading: searchProductTypesOpts.loading,
    onFetchMore: loadMoreProductTypes
  };

  const fetchMoreAttributeValues = {
    hasMore: !!searchAttributeValuesOpts.data?.attribute?.choices?.pageInfo
      ?.hasNextPage,
    loading: !!searchAttributeValuesOpts.loading,
    onFetchMore: loadMoreAttributeValues
  };

  const loading =
    uploadFileOpts.loading ||
    productCreateOpts.loading ||
    productVariantCreateOpts.loading ||
    updateChannelsOpts.loading ||
    updateVariantChannelsOpts.loading;

  return (
    <>
      <ProductCreatePage
        allChannelsCount={allChannels?.length}
        currentChannels={currentChannels}
        categories={mapEdgesToItems(searchCategoryOpts?.data?.search) || []}
        attributeValues={
          mapEdgesToItems(searchAttributeValuesOpts?.data?.attribute.choices) ||
          []
        }
        loading={loading}
        channelsErrors={
          updateVariantChannelsOpts.data?.productVariantChannelListingUpdate
            ?.errors
        }
        errors={[
          ...(productCreateOpts.data?.productCreate.errors || []),
          ...(productVariantCreateOpts.data?.productVariantCreate.errors || [])
        ]}
        fetchProductTypes={searchProductTypes}
        fetchAttributeValues={searchAttributeValues}
        header={intl.formatMessage({
          defaultMessage: "New Product",
          description: "page header"
        })}
        productTypes={productTypes}
        onBack={handleBack}
        onSubmit={handleSubmit}
        onWarehouseConfigure={() => navigate(warehouseAddPath)}
        saveButtonBarState={productCreateOpts.status}
        fetchMoreProductTypes={fetchMoreProductTypes}
        warehouses={mapEdgesToItems(warehouses?.data?.warehouses) || []}
        weightUnit={shop?.defaultWeightUnit}
        openChannelsModal={handleChannelsModalOpen}
        onChannelsChange={setCurrentChannels}
        assignReferencesAttributeId={
          params.action === "assign-attribute-value" && params.id
        }
        onAssignReferencesClick={handleAssignAttributeReferenceClick}
        fetchMoreAttributeValues={fetchMoreAttributeValues}
        onCloseDialog={() => navigate(productAddUrl())}
        selectedProductType={selectedProductType?.productType}
        onSelectProductType={id => setSelectedProductTypeId(id)}
        onAttributeSelectBlur={searchAttributeReset}
      />
    </>
  );
};
export default ProductCreateView;
