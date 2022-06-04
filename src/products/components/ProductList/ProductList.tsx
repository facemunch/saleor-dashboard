import {
  TableBody,
  TableCell,
  TableFooter,
  TableRow,
  Typography
} from "@mui/material";
import Skeleton from "@saleor/components/Skeleton";
import TableCellAvatar from "@saleor/components/TableCellAvatar";
import TablePagination from "@saleor/components/TablePagination";
import { ProductListColumns } from "@saleor/config";
import { makeStyles } from "@saleor/macaw-ui";
import { maybe, renderCollection } from "@saleor/misc";
import { GridAttributes_grid_edges_node } from "@saleor/products/types/GridAttributes";
import { ProductList_products_edges_node } from "@saleor/products/types/ProductList";
import { ProductListUrlSortField } from "@saleor/products/urls";
import { ChannelProps, ListActions, ListProps, SortPage } from "@saleor/types";
import TDisplayColumn, {
  DisplayColumnProps
} from "@saleor/utils/columns/DisplayColumn";
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

const DisplayColumn = TDisplayColumn as React.FunctionComponent<
  DisplayColumnProps<ProductListColumns>
>;

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
  const {
    settings,
    disabled,
    isChecked,
    pageInfo,
    products,
    onNextPage,
    onPreviousPage,
    onUpdateListSettings,
    onRowClick,
    selectedChannelId
  } = props;

  const classes = useStyles(props);
  const numberOfColumns = 2 + settings.columns.length;
  return (
    <div className={classes.tableContainer}>
      <TableFooter>
        <TableRow>
          <TablePagination
            colSpan={numberOfColumns}
            settings={settings}
            hasNextPage={pageInfo && !disabled ? pageInfo.hasNextPage : false}
            onNextPage={onNextPage}
            onUpdateListSettings={onUpdateListSettings}
            hasPreviousPage={
              pageInfo && !disabled ? pageInfo.hasPreviousPage : false
            }
            onPreviousPage={onPreviousPage}
          />
        </TableRow>
      </TableFooter>
      <TableBody>
        {renderCollection(
          products,
          product => {
            const isSelected = product ? isChecked(product.id) : false;
            const channel = product?.channelListings.find(
              listing => listing.channel.id === selectedChannelId
            );

            return (
              <TableRow
                selected={isSelected}
                hover={!!product}
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
             
                <TableCellAvatar thumbnail={maybe(() => product.thumbnail.url)}>
                  {product?.productType ? (
                    // <div className={classes.colNameWrapper}>
                    <span data-test="name">{product.name}</span>
                  ) : (
                    // </div>
                    <Skeleton />
                  )}
                </TableCellAvatar>
                <DisplayColumn
                  column="productType"
                  displayColumns={settings.columns}
                >
                  <TableCell
                    className={classes.colType}
                    data-test="product-type"
                  >
                    {product?.productType && (
                      <Typography variant="caption">
                        {product?.productType?.name || <Skeleton />}{" "}
                      </Typography>
                    )}
                  </TableCell>
                </DisplayColumn>

           
                <DisplayColumn column="price" displayColumns={settings.columns}>
                  <TableCell className={classes.colPrice} data-test="price">
                    {product?.channelListings ? (
                      <>
                        $ {channel?.pricing?.priceRange?.stop?.net?.amount}
                        {/* <MoneyRange
                        from={channel?.pricing?.priceRange?.start?.net}
                        to={channel?.pricing?.priceRange?.stop?.net}
                      /> */}
                      </>
                    ) : (
                      <Skeleton />
                    )}
                  </TableCell>
                </DisplayColumn>
              </TableRow>
            );
          },
          () => (
            <TableRow>
              <TableCell colSpan={numberOfColumns}>
                <FormattedMessage defaultMessage="No products found" />
              </TableCell>
            </TableRow>
          )
        )}
      </TableBody>
      {/* </ResponsiveTable> */}
    </div>
  );
};
ProductList.displayName = "ProductList";
export default ProductList;
