import {
  Button,
  Card,
  CardContent,
  TableBody,
  TableCell,
  TableRow,
  Typography
} from "@mui/material";
import CardTitle from "@saleor/components/CardTitle";
import Date from "@saleor/components/Date";
import ResponsiveTable from "@saleor/components/ResponsiveTable";
import Skeleton from "@saleor/components/Skeleton";
import { InvoiceFragment } from "@saleor/fragments/types/InvoiceFragment";
import { buttonMessages } from "@saleor/intl";
import { makeStyles } from "@saleor/macaw-ui";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { IonCard } from "@ionic/react";

const useStyles = makeStyles(
  () => ({
    card: {
      overflow: "hidden"
    },
    cardContentTable: {
      "&:last-child": {
        padding: 0
      },
      padding: 0
    },
    colAction: {
      button: {
        padding: "0"
      },
      padding: "0 0.5rem",
      width: "auto"
    },
    colNumber: { width: "100%" },
    colNumberClickable: {
      cursor: "pointer",
      width: "100%"
    },
    invoicesTable: {
      display: "flex"
    },
    invoicesTableBody: {
      width: "100%"
    }
  }),
  { name: "OrderInvoiceList" }
);

export interface OrderInvoiceListProps {
  invoices: InvoiceFragment[];
  onInvoiceGenerate: () => void;
  onInvoiceClick: (invoiceId: string) => void;
  onInvoiceSend: (invoiceId: string) => void;
}

const OrderInvoiceList: React.FC<OrderInvoiceListProps> = props => {
  const { invoices, onInvoiceGenerate, onInvoiceClick, onInvoiceSend } = props;

  const classes = useStyles(props);

  const intl = useIntl();

  const generatedInvoices = invoices?.filter(
    invoice => invoice.status === "SUCCESS"
  );

  return (
    <IonCard className={classes.card}>
      <CardTitle
        title={intl.formatMessage({
          defaultMessage: "Invoices",
          description: "section header"
        })}
        toolbar={
          onInvoiceGenerate && (
            <Button color="primary" onClick={onInvoiceGenerate}>
              <FormattedMessage
                defaultMessage="Generate"
                description="generate invoice button"
              />
            </Button>
          )
        }
      />
      <CardContent
      // className={!!generatedInvoices?.length && classes.cardContentTable}
      >
        {!generatedInvoices ? (
          <Skeleton />
        ) : !generatedInvoices?.length ? (
          <Typography color="textSecondary">
            <FormattedMessage defaultMessage="No invoices to be shown" />
          </Typography>
        ) : (
          <ResponsiveTable className={classes.invoicesTable}>
            <TableBody className={classes.invoicesTableBody}>
              {generatedInvoices.map(invoice => (
                <TableRow key={invoice.id} hover={!!invoice}>
                  <TableCell
                    className={
                      onInvoiceClick
                        ? classes.colNumberClickable
                        : classes.colNumber
                    }
                    onClick={() => onInvoiceClick(invoice.id)}
                  >
                    <FormattedMessage
                      defaultMessage="Invoice"
                      description="invoice number prefix"
                    />{" "}
                    {invoice.number}
                    <Typography variant="caption">
                      <FormattedMessage
                        defaultMessage="created"
                        description="invoice create date prefix"
                      />{" "}
                      <Date date={invoice.createdAt} plain />
                    </Typography>
                  </TableCell>
                  {onInvoiceSend && (
                    <TableCell
                      className={classes.colAction}
                      onClick={() => onInvoiceSend(invoice.id)}
                    >
                      <Button color="primary">
                        <FormattedMessage {...buttonMessages.send} />
                      </Button>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </ResponsiveTable>
        )}
      </CardContent>
    </IonCard>
  );
};

OrderInvoiceList.displayName = "OrderInvoiceList";
export default OrderInvoiceList;
