import { Card, CardContent, Typography } from "@mui/material";
import CardTitle from "@saleor/components/CardTitle";
import Skeleton from "@saleor/components/Skeleton";
import React from "react";
import { useIntl } from "react-intl";

export interface DraftOrderChannelSectionCardProps {
  channelName: string;
}

export const DraftOrderChannelSectionCard: React.FC<DraftOrderChannelSectionCardProps> = ({
  channelName
}) => {
  const intl = useIntl();

  return (
    <Card>
      <CardTitle
        title={intl.formatMessage({
          defaultMessage: "Via Munch Link",
          description: "section header"
        })}
      />
      <CardContent data-test-id="sales-channel">
        {!channelName ? <Skeleton /> : <Typography>{channelName}</Typography>}
      </CardContent>
    </Card>
  );
};
DraftOrderChannelSectionCard.displayName = "DraftOrderChannelSectionCard";
export default DraftOrderChannelSectionCard;
