import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TableBody,
  TableCell,
  TableRow,
  TextField
} from "@mui/material";
import Checkbox from "@saleor/components/Checkbox";
import ConfirmButton, {
  ConfirmButtonTransitionState
} from "@saleor/components/ConfirmButton";
import FormSpacer from "@saleor/components/FormSpacer";
import Money from "@saleor/components/Money";
import ResponsiveTable from "@saleor/components/ResponsiveTable";
import TableCellAvatar from "@saleor/components/TableCellAvatar";
import { OrderErrorFragment } from "@saleor/fragments/types/OrderErrorFragment";
import useModalDialogErrors from "@saleor/hooks/useModalDialogErrors";
import useModalDialogOpen from "@saleor/hooks/useModalDialogOpen";
import useSearchQuery from "@saleor/hooks/useSearchQuery";
import { buttonMessages } from "@saleor/intl";
import { makeStyles } from "@saleor/macaw-ui";
import { maybe, renderCollection } from "@saleor/misc";
import { ChannelProps, FetchMoreProps } from "@saleor/types";
import getOrderErrorMessage from "@saleor/utils/errors/order";
import React from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { FormattedMessage, useIntl } from "react-intl";
import { closeOutline } from "ionicons/icons";
import Portal from "@mui/material/Portal";

import {
  IonModal,
  IonButton,
  IonIcon,
  IonSearchbar,
  IonFooter,
  IonContent,
  IonToolbar,
  IonButtons
} from "@ionic/react";

import {
  SearchOrderVariant_search_edges_node,
  SearchOrderVariant_search_edges_node_variants
} from "../../types/SearchOrderVariant";

const useStyles = makeStyles(
  theme => ({
    avatar: {
      paddingLeft: 0,
      width: 64
    },
    colName: {
      paddingLeft: 0
    },
    colVariantCheckbox: {
      padding: 0
    },
    content: {
      overflowY: "scroll",
      paddingTop: 0,
      marginBottom: theme.spacing(3)
    },
    grayText: {
      color: "white"
    },
    loadMoreLoaderContainer: {
      alignItems: "center",
      display: "flex",
      height: theme.spacing(3),
      justifyContent: "center",
      marginTop: theme.spacing(3)
    },
    overflow: {
      overflowY: "hidden"
    },
    topArea: {
      overflowY: "hidden",
      paddingBottom: theme.spacing(6),
      margin: theme.spacing(0, 3, 3, 3)
    },
    productCheckboxCell: {
      "&:first-of-type": {
        paddingLeft: 0,
        paddingRight: 0
      }
    },
    textRight: {
      textAlign: "right"
    },
    variantCheckbox: {
      left: theme.spacing(),
      position: "relative"
    },
    wideCell: {
      width: "100%"
    }
  }),
  { name: "OrderProductAddDialog" }
);

const spanStyle = {
  width: "100%",
  display: "block",
  position: "relative",
  top: "-2px",
  marginTop: "12px",
  fontFamily: "Inter",
  fontStyle: "normal",
  fontWeight: "600",
  fontSize: "14px",
  lineHeight: "20px",
  textAlign: "center",
  color: "#ffffff"
};

type SetVariantsAction = (
  data: SearchOrderVariant_search_edges_node_variants[]
) => void;

export interface OrderProductAddDialogProps
  extends FetchMoreProps,
    ChannelProps {
  confirmButtonState: ConfirmButtonTransitionState;
  errors: OrderErrorFragment[];
  open: boolean;
  products: SearchOrderVariant_search_edges_node[];
  onClose: () => void;
  onFetch: (query: string) => void;
  onSubmit: (data: SearchOrderVariant_search_edges_node_variants[]) => void;
}

function hasAllVariantsSelected(
  productVariants: SearchOrderVariant_search_edges_node_variants[],
  selectedVariantsToProductsMap: SearchOrderVariant_search_edges_node_variants[]
): boolean {
  return productVariants.reduce(
    (acc, productVariant) =>
      acc &&
      !!selectedVariantsToProductsMap.find(
        selectedVariant => selectedVariant.id === productVariant.id
      ),
    true
  );
}

function isVariantSelected(
  variant: SearchOrderVariant_search_edges_node_variants,
  selectedVariantsToProductsMap: SearchOrderVariant_search_edges_node_variants[]
): boolean {
  return !!selectedVariantsToProductsMap.find(
    selectedVariant => selectedVariant.id === variant.id
  );
}

const onProductAdd = (
  product: SearchOrderVariant_search_edges_node,
  productIndex: number,
  productsWithAllVariantsSelected: boolean[],
  variants: SearchOrderVariant_search_edges_node_variants[],
  setVariants: SetVariantsAction
) =>
  productsWithAllVariantsSelected[productIndex]
    ? setVariants(
        variants.filter(
          selectedVariant =>
            !product.variants.find(
              productVariant => productVariant.id === selectedVariant.id
            )
        )
      )
    : setVariants([
        ...variants,
        ...product.variants.filter(
          productVariant =>
            !variants.find(
              selectedVariant => selectedVariant.id === productVariant.id
            )
        )
      ]);

const onVariantAdd = (
  variant: SearchOrderVariant_search_edges_node_variants,
  variantIndex: number,
  productIndex: number,
  variants: SearchOrderVariant_search_edges_node_variants[],
  selectedVariantsToProductsMap: boolean[][],
  setVariants: SetVariantsAction
) =>
  selectedVariantsToProductsMap[productIndex][variantIndex]
    ? setVariants(
        variants.filter(selectedVariant => selectedVariant.id !== variant.id)
      )
    : setVariants([...variants, variant]);

const scrollableTargetId = "orderProductAddScrollableDialog";

const OrderProductAddDialog: React.FC<OrderProductAddDialogProps> = props => {
  const {
    confirmButtonState,
    errors: apiErrors,
    open,
    loading,
    hasMore,
    products,
    selectedChannelId,
    onFetch,
    onFetchMore,
    onClose,
    onSubmit
  } = props;

  const classes = useStyles(props);
  const intl = useIntl();
  const [query, onQueryChange] = useSearchQuery(onFetch);
  const [variants, setVariants] = React.useState<
    SearchOrderVariant_search_edges_node_variants[]
  >([]);
  const errors = useModalDialogErrors(apiErrors, open);

  useModalDialogOpen(open, {
    onClose: () => setVariants([])
  });

  const isValidVariant = ({
    channelListings
  }: SearchOrderVariant_search_edges_node_variants) => {
    const currentListing = channelListings.find(
      listing => listing.channel.id === selectedChannelId
    );

    const listingPrice = currentListing?.price?.amount;

    const isVariantPriceSet =
      listingPrice !== null && listingPrice !== undefined;

    return !!currentListing && isVariantPriceSet;
  };

  const getValidProductVariants = ({
    variants
  }: SearchOrderVariant_search_edges_node) => variants.filter(isValidVariant);

  const productChoices =
    products?.filter(product => getValidProductVariants(product).length > 0) ||
    [];

  const selectedVariantsToProductsMap = productChoices
    ? productChoices.map(product =>
        getValidProductVariants(product).map(variant =>
          isVariantSelected(variant, variants)
        )
      )
    : [];

  const productsWithAllVariantsSelected = productChoices
    ? productChoices.map(product =>
        hasAllVariantsSelected(getValidProductVariants(product), variants)
      )
    : [];

  const handleSubmit = () => onSubmit(variants);

  const productChoicesWithValidVariants = productChoices.filter(
    ({ variants }) => variants.some(isValidVariant)
  );
  console.log("productChoicesWithValidVariants", {
    productChoicesWithValidVariants,
    products,
    variants
  });
  return (
    <>
      <IonModal
        // presentingElement={document.getElementsByTagName("BODY")[0]}
        isOpen={open}
        initialBreakpoint={0.91}
        showBackdrop={false}
        swipeToClose={false}
        onDidDismiss={async () => {
          onClose();
        }}
      >
        <>
          <span style={spanStyle}>Add Product</span>

          <IonButton
            data-test={"close-modal"}
            size="small"
            style={{
              position: "absolute",
              right: "0",
              top: "4px"
            }}
            fill="clear"
            onClick={() => {
              onClose(false);
            }}
          >
            <IonIcon slot="icon-only" color="dark" icon={closeOutline} />
          </IonButton>
        </>

        {/* < data-test-id="searchQuery"> */}
        <IonSearchbar
          name="query"
          value={query}
          showClearButton={true}
          onIonChange={onQueryChange}
          label={intl.formatMessage({
            defaultMessage: "Search Products"
          })}
          placeholder={intl.formatMessage({
            defaultMessage:
              "Search by product name, attribute, product type etc..."
          })}
          loading={loading}
          fullWidth
          // InputProps={{
          //   autoComplete: "off",
          //   endAdornment: loading && <CircularProgress size={16} />
          // }}
        />

        <IonContent>
          {/* </> */}
          {/* <DialogContent className={classes.content} id={scrollableTargetId}> */}
          <InfiniteScroll
            dataLength={productChoicesWithValidVariants?.length}
            next={onFetchMore}
            hasMore={hasMore}
            scrollThreshold="100px"
            loader={
              <div className={classes.loadMoreLoaderContainer}>
                <CircularProgress size={16} />
              </div>
            }
            scrollableTarget={scrollableTargetId}
          >
            <ResponsiveTable key="table">
              <TableBody>
                {renderCollection(
                  productChoicesWithValidVariants,
                  (product, productIndex) => (
                    <React.Fragment key={product ? product.id : "skeleton"}>
                      <TableRow>
                        <TableCell
                          padding="checkbox"
                          className={classes.productCheckboxCell}
                        >
                          <Checkbox
                            checked={
                              productsWithAllVariantsSelected[productIndex]
                            }
                            disabled={loading}
                            onChange={() =>
                              onProductAdd(
                                product,
                                productIndex,
                                productsWithAllVariantsSelected,
                                variants,
                                setVariants
                              )
                            }
                          />
                        </TableCell>
                        <TableCellAvatar
                          className={classes.avatar}
                          thumbnail={maybe(() => product.thumbnail.url)}
                        />
                        <TableCell className={classes.colName} colSpan={2}>
                          {maybe(() => product.name)}
                        </TableCell>
                      </TableRow>
                      {maybe(() => product.variants, [])
                        .filter(isValidVariant)
                        .map((variant, variantIndex) => (
                          <TableRow key={variant.id}>
                            <TableCell />
                            <TableCell className={classes.colVariantCheckbox}>
                              <Checkbox
                                className={classes.variantCheckbox}
                                checked={
                                  selectedVariantsToProductsMap[productIndex][
                                    variantIndex
                                  ]
                                }
                                disabled={loading}
                                onChange={() =>
                                  onVariantAdd(
                                    variant,
                                    variantIndex,
                                    productIndex,
                                    variants,
                                    selectedVariantsToProductsMap,
                                    setVariants
                                  )
                                }
                              />
                            </TableCell>
                            <TableCell className={classes.colName}>
                              <div>{variant.name}</div>
                              {variant.sku && (
                                <div className={classes.grayText}>
                                  <FormattedMessage
                                    defaultMessage="SKU {sku}"
                                    description="variant sku"
                                    values={{
                                      sku: variant.sku
                                    }}
                                  />
                                </div>
                              )}
                            </TableCell>
                            <TableCell className={classes.textRight}>
                              {variant?.channelListings[0]?.price && (
                                <Money
                                  money={variant.channelListings[0].price}
                                />
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                    </React.Fragment>
                  ),
                  () => (
                    <TableRow>
                      <TableCell colSpan={4}>
                        <FormattedMessage defaultMessage="No products available in order channel matching given query" />
                      </TableCell>
                    </TableRow>
                  )
                )}
              </TableBody>
            </ResponsiveTable>
            <div style={{ height: "200px" }} />
          </InfiniteScroll>
          {errors.length > 0 && (
            <>
              <FormSpacer />
              {errors.map((err, index) => (
                <DialogContentText color="error" key={index}>
                  {getOrderErrorMessage(err, intl)}
                </DialogContentText>
              ))}
            </>
          )}
          {/* </DialogContent> */}
          <IonFooter
            style={{
              // height: "60px",
              // bottom: "60px",
              // position: 'fixed',
              top: "calc(91% - 50px)",
              position: "fixed"
            }}
            // slot="fixed"
          >
            <IonToolbar>
              <IonButtons slot="primary">
                <IonButton fill="clear" onClick={onClose}>
                  <FormattedMessage {...buttonMessages.back} />
                </IonButton>
                <IonButton
                  disabled={variants.length === 0}
                  // transitionState={confirmButtonState}
                  color="primary"
                  // variant="contained"
                  type="submit"
                  onClick={handleSubmit}
                >
                  <FormattedMessage {...buttonMessages.confirm} />
                </IonButton>
              </IonButtons>
            </IonToolbar>
          </IonFooter>
        </IonContent>
      </IonModal>
    </>
  );
};
OrderProductAddDialog.displayName = "OrderProductAddDialog";
export default OrderProductAddDialog;
