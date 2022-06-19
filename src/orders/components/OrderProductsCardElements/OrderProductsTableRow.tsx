import { IonCol, IonImg, IonItem, IonRow, IonThumbnail } from "@ionic/react";
import Money from "@saleor/components/Money";
import Skeleton from "@saleor/components/Skeleton";
import { AVATAR_MARGIN } from "@saleor/components/TableCellAvatar/Avatar";
import { makeStyles } from "@saleor/macaw-ui";
import { maybe } from "@saleor/misc";
import {
  OrderDetails_order_fulfillments_lines,
  OrderDetails_order_lines
} from "@saleor/orders/types/OrderDetails";
import React from "react";

const useStyles = makeStyles(
  theme => ({
    clickableRow: {
      cursor: "pointer"
    },
    colName: {
      width: "auto",
      padding: "8px !important"
    },
    colNameLabel: {
      marginLeft: AVATAR_MARGIN
    },
    colPrice: {
      textAlign: "right",
      width: 120
    },
    colQuantity: {
      textAlign: "center",
      width: 120
    },
    colSku: {
      textAlign: "right",
      textOverflow: "ellipsis",
      width: 120
    },
    colTotal: {
      textAlign: "right",
      width: 120
    },
    infoLabel: {
      display: "inline-block"
    },
    infoLabelWithMargin: {
      marginBottom: theme.spacing()
    },
    infoRow: {
      padding: theme.spacing(2, 3)
    },
    orderNumber: {
      display: "inline",
      marginLeft: theme.spacing(1)
    },
    statusBar: {
      paddingTop: 0
    },
    table: {
      tableLayout: "fixed"
    }
  }),
  { name: "TableLine" }
);

interface TableLineProps {
  line: OrderDetails_order_fulfillments_lines | OrderDetails_order_lines;
  isOrderLine?: boolean;
  status?: string;
}

const TableLine: React.FC<TableLineProps> = ({
  line: lineData,
  isOrderLine = false,
  status
}) => {
  const classes = useStyles({});
  const { quantity, quantityToFulfill } = lineData as OrderDetails_order_lines;

  if (!lineData) {
    return <Skeleton />;
  }

  const line = isOrderLine
    ? ({
        ...lineData,
        orderLine: lineData
      } as OrderDetails_order_fulfillments_lines)
    : (lineData as OrderDetails_order_fulfillments_lines);

  const quantityToDisplay = isOrderLine ? quantityToFulfill : quantity;
  const key = line.id + status;
  return (
    <IonRow
      style={{ "--background": "#313131", height: 50, color: "white" }}
      key={key}
    >
      <IonCol>
        <IonThumbnail>
          <IonImg src={maybe(() => line.orderLine.thumbnail.url)} />
        </IonThumbnail>
      </IonCol>
      <IonCol>{maybe(() => line.orderLine.productName) || <Skeleton />}</IonCol>
      <IonCol className={classes.colQuantity}>
        {quantityToDisplay || <Skeleton />}
      </IonCol>
      <IonCol className={classes.colPrice}>
        {maybe(() => line.orderLine.unitPrice.gross) ? (
          <Money money={line.orderLine.unitPrice.gross} />
        ) : (
          <Skeleton />
        )}
      </IonCol>
      <IonCol className={classes.colTotal}>
        <Money
          money={{
            amount: line.quantity * line.orderLine.unitPrice.gross.amount,
            currency: line.orderLine.unitPrice.gross.currency
          }}
        />
      </IonCol>
    </IonRow>
  );
};

export default TableLine;
