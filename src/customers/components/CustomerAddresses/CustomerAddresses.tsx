import { Button, Card, CardContent, Typography } from "@mui/material";
import AddressFormatter from "@saleor/components/AddressFormatter";
import CardTitle from "@saleor/components/CardTitle";
import { Hr } from "@saleor/components/Hr";
import { buttonMessages } from "@saleor/intl";
import { makeStyles } from "@saleor/macaw-ui";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { IonCard } from "@ionic/react";

import { maybe } from "../../../misc";
import { CustomerDetails_user } from "../../types/CustomerDetails";

const useStyles = makeStyles(
  theme => ({
    label: {
      fontWeight: 600,
      marginBottom: theme.spacing(1)
    }
  }),
  { name: "CustomerAddresses" }
);

export interface CustomerAddressesProps {
  customer: CustomerDetails_user;
  disabled: boolean;
  onAddressManageClick: () => void;
}

const CustomerAddresses: React.FC<CustomerAddressesProps> = props => {
  const { customer, disabled, onAddressManageClick } = props;
  const classes = useStyles(props);

  const intl = useIntl();

  return (
    <IonCard>
      <CardTitle
        title={intl.formatMessage({
          defaultMessage: "Address Information",
          description: "header"
        })}
        toolbar={
          <Button
            color="primary"
            disabled={disabled}
            variant="text"
            onClick={onAddressManageClick}
          >
            <FormattedMessage {...buttonMessages.manage} />
          </Button>
        }
      />
      {maybe(() => customer.defaultBillingAddress.id) !==
      maybe(() => customer.defaultShippingAddress.id) ? (
        <>
          {maybe(() => customer.defaultBillingAddress) !== null && (
            <CardContent>
              <Typography className={classes.label}>
                <FormattedMessage
                  defaultMessage="Billing Address"
                  description="subsection header"
                />
              </Typography>
              <AddressFormatter
                address={maybe(() => customer.defaultBillingAddress)}
              />
            </CardContent>
          )}
          {maybe(
            () =>
              customer.defaultBillingAddress && customer.defaultShippingAddress
          ) && <Hr />}
          {maybe(() => customer.defaultShippingAddress) && (
            <CardContent>
              <Typography className={classes.label}>
                <FormattedMessage
                  defaultMessage="Shipping Address"
                  description="subsection header"
                />
              </Typography>
              <AddressFormatter
                address={maybe(() => customer.defaultShippingAddress)}
              />
            </CardContent>
          )}
        </>
      ) : maybe(() => customer.defaultBillingAddress) === null &&
        maybe(() => customer.defaultShippingAddress) === null ? (
        <CardContent>
          <Typography>
            <FormattedMessage defaultMessage="This customer has no addresses yet" />
          </Typography>
        </CardContent>
      ) : (
        <CardContent>
          <Typography className={classes.label}>
            <FormattedMessage
              defaultMessage="Address"
              description="subsection header"
            />
          </Typography>
          <AddressFormatter
            address={maybe(() => customer.defaultBillingAddress)}
          />
        </CardContent>
      )}
    </IonCard>
  );
};
CustomerAddresses.displayName = "CustomerAddresses";
export default CustomerAddresses;
