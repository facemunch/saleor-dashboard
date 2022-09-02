import { IconButton } from "@mui/material";
import { OrderDetailsFragment } from "@saleor/fragments/types/OrderDetailsFragment";
import TrashIcon from "@saleor/icons/Trash";
import { makeStyles } from "@saleor/macaw-ui";
import { mergeRepeatedOrderLines } from "@saleor/orders/utils/data";
import React, { memo } from "react";

import { renderCollection } from "../../../misc";
import { FulfillmentStatus } from "../../../types/globalTypes";
import { OrderDetails_order_fulfillments } from "../../types/OrderDetails";
import TableHeader from "../OrderProductsCardElements/OrderProductsCardHeader";
import TableLine from "../OrderProductsCardElements/OrderProductsTableRow";
import CardTitle from "../OrderReturnPage/OrderReturnRefundItemsCard/CardTitle";
import ActionButtons from "./ActionButtons";
import ExtraInfoLines from "./ExtraInfoLines";

import { IonCard, IonCardContent } from "@ionic/react";

const useStyles = makeStyles(
  theme => ({
    table: {
      tableLayout: "fixed"
    },
    deleteIcon: {
      height: 40,
      paddingRight: 0,
      paddingLeft: theme.spacing(1),
      width: 40
    }
  }),
  { name: "OrderFulfillment" }
);

interface OrderFulfilledProductsCardProps {
  fulfillment: OrderDetails_order_fulfillments;
  fulfillmentAllowUnpaid: boolean;
  order?: OrderDetailsFragment;
  onOrderFulfillmentApprove: () => void;
  onOrderFulfillmentCancel: () => void;
  onTrackingCodeAdd: () => void;
  onRefund: () => void;
}

const statusesToMergeLines = [
  FulfillmentStatus.REFUNDED,
  FulfillmentStatus.REFUNDED_AND_RETURNED,
  FulfillmentStatus.RETURNED,
  FulfillmentStatus.REPLACED
];
const cancelableStatuses = [
  FulfillmentStatus.FULFILLED,
  FulfillmentStatus.WAITING_FOR_APPROVAL
];

const OrderFulfilledProductsCard: React.FC<OrderFulfilledProductsCardProps> = props => {
  const {
    fulfillment,
    fulfillmentAllowUnpaid,
    order,
    onOrderFulfillmentApprove,
    onOrderFulfillmentCancel,
    onTrackingCodeAdd,
    onRefund
  } = props;
  const classes = useStyles(props);

  if (!fulfillment) {
    return null;
  }

  const getLines = () => {
    if (statusesToMergeLines.includes(fulfillment?.status)) {
      return mergeRepeatedOrderLines(fulfillment.lines);
    }

    return fulfillment?.lines || [];
  };
  return (
    <IonCard>
      <CardTitle
        withStatus
        lines={fulfillment?.lines}
        fulfillmentOrder={fulfillment?.fulfillmentOrder}
        status={fulfillment?.status}
        warehouseName={fulfillment?.warehouse?.name}
        orderNumber={order?.number}
        toolbar={
          cancelableStatuses.includes(fulfillment?.status) && (
            <IconButton
              className={classes.deleteIcon}
              onClick={onOrderFulfillmentCancel}
              data-test-id="cancelFulfillmentButton"
            >
              <TrashIcon />
            </IconButton>
          )
        }
      />
      <IonCardContent
        style={{
          overflow: "scroll",
          width: "92vw"
        }}
      >
        <TableHeader />
        {renderCollection(getLines(), line => (
          <div key={fulfillment?.status + line.id}>
            <TableLine status={fulfillment?.status} line={line} />
          </div>
        ))}

        <ExtraInfoLines fulfillment={fulfillment} />
      </IonCardContent>
      <ActionButtons
        status={fulfillment?.status}
        trackingNumber={fulfillment?.trackingNumber}
        orderIsPaid={order?.isPaid}
        isDigitalProduct={getLines().every(line => !!line.orderLine.variant.digitalContent)}
        fulfillmentAllowUnpaid={fulfillmentAllowUnpaid}
        onTrackingCodeAdd={onTrackingCodeAdd}
        onRefund={onRefund}
        onApprove={onOrderFulfillmentApprove}
      />
    </IonCard>
  );
};

export default memo(OrderFulfilledProductsCard);
