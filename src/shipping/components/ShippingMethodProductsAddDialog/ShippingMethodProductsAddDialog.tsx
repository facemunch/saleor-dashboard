import {
  CircularProgress,
  DialogContent,
  TableBody,
  TableCell,
  TableRow,
  TextField
} from "@mui/material";
import Checkbox from "@saleor/components/Checkbox";
import { ConfirmButtonTransitionState } from "@saleor/components/ConfirmButton";
import ResponsiveTable from "@saleor/components/ResponsiveTable";
import Skeleton from "@saleor/components/Skeleton";
import TableCellAvatar from "@saleor/components/TableCellAvatar";
import useSearchQuery from "@saleor/hooks/useSearchQuery";
import { makeStyles, useActionBar } from "@saleor/macaw-ui";
import Savebar from "@saleor/components/Savebar";

import { renderCollection } from "@saleor/misc";
import { SearchProducts_search_edges_node } from "@saleor/searches/types/SearchProducts";
import { ShippingPriceExcludeProduct } from "@saleor/shipping/types/ShippingPriceExcludeProduct";
import { FetchMoreProps } from "@saleor/types";
import React from "react";
import { MutationFetchResult } from "react-apollo";
import InfiniteScroll from "react-infinite-scroll-component";
import { FormattedMessage, useIntl } from "react-intl";
import { closeOutline } from "ionicons/icons";

import { IonModal, IonContent, IonButton, IonIcon } from "@ionic/react";

const useStyles = makeStyles(
  theme => ({
    avatar: {
      paddingLeft: 0,
      width: 64
    },
    colName: {
      paddingLeft: 0
    },
    content: {
      overflowY: "scroll"
    },
    loadMoreLoaderContainer: {
      alignItems: "center",
      display: "flex",
      height: theme.spacing(3),
      justifyContent: "center",
      marginTop: theme.spacing(3)
    },
    overflow: {
      overflowY: "visible"
    },
    productCheckboxCell: {
      "&:first-of-type": {
        paddingLeft: 0,
        paddingRight: 0
      }
    }
  }),
  { name: "ShippingMethodProductsAddDialog" }
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

export interface ShippingMethodProductsAddDialogProps extends FetchMoreProps {
  confirmButtonState: ConfirmButtonTransitionState;
  open: boolean;
  shippingPriceRatesEditRef: any;
  products: SearchProducts_search_edges_node[];
  onClose: () => void;
  onFetch: (query: string) => void;
  onSubmit: (
    ids: string[]
  ) => Promise<MutationFetchResult<ShippingPriceExcludeProduct>>;
}

const handleProductAssign = (
  product: SearchProducts_search_edges_node,
  isSelected: boolean,
  selectedProducts: SearchProducts_search_edges_node[],
  setSelectedProducts: (data: SearchProducts_search_edges_node[]) => void
) => {
  if (isSelected) {
    setSelectedProducts(
      selectedProducts.filter(
        selectedProduct => selectedProduct.id !== product.id
      )
    );
  } else {
    setSelectedProducts([...selectedProducts, product]);
  }
};

const scrollableTargetId = "shippingMethodProductsAddScrollableDialog";

const ShippingMethodProductsAddDialog: React.FC<ShippingMethodProductsAddDialogProps> = props => {
  const {
    open,
    loading,
    hasMore,
    products,
    onFetch,
    onFetchMore,
    onClose,
    onSubmit,
    shippingPriceRatesEditRef
  } = props;

  const classes = useStyles(props);
  const intl = useIntl();
  const [query, onQueryChange, resetQuery] = useSearchQuery(onFetch);
  const [selectedProducts, setSelectedProducts] = React.useState<
    SearchProducts_search_edges_node[]
  >([]);

  const handleSubmit = () => {
    onSubmit(selectedProducts.map(product => product.id)).then(() => {
      setSelectedProducts([]);
      resetQuery();
    });
  };

  const handleClose = () => {
    onClose();
    setSelectedProducts([]);
    resetQuery();
  };
  return (
    <IonModal
      style={{
        "--border-radius": "16px"
      }}
      mode="ios"
      backdropDismiss={true}
      isOpen={open}
      presentingElement={shippingPriceRatesEditRef?.current || undefined}
      canDismiss={true}
      onDidDismiss={() => {
        open && handleClose();
      }}
    >
      <>
        <span style={spanStyle}>
          <FormattedMessage
            defaultMessage="Assign Products"
            description="dialog header"
          />
        </span>

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
            handleClose();
          }}
        >
          <IonIcon slot="icon-only" color="dark" icon={closeOutline} />
        </IonButton>
      </>
      <IonContent>
        <DialogContent className={classes.overflow}>
          <TextField
            name="query"
            value={query}
            onChange={onQueryChange}
            label={intl.formatMessage({
              defaultMessage: "Search Products"
            })}
            placeholder={intl.formatMessage({
              defaultMessage: "Search Products"
            })}
            fullWidth
            InputProps={{
              autoComplete: "off",
              endAdornment: loading && <CircularProgress size={16} />
            }}
          />
        </DialogContent>
        <DialogContent className={classes.content} id={scrollableTargetId}>
          <InfiniteScroll
            dataLength={products?.length}
            next={onFetchMore}
            hasMore={hasMore}
            scrollThreshold="100px"
            loader={
              <div key="loader" className={classes.loadMoreLoaderContainer}>
                <CircularProgress size={16} />
              </div>
            }
            scrollableTarget={scrollableTargetId}
          >
            <ResponsiveTable key="table">
              <TableBody>
                {renderCollection(
                  products,
                  (product, productIndex) => {
                    const isSelected = selectedProducts.some(
                      selectedProduct => selectedProduct.id === product.id
                    );
                    return (
                      <React.Fragment
                        key={product ? product.id : `skeleton-${productIndex}`}
                      >
                        <TableRow>
                          <TableCell
                            padding="checkbox"
                            className={classes.productCheckboxCell}
                          >
                            {product && (
                              <Checkbox
                                checked={isSelected}
                                disabled={loading}
                                onChange={() =>
                                  handleProductAssign(
                                    product,
                                    isSelected,
                                    selectedProducts,
                                    setSelectedProducts
                                  )
                                }
                              />
                            )}
                          </TableCell>
                          <TableCellAvatar
                            className={classes.avatar}
                            thumbnail={product?.thumbnail?.url}
                          />
                          <TableCell className={classes.colName} colSpan={2}>
                            {product?.name || <Skeleton />}
                          </TableCell>
                        </TableRow>
                      </React.Fragment>
                    );
                  },
                  () => (
                    <TableRow>
                      <TableCell colSpan={4}>
                        <FormattedMessage defaultMessage="No products matching given query" />
                      </TableCell>
                    </TableRow>
                  )
                )}
              </TableBody>
            </ResponsiveTable>
          </InfiniteScroll>
        </DialogContent>
      </IonContent>
      <Savebar
        disabled={false}
        state={"success"}
        onCancel={handleClose}
        onSubmit={handleSubmit}
      />
    </IonModal>
  );
};
ShippingMethodProductsAddDialog.displayName = "ShippingMethodProductsAddDialog";
export default ShippingMethodProductsAddDialog;
