import { Card, CardContent, TableBody, TableCell, TableRow, Typography } from "@mui/material";
import {
  ChannelData,
  ChannelPriceAndPreorderArgs,
  ChannelPriceArgs
} from "@saleor/channels/utils";
import CardTitle from "@saleor/components/CardTitle";
import PriceField from "@saleor/components/PriceField";
import ResponsiveTable from "@saleor/components/ResponsiveTable";
import Skeleton from "@saleor/components/Skeleton";
import { ProductChannelListingErrorFragment } from "@saleor/fragments/types/ProductChannelListingErrorFragment";
import { makeStyles } from "@saleor/macaw-ui";
import { renderCollection } from "@saleor/misc";
import {
  getFormChannelError,
  getFormChannelErrors
} from "@saleor/utils/errors";
import getProductErrorMessage from "@saleor/utils/errors/product";
import React from "react";
import { FormattedMessage, MessageDescriptor, useIntl } from "react-intl";
import { IonCard } from "@ionic/react";
const useStyles = makeStyles(
  theme => ({
    caption: {
      fontSize: 14,
      padding: theme.spacing(0, 3, 2, 3)
    },
    colName: {
      fontSize: 14,
      paddingLeft: 0,
      width: "auto"
    },
    colPrice: {
      textAlign: "right",
      verticalAlign: "top",
      width: 200
    },
    colType: {
      fontSize: 14,
      textAlign: "right",
      width: 200
    },
    input: {
      textAlign: "left"
    },
    pricingContent: {
      "&:last-child": {
        paddingBottom: 0
      },
      paddingLeft: 0,
      paddingRight: 0
    },
    table: {
      tableLayout: "fixed"
    }
  }),
  { name: "ProductVariantPrice" }
);

interface ProductVariantPriceProps {
  ProductVariantChannelListings?: ChannelData[];
  errors?: ProductChannelListingErrorFragment[];
  loading?: boolean;
  disabled?: boolean;
  onChange?: (
    id: string,
    data: ChannelPriceArgs | ChannelPriceAndPreorderArgs
  ) => void;
  disabledMessage?: MessageDescriptor;
}

const numberOfColumns = 2;

const ProductVariantPrice: React.FC<ProductVariantPriceProps> = props => {
  const {
    disabled = false,
    errors = [],
    ProductVariantChannelListings = [],
    loading,
    onChange,
    disabledMessage
  } = props;
  const classes = useStyles(props);
  const intl = useIntl();
  const formErrors = getFormChannelErrors(["price", "costPrice"], errors);

  if (disabled || !ProductVariantChannelListings.length) {
    return (
      <Card>
        <CardTitle
          title={intl.formatMessage({
            defaultMessage: "Pricing",
            description: "product pricing, section header"
          })}
        />
        <CardContent>
          <Typography variant="caption">
            {intl.formatMessage(
              disabledMessage || {
                defaultMessage: "There is no channel to define prices for",
                description: "variant pricing section subtitle",
                id: "product variant pricing card disabled subtitle"
              }
            )}
          </Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <IonCard>
      <CardTitle
        title={intl.formatMessage({
          defaultMessage: "Pricing",
          description: "product pricing, section header"
        })}
      />
     
        <ResponsiveTable className={classes.table}>
        
          <TableBody>
            {renderCollection(
              ProductVariantChannelListings,
              (listing, index) => {
                const priceError = getFormChannelError(
                  formErrors.price,
                  listing.id
                );
                
                return (
                  <TableRow key={listing?.id || `skeleton-${index}`}>
                    <TableCell className={classes.colPrice}>
                      {listing ? (
                        <PriceField
                          className={classes.input}
                          error={!!priceError}
                          label={intl.formatMessage({
                            defaultMessage: "Price"
                          })}
                          name={`${listing.id}-channel-price`}
                          value={listing.price || ""}
                          currencySymbol={listing.currency}
                          onChange={e =>
                            onChange(listing.id, {
                              costPrice: listing.costPrice,
                              price: e.target.value,
                              preorderThreshold: listing.preorderThreshold
                            })
                          }
                          disabled={loading}
                          required
                          hint={
                            priceError &&
                            getProductErrorMessage(priceError, intl)
                          }
                        />
                      ) : (
                        <Skeleton />
                      )}
                    </TableCell>
                    
                  </TableRow>
                );
              },
              () => (
                <TableRow>
                  <TableCell colSpan={numberOfColumns}>
                    <FormattedMessage defaultMessage="No channels found" />
                  </TableCell>
                </TableRow>
              )
            )}
          </TableBody>
        </ResponsiveTable>
    </IonCard>
  );
};
ProductVariantPrice.displayName = "ProductVariantPrice";
export default ProductVariantPrice;
