import { Card, CardContent } from "@mui/material";
import CardTitle from "@saleor/components/CardTitle";
import Skeleton from "@saleor/components/Skeleton";
import React from "react";
import { useIntl } from "react-intl";

import useGiftCardDetails from "../providers/GiftCardDetailsProvider/hooks/useGiftCardDetails";
import GiftCardUpdateInfoCardContent from "./GiftCardUpdateInfoCardContent";
import { giftCardUpdateInfoCardMessages as messages } from "./messages";

const GiftCardUpdateInfoCard: React.FC = () => {
  const intl = useIntl();

  const { loading } = useGiftCardDetails();

  return (
    <Card>
      <CardTitle title={intl.formatMessage(messages.title)} />
      <CardContent>
        <Skeleton>{!loading && <GiftCardUpdateInfoCardContent />}</Skeleton>
      </CardContent>
    </Card>
  );
};

export default GiftCardUpdateInfoCard;
