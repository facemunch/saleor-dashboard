import DefaultCardTitle from "@saleor/components/CardTitle";
import { StatusType } from "@saleor/components/StatusChip/types";
import StatusLabel from "@saleor/components/StatusLabel";
import { makeStyles } from "@saleor/macaw-ui";
import { FulfillmentStatus } from "@saleor/types/globalTypes";
import React from "react";

const useStyles = makeStyles(
  theme => ({
    title: {
      width: "100%",
      display: "flex",
      flexWrap: "wrap"
    },
    orderNumber: {
      display: "inline",
      marginLeft: theme.spacing(1)
    },
    warehouseName: {
      float: "right",
      color: theme.palette.text.secondary,
      margin: `auto ${theme.spacing(1)} auto auto`
    }
  }),
  { name: "CardTitle" }
);


type CardTitleStatus = FulfillmentStatus | "unfulfilled";

type CardTitleLines = Array<{
  quantity: number;
}>;

interface CardTitleProps {
  lines?: CardTitleLines;
  fulfillmentOrder?: number;
  status: CardTitleStatus;
  toolbar?: React.ReactNode;
  orderNumber?: string;
  warehouseName?: string;
  withStatus?: boolean;
}

const selectStatus = (status: CardTitleStatus) => {
  switch (status) {
    case FulfillmentStatus.FULFILLED:
      return StatusType.SUCCESS;
    case FulfillmentStatus.REFUNDED:
      return StatusType.NEUTRAL;
    case FulfillmentStatus.RETURNED:
      return StatusType.NEUTRAL;
    case FulfillmentStatus.REPLACED:
      return StatusType.NEUTRAL;
    case FulfillmentStatus.REFUNDED_AND_RETURNED:
      return StatusType.NEUTRAL;
    case FulfillmentStatus.WAITING_FOR_APPROVAL:
      return StatusType.ALERT;
    case FulfillmentStatus.CANCELED:
      return StatusType.ERROR;
    default:
      return StatusType.ALERT;
  }
};

const CardTitle: React.FC<CardTitleProps> = ({
  status,
  withStatus = false,
  toolbar
}) => {
  const classes = useStyles({});

  
  const title = (
    <div className={classes.title}>
      {status}
   
    </div>
  );

  return (
    <DefaultCardTitle
      toolbar={toolbar}
      title={
        withStatus ? (
          <StatusLabel label={title} status={selectStatus(status)} />
        ) : (
          title
        )
      }
    />
  );
};

export default CardTitle;
