import {
  IonImg,
  IonItem,
  IonLabel,
  IonList,
  IonNote,
  IonThumbnail
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

interface ProductListProps
  extends ListProps<ProductListColumns>,
    ListActions,
    SortPage<ProductListUrlSortField>,
    ChannelProps {
  activeAttributeSortId: string;
  gridAttributes: GridAttributes_grid_edges_node[];
  products: ProductList_products_edges_node[];
  loading: boolean;
  channelsCount: number;
}

export const ProductList: React.FC<ProductListProps> = props => {
  const { products, onRowClick } = props;

  const classes = useStyles(props);
  return (
    <IonList style={{ "--ion-item-background": "#313131", paddingBottom: 4 }}>
      {products &&
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
              key={product ? product.id : "skeleton"}
              onClick={
                product &&
                onRowClick(
                  product.id,
                  product.productType.name === "Digital product"
                    ? "?isDigitalProduct=true"
                    : ""
                )
              }
              className={classes.link}
              data-test="id"
              data-test-id={product ? product?.id : "skeleton"}
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
                  product.channelListings[0].isPublished
                    ? "published"
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
            </IonItem>
          );
        })}

      {products && products.length === 0 && (
        <div>
          <div>
            <FormattedMessage defaultMessage="No products found" />
          </div>
        </div>
      )}
    </IonList>
  );
};
ProductList.displayName = "ProductList";
export default ProductList;
