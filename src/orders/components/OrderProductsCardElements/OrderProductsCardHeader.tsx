import { IonRow, IonCol } from "@ionic/react";
import { TableCell, TableHead, TableRow } from "@mui/material";
import { makeStyles } from "@saleor/macaw-ui";
import React from "react";
import { FormattedMessage } from "react-intl";

const useStyles = makeStyles(
  theme => ({
    clickableRow: {
      cursor: "pointer"
    },
    colName: {
      width: "auto"
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
  { name: "TableHeader" }
);

const TableHeader = () => {
  const classes = useStyles({});

  return (
    <>
      <IonRow>
        <IonCol className={classes.colName}>
          <FormattedMessage
            defaultMessage="Product"
            description="product name"
          />
        </IonCol>
        <IonCol className={classes.colName}></IonCol>
        {/* <TableCell className={classes.colSku}>
          <FormattedMessage
            defaultMessage="SKU"
            description="ordered product sku"
          />
        </TableCell> */}
        <IonCol className={classes.colQuantity}>
          <FormattedMessage
            defaultMessage="Quantity"
            description="ordered product quantity"
          />
        </IonCol>
        <IonCol className={classes.colPrice}>
          <FormattedMessage
            defaultMessage="Price"
            description="product price"
          />
        </IonCol>
        <IonCol className={classes.colTotal}>
          <FormattedMessage
            defaultMessage="Total"
            description="order line total price"
          />
        </IonCol>
      </IonRow>
    </>
  );
};

export default TableHeader;
