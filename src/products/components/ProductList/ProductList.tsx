import {
  TableBody,
  TableCell,
  TableFooter,
  TableRow,
  Typography,
  Box
} from "@mui/material";
import { MasonryInfiniteGrid } from "@egjs/react-infinitegrid";

import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import AvailabilityStatusLabel from "@saleor/components/AvailabilityStatusLabel";
import { ChannelsAvailabilityDropdown } from "@saleor/components/ChannelsAvailabilityDropdown";
import Checkbox from "@saleor/components/Checkbox";
import MoneyRange from "@saleor/components/MoneyRange";
import ResponsiveTable from "@saleor/components/ResponsiveTable";
import Skeleton from "@saleor/components/Skeleton";
import TableCellAvatar from "@saleor/components/TableCellAvatar";
import { AVATAR_MARGIN } from "@saleor/components/TableCellAvatar/Avatar";
import TableCellHeader from "@saleor/components/TableCellHeader";
import TableHead from "@saleor/components/TableHead";
import TablePagination from "@saleor/components/TablePagination";
import { ProductListColumns } from "@saleor/config";
import { makeStyles } from "@saleor/macaw-ui";
import { maybe, renderCollection } from "@saleor/misc";
import {
  getAttributeIdFromColumnValue,
  isAttributeColumnValue
} from "@saleor/products/components/ProductListPage/utils";
import { GridAttributes_grid_edges_node } from "@saleor/products/types/GridAttributes";
import { ProductList_products_edges_node } from "@saleor/products/types/ProductList";
import { ProductListUrlSortField } from "@saleor/products/urls";
import { canBeSorted } from "@saleor/products/views/ProductList/sort";
import { ChannelProps, ListActions, ListProps, SortPage } from "@saleor/types";
import TDisplayColumn, {
  DisplayColumnProps
} from "@saleor/utils/columns/DisplayColumn";
import { getArrowDirection } from "@saleor/utils/sort";
import classNames from "classnames";
import React from "react";
import { FormattedMessage } from "react-intl";

import { messages } from "./messages";

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
      marginLeft: AVATAR_MARGIN
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
    activeAttributeSortId,
    channelsCount,
    settings,
    disabled,
    isChecked,
    gridAttributes,
    pageInfo,
    products,
    selected,
    sort,
    toggle,
    toggleAll,
    toolbar,
    onNextPage,
    onPreviousPage,
    onUpdateListSettings,
    onRowClick,
    onSort,
    selectedChannelId
  } = props;

  const classes = useStyles(props);
  const gridAttributesFromSettings = settings.columns.filter(
    isAttributeColumnValue
  );
  const numberOfColumns = 2 + settings.columns.length;

  return (
    <Box sx={{ p: 1 }}>
      <MasonryInfiniteGrid
        className="container"
        gap={5}
        column={2}
        // align={"justify"}
        onRequestAppend={e => {
          // const nextGroupKey = (+e.groupKey! || 0) + 1;
          // setItems([
          // ...items,
          // ...getItems(nextGroupKey, 10),
          // ]);
        }}
        onRenderComplete={e => {
          console.log(e);
        }}
      >
        {/* </TableHead> */}
        {/* <TableFooter>
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
        </TableFooter> */}
        {renderCollection(products, product => {
          const isSelected = product ? isChecked(product.id) : false;
          const channel = product?.channelListings.find(
            listing => listing.channel.name === "usd"
          );
          console.log("product", {
            product,
            gridAttributesFromSettings,
            channel
          });
          return (
            <Card
              // selected={isSelected}
              // hover={!!product}
              sx={{ height: "fit-content", width: "48vw" }}
              key={product ? product.id : "skeleton"}
              onClick={product && onRowClick(product.id)}
              //@ts-ignore
              data-grid-groupkey={product && product.id}
              // className={classes.link}
              // data-test="id"
              // data-test-id={product ? product?.id : "skeleton"}
            >
              {/* <TableCell padding="checkbox">
                    <Checkbox
                      checked={isSelected}
                      disabled={disabled}
                      disableClickPropagation
                      onChange={() => toggle(product.id)}
                    />
                  </TableCell> */}
              <CardMedia
                data-grid-maintained-target="true"
                component="img"
                alt={maybe(() => product.thumbnail.url)}
                height="100"
                image={maybe(() => product.thumbnail.url)}
              />
              <CardContent>
                {product?.productType ? (
                  <Typography gutterBottom variant="h5" component="div">
                    <span data-test="name">{product.name}</span>
                  </Typography>
                ) : (
                  <Skeleton />
                )}
                {gridAttributesFromSettings.map(gridAttribute => (
                  <Typography
                    key={gridAttribute}
                    data-test="attribute"
                    data-test-attribute={getAttributeIdFromColumnValue(
                      gridAttribute
                    )}
                  >
                    {maybe<React.ReactNode>(() => {
                      const attribute = product.attributes.find(
                        attribute =>
                          attribute.attribute.id ===
                          getAttributeIdFromColumnValue(gridAttribute)
                      );
                      if (attribute) {
                        return attribute.values
                          .map(value => value.name)
                          .join(", ");
                      }
                      return "-";
                    }, <Skeleton />)}
                  </Typography>
                ))}
              </CardContent>
              <CardActions>
                {product?.channelListings ? (
                  <MoneyRange
                    from={channel?.pricing?.priceRange?.start?.net}
                    // to={channel?.pricing?.priceRange?.stop?.net}
                  />
                ) : (
                  <Skeleton />
                )}
              </CardActions>
            </Card>
          );
        })}
      </MasonryInfiniteGrid>
    </Box>
  );
};
ProductList.displayName = "ProductList";
export default ProductList;
