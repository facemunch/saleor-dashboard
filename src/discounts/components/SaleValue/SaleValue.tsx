import {
  Card,
  CardContent,
  TableBody,
  TableCell,
  TableRow,
  Typography
} from "@mui/material";
import CardTitle from "@saleor/components/CardTitle";
import ResponsiveTable from "@saleor/components/ResponsiveTable";
import Skeleton from "@saleor/components/Skeleton";
import TableHead from "@saleor/components/TableHead";
import { DiscountErrorFragment } from "@saleor/fragments/types/DiscountErrorFragment";
import { renderCollection } from "@saleor/misc";
import { getFormErrors } from "@saleor/utils/errors";
import getDiscountErrorMessage from "@saleor/utils/errors/discounts";
import * as React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { SaleDetailsPageFormData } from "../SaleDetailsPage";
import SaleValueTextField from "./SaleValueTextField";
import { useStyles } from "./styles";
import { SaleValueInputChangeType } from "./types";

export interface SaleValueProps {
  data: SaleDetailsPageFormData;
  disabled: boolean;
  errors: DiscountErrorFragment[];
  onChange: SaleValueInputChangeType;
}

const numberOfColumns = 2;

const SaleValue: React.FC<SaleValueProps> = ({
  data,
  disabled,
  errors,
  onChange
}) => {
  const { type } = data;
  const intl = useIntl();
  const classes = useStyles({});
  const formErrors = getFormErrors(["value"], errors);

  return (
    <Card>
      <CardTitle
        title={intl.formatMessage({
          defaultMessage: "Value",
          description: "sale value, header"
        })}
      />
      <CardContent className={classes.card}>
        <Typography variant="caption" className={classes.info}>
          <FormattedMessage
            defaultMessage="Channels that don’t have assigned discounts will use their parent channel to define the price. Price will be converted to channel’s currency"
            description="channels sale info"
          />
        </Typography>
        <div className={classes.tableContainer}>
          <ResponsiveTable className={classes.table}>
            <TableHead colSpan={numberOfColumns} disabled={disabled} items={[]}>
              <TableCell className={classes.colName}>
                <span>
                  <FormattedMessage
                    defaultMessage="Channel name"
                    description="column title"
                  />
                </span>
              </TableCell>
              <TableCell className={classes.colType}>
                <span>
                  <FormattedMessage
                    defaultMessage="Value"
                    description="sale value, header"
                  />
                </span>
              </TableCell>
            </TableHead>
            <TableBody>
              {renderCollection(
                data.channelListings,
                (listing, index) => {
                  const error = formErrors.value?.channels?.find(
                    id => id === listing.id
                  );
                  return (
                    <TableRow
                      key={listing?.id || `skeleton-${index}`}
                      className={classes.row}
                    >
                      <TableCell>
                        <Typography>{listing?.name || <Skeleton />}</Typography>
                      </TableCell>
                      <TableCell>
                        {listing ? (
                          <SaleValueTextField
                            dataType={type}
                            helperText={
                              error
                                ? getDiscountErrorMessage(
                                    formErrors.value,
                                    intl
                                  )
                                : ""
                            }
                            disabled={disabled}
                            listing={listing}
                            onChange={onChange}
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
        </div>
      </CardContent>
    </Card>
  );
};

SaleValue.displayName = "SaleValue";
export default SaleValue;
