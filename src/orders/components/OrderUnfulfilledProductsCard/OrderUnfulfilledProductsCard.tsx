import { CardActions, TableBody, Typography } from "@mui/material";
import CardSpacer from "@saleor/components/CardSpacer";
import { commonMessages } from "@saleor/intl";
import { renderCollection } from "@saleor/misc";
import React from "react";
import { FormattedMessage } from "react-intl";

import { OrderDetails_order_lines } from "../../types/OrderDetails";
import TableHeader from "../OrderProductsCardElements/OrderProductsCardHeader";
import TableLine from "../OrderProductsCardElements/OrderProductsTableRow";
import CardTitle from "../OrderReturnPage/OrderReturnRefundItemsCard/CardTitle";

import { IonCard, IonButton, IonCardContent } from "@ionic/react";


interface OrderUnfulfilledProductsCardProps {
  showFulfillmentAction: boolean;
  notAllowedToFulfillUnpaid: boolean;
  lines: OrderDetails_order_lines[];
  onFulfill: () => void;
}

const OrderUnfulfilledProductsCard: React.FC<OrderUnfulfilledProductsCardProps> = props => {
  const {
    showFulfillmentAction,
    notAllowedToFulfillUnpaid,
    lines,
    onFulfill
  } = props;

  if (!lines.length) {
    return null;
  }

  return (
    <>
      <IonCard>
        <CardTitle withStatus status="unfulfilled" />
        <IonCardContent>
          {/* <div style={{ width: "92vw", overflow: "scroll" }}> */}
          <TableHeader />
          <TableBody>
            {renderCollection(lines, line => (
              <div key={line.id}>
                <TableLine isOrderLine line={line} />
              </div>
            ))}
          </TableBody>
          {/* </div> */}
        </IonCardContent>
        {showFulfillmentAction && (
          <CardActions>
            <IonButton
              size="small"
              color="primary"
              onClick={onFulfill}
              disabled={notAllowedToFulfillUnpaid}
            >
              <FormattedMessage defaultMessage="Fulfill" description="button" />
            </IonButton>
            {notAllowedToFulfillUnpaid && (
              <Typography color="error" variant="caption">
                <FormattedMessage
                  {...commonMessages.cannotFullfillUnpaidOrder}
                />
              </Typography>
            )}
          </CardActions>
        )}
      </IonCard>
      <CardSpacer />
    </>
  );
};

export default OrderUnfulfilledProductsCard;
