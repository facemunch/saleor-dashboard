import {
  Button,
  Card,
  IconButton,
  TableBody,
  TableCell,
  TableFooter,
  TableRow
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import CardTitle from "@saleor/components/CardTitle";
import { ChannelsAvailabilityDropdown } from "@saleor/components/ChannelsAvailabilityDropdown";
import Checkbox from "@saleor/components/Checkbox";
import ResponsiveTable from "@saleor/components/ResponsiveTable";
import Skeleton from "@saleor/components/Skeleton";
import TableCellAvatar from "@saleor/components/TableCellAvatar";
import TableHead from "@saleor/components/TableHead";
import TablePagination from "@saleor/components/TablePagination";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { maybe, renderCollection } from "../../../misc";
import { ListActions, ListProps } from "../../../types";
import { SaleDetails_sale_products_edges_node } from "../../types/SaleDetails";
import { VoucherDetails_voucher_products_edges_node } from "../../types/VoucherDetails";
import { messages } from "./messages";
import { useStyles } from "./styles";
export interface SaleProductsProps extends ListProps, ListActions {
  products:
    | SaleDetails_sale_products_edges_node[]
    | VoucherDetails_voucher_products_edges_node[];
  channelsCount: number;
  onProductAssign: () => void;
  onProductUnassign: (id: string) => void;
}

const numberOfColumns = 5;

const DiscountProducts: React.FC<SaleProductsProps> = props => {
  const {
    channelsCount,
    products,
    disabled,
    pageInfo,
    onRowClick,
    onPreviousPage,
    onProductAssign,
    onProductUnassign,
    onNextPage,
    isChecked,
    selected,
    toggle,
    toggleAll,
    toolbar
  } = props;
  const classes = useStyles(props);

  const intl = useIntl();

  return (
    <Card>
      <CardTitle
        title={intl.formatMessage(messages.discountProductsHeader)}
        toolbar={
          <Button
            color="primary"
            onClick={onProductAssign}
            data-test-id="assign-products"
          >
            <FormattedMessage {...messages.discountProductsButton} />
          </Button>
        }
      />
      <ResponsiveTable>
        <colgroup>
          <col />
          <col className={classes.colName} />
          <col className={classes.colType} />
          <col className={classes.colPublished} />
          <col className={classes.colActions} />
        </colgroup>
        <TableHead
          colSpan={numberOfColumns}
          selected={selected}
          disabled={disabled}
          items={products}
          toggleAll={toggleAll}
          toolbar={toolbar}
        >
          <TableCell className={classes.colName}>
            <span className={products?.length > 0 && classes.colNameLabel}>
              <FormattedMessage
                {...messages.discountProductsTableProductHeader}
              />
            </span>
          </TableCell>
          <TableCell className={classes.colType}>
            <FormattedMessage {...messages.discountProductsTableTypeHeader} />
          </TableCell>
          <TableCell className={classes.colPublished}>
            <FormattedMessage
              {...messages.discountProductsTableAvailabilityHeader}
            />
          </TableCell>
          <TableCell className={classes.colActions} />
        </TableHead>
        <TableFooter>
          <TableRow>
            <TablePagination
              colSpan={numberOfColumns}
              hasNextPage={pageInfo && !disabled ? pageInfo.hasNextPage : false}
              onNextPage={onNextPage}
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

              return (
                <TableRow
                  hover={!!product}
                  key={product ? product.id : "skeleton"}
                  onClick={product && onRowClick(product.id)}
                  className={classes.tableRow}
                  selected={isSelected}
                >
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={isSelected}
                      disabled={disabled}
                      disableClickPropagation
                      onChange={() => toggle(product.id)}
                    />
                  </TableCell>
                  <TableCellAvatar
                    className={classes.colName}
                    thumbnail={maybe(() => product.thumbnail.url)}
                  >
                    {maybe<React.ReactNode>(() => product.name, <Skeleton />)}
                  </TableCellAvatar>
                  <TableCell className={classes.colType}>
                    {maybe<React.ReactNode>(
                      () => product.productType.name,
                      <Skeleton />
                    )}
                  </TableCell>
                  <TableCell className={classes.colType}>
                    {product && !product?.channelListings?.length ? (
                      "-"
                    ) : product?.channelListings !== undefined ? (
                      <ChannelsAvailabilityDropdown
                        allChannelsCount={channelsCount}
                        channels={product?.channelListings}
                      />
                    ) : (
                      <Skeleton />
                    )}
                  </TableCell>
                  <TableCell className={classes.colActions}>
                    <IconButton
                      disabled={!product || disabled}
                      onClick={event => {
                        event.stopPropagation();
                        onProductUnassign(product.id);
                      }}
                    >
                      <DeleteIcon color="primary" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              );
            },
            () => (
              <TableRow>
                <TableCell colSpan={numberOfColumns}>
                  <FormattedMessage {...messages.discountProductsNotFound} />
                </TableCell>
              </TableRow>
            )
          )}
        </TableBody>
      </ResponsiveTable>
    </Card>
  );
};
DiscountProducts.displayName = "DiscountProducts";
export default DiscountProducts;
