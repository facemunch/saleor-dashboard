import { Card, CardContent, Typography } from "@mui/material";
import CardTitle from "@saleor/components/CardTitle";
import Skeleton from "@saleor/components/Skeleton";
import React from "react";
import { useIntl } from "react-intl";

export interface OrderChannelSectionCardProps {
  selectedChannelName: string;
}

export const OrderChannelSectionCard: React.FC<OrderChannelSectionCardProps> = ({
  selectedChannelName
}) => {
  const intl = useIntl();

  return (
    <Card data-test-id="order-sales-channel">
      <CardTitle
        title={intl.formatMessage({
          defaultMessage: "Via Munch Link",
          description: "section header"
        })}
      />
      <CardContent>
        {selectedChannelName === undefined ? (
          <Skeleton />
        ) : (
          <Typography>{selectedChannelName}</Typography>
        )}
      </CardContent>
    </Card>
  );
};
OrderChannelSectionCard.displayName = "OrderChannelSectionCard";
export default OrderChannelSectionCard;
