import { Card, CardContent, TextField, Typography } from "@mui/material";
import CardTitle from "@saleor/components/CardTitle";
import { ControlledCheckbox } from "@saleor/components/ControlledCheckbox";
import Skeleton from "@saleor/components/Skeleton";
import { AccountErrorFragment } from "@saleor/fragments/types/AccountErrorFragment";
import { makeStyles } from "@saleor/macaw-ui";
import { maybe } from "@saleor/misc";
import { getFormErrors } from "@saleor/utils/errors";
import getAccountErrorMessage from "@saleor/utils/errors/account";
import moment from "moment-timezone";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { IonCard } from "@ionic/react";

import { CustomerDetails_user } from "../../types/CustomerDetails";

const useStyles = makeStyles(
  theme => ({
    cardTitle: {
      height: 72
    },
    checkbox: {
      marginBottom: theme.spacing()
    },
    content: {
      paddingTop: theme.spacing()
    },
    subtitle: {
      marginTop: theme.spacing()
    }
  }),
  { name: "CustomerDetails" }
);

export interface CustomerDetailsProps {
  customer: CustomerDetails_user;
  data: {
    isActive: boolean;
    note: string;
  };
  disabled: boolean;
  errors: AccountErrorFragment[];
  onChange: (event: React.ChangeEvent<any>) => void;
}

const CustomerDetails: React.FC<CustomerDetailsProps> = props => {
  const { customer, data, disabled, errors, onChange } = props;

  const classes = useStyles(props);
  const intl = useIntl();

  const formErrors = getFormErrors(["note"], errors);

  return (
    <IonCard>
      <CardTitle
        className={classes.cardTitle}
        title={
          <>
            {maybe<React.ReactNode>(() => customer.email, <Skeleton />)}
            {customer && customer.dateJoined ? (
              <Typography
                className={classes.subtitle}
                variant="caption"
                component="div"
              >
                <FormattedMessage
                  defaultMessage="Active member since {date}"
                  description="section subheader"
                  values={{
                    date: moment(customer.dateJoined).format("MMM YYYY")
                  }}
                />
              </Typography>
            ) : (
              <Skeleton style={{ width: "10rem" }} />
            )}
          </>
        }
      />
      <CardContent className={classes.content}>
        <ControlledCheckbox
          checked={data.isActive}
          className={classes.checkbox}
          disabled={disabled}
          label={intl.formatMessage({
            defaultMessage: "User account active",
            description: "check to mark this account as active"
          })}
          name="isActive"
          onChange={onChange}
        />
        <TextField
          disabled={disabled}
          error={!!formErrors.note}
          fullWidth
          multiline
          helperText={getAccountErrorMessage(formErrors.note, intl)}
          name="note"
          label={intl.formatMessage({
            defaultMessage: "Note",
            description: "note about customer"
          })}
          value={data.note}
          onChange={onChange}
        />
      </CardContent>
    </IonCard>
  );
};
CustomerDetails.displayName = "CustomerDetails";
export default CustomerDetails;
