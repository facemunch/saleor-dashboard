import { IonButton } from "@ionic/react";
import { Button, CardActions, Typography } from "@mui/material";
import { buttonMessages, commonMessages } from "@saleor/intl";
import { FulfillmentStatus } from "@saleor/types/globalTypes";
import React from "react";
import { FormattedMessage } from "react-intl";

import { actionButtonsMessages } from "./messages";

interface AcionIonButtonsProps {
  status: FulfillmentStatus;
  trackingNumber?: string;
  orderIsPaid?: boolean;
  fulfillmentAllowUnpaid: boolean;
  onTrackingCodeAdd();
  onRefund();
  onApprove();
}

const statusesToShow = [
  FulfillmentStatus.FULFILLED,
  FulfillmentStatus.RETURNED,
  FulfillmentStatus.WAITING_FOR_APPROVAL
];

const ActionIonButtons: React.FC<AcionIonButtonsProps> = ({
  status,
  trackingNumber,
  orderIsPaid,
  fulfillmentAllowUnpaid,
  onTrackingCodeAdd,
  onRefund,
  onApprove
}) => {
  const hasTrackingNumber = !!trackingNumber;

  if (!statusesToShow.includes(status)) {
    return null;
  }

  if (status === FulfillmentStatus.WAITING_FOR_APPROVAL) {
    const cannotFulfill = !orderIsPaid && !fulfillmentAllowUnpaid;

    return (
      <CardActions>
        <IonButton
          size="small"
          color="primary"
          onClick={onApprove}
          disabled={cannotFulfill}
        >
          <FormattedMessage {...buttonMessages.approve} />
        </IonButton>
        {cannotFulfill && (
          <Typography color="error" variant="caption">
            <FormattedMessage {...commonMessages.cannotFullfillUnpaidOrder} />
          </Typography>
        )}
      </CardActions>
    );
  }

  if (status === FulfillmentStatus.RETURNED) {
    return (
      <CardActions>
        <IonButton size="small" color="primary" onClick={onRefund}>
          <FormattedMessage {...actionButtonsMessages.refund} />
        </IonButton>
      </CardActions>
    );
  }

  return hasTrackingNumber ? (
    <CardActions>
      <IonButton size="small" color="primary" onClick={onTrackingCodeAdd}>
        <FormattedMessage {...actionButtonsMessages.editTracking} />
      </IonButton>
    </CardActions>
  ) : (
    <CardActions>
      <IonButton size="small" color="primary" onClick={onTrackingCodeAdd}>
        <FormattedMessage {...actionButtonsMessages.addTracking} />
      </IonButton>
    </CardActions>
  );
};

export default ActionIonButtons;
