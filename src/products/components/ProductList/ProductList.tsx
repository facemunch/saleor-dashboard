import {
  IonCardContent,
  IonImg,
  IonItem,
  IonLabel,
  IonList,
  IonNote,
  IonThumbnail,
  IonRippleEffect
} from "@ionic/react";
import Skeleton from "@saleor/components/Skeleton";
import { ProductListColumns } from "@saleor/config";
import { makeStyles } from "@saleor/macaw-ui";
import { maybe } from "@saleor/misc";
import { GridAttributes_grid_edges_node } from "@saleor/products/types/GridAttributes";
import { ProductList_products_edges_node } from "@saleor/products/types/ProductList";
import { ProductListUrlSortField } from "@saleor/products/urls";
import { ChannelProps, ListActions, ListProps, SortPage } from "@saleor/types";
import React from "react";
import { FormattedMessage } from "react-intl";
import { Loader } from "frontend/ui/loader";

const useStyles = makeStyles(
  theme => ({
    [theme.breakpoints.up("md")]: {
      colName: {
        minWidth: 250
      },
      colPrice: {
        width: 300
      },
      colPublished: {
        width: 200
      },
      colType: {
        width: 200
      }
    },
    colAttribute: {
      width: 150
    },
    colFill: {
      padding: 0,
      width: "100%"
    },
    colName: {
      "&$colNameFixed": {
        width: 250
      }
    },
    colNameFixed: {},
    colNameHeader: {
      marginLeft: "-5px"
    },
    colNameWrapper: {
      display: "block"
    },
    colPrice: {
      textAlign: "right"
    },
    colPublished: {},
    colType: {},
    link: {
      width: "100%",
      cursor: "pointer"
    },
    table: {
      tableLayout: "fixed"
    },
    tableContainer: {
      overflowX: "scroll"
    },
    textLeft: {
      textAlign: "left"
    },
    textRight: {
      textAlign: "right"
    }
  }),
  { name: "ProductList" }
);
const styleH2 = {
  fontFamily: "Inter",
  fontStyle: "normal",
  fontWeight: "400",
  fontSize: "14px",
  lineHeight: "20px",
  color: "#FFFFFF"
};

interface ProductListProps extends ListProps<ProductListColumns>, ChannelProps {
  activeAttributeSortId: string;
  gridAttributes: GridAttributes_grid_edges_node[];
  products: ProductList_products_edges_node[];
  loading: boolean;
  channelsCount: number;
}

export const ProductList: React.FC<ProductListProps> = props => {
  const { products, onRowClick, loading } = props;
  const classes = useStyles(props);
  return (
    <IonList
      style={{ "--ion-item-background": "#313131", paddingBottom: 4 }}
      data-test-id="product-list"
    >
      {loading && <Loader />}
      {!loading &&
        products &&
        products.length > 0 &&
        products.map(product => {
          let channel;
          if (product?.channelListings) {
            channel = product?.channelListings.find(
              listing => listing.channel.name === "USD"
            );
          }

          return (
            <IonItem
              button
              detail={false}
              key={product ? product.id : "skeleton"}
              onClick={
                product &&
                onRowClick(
                  product.id
                )
              }
              className={classes.link}
              data-test-id="product-item"
            >
              <IonThumbnail
                style={{ borderRadius: "8px", overflow: "hidden" }}
                slot="start"
              >
                <IonImg src={maybe(() => product.thumbnail.url)} />
              </IonThumbnail>
              <IonLabel>
                <h2 style={styleH2}>
                  {product?.productType ? (
                    <span data-test="name">{product.name}</span>
                  ) : (
                    <Skeleton />
                  )}
                </h2>
                <h4 style={{ color: "#B3B3B3", textTransform: "capitalize" }}>
                  {product?.productType?.name &&
                    product.productType.name.replace(" product", "")}{" "}
                  •{" "}
                  {product.channelListings &&
                  product.channelListings.length > 0 &&
                  product.channelListings[0].isAvailableForPurchase
                    ? "available"
                    : "draft"}
                </h4>
              </IonLabel>

              <IonNote
                style={{ color: "White", textTransform: "capitalize" }}
                slot="end"
              >
                {product?.channelListings ? (
                  <>${channel?.pricing?.priceRange?.stop?.net?.amount}</>
                ) : (
                  <Skeleton />
                )}
              </IonNote>
              <IonRippleEffect type="unbounded"></IonRippleEffect>
            </IonItem>
          );
        })}

      {!loading && products && products.length === 0 && (
        <IonCardContent style={{ textAlign: "center" }}>
          <FormattedMessage defaultMessage="No products found" />
        </IonCardContent>
      )}
    </IonList>
  );
};
ProductList.displayName = "ProductList";
export default ProductList;
