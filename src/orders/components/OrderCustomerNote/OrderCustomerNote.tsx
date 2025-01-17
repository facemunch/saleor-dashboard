import { Card, CardContent, Typography } from "@mui/material";
import CardTitle from "@saleor/components/CardTitle";
import Skeleton from "@saleor/components/Skeleton";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { IonCard } from "@ionic/react";

interface OrderCustomerNoteProps {
  note: string;
}

export const OrderCustomerNote: React.FC<OrderCustomerNoteProps> = ({
  note
}) => {
  const intl = useIntl();

  return (
    <IonCard>
      <CardTitle
        title={intl.formatMessage({
          defaultMessage: "Notes",
          description: "notes about customer, header"
        })}
      />
      <CardContent>
        {note === undefined ? (
          <Skeleton />
        ) : note === "" ? (
          <Typography color="textSecondary">
            <FormattedMessage defaultMessage="No notes from customer" />
          </Typography>
        ) : (
          <Typography>{note}</Typography>
        )}
      </CardContent>
    </IonCard>
  );
};
export default OrderCustomerNote;
