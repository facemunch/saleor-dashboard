import { Card } from "@mui/material";
import CardSpacer from "@saleor/components/CardSpacer";
import CardTitle from "@saleor/components/CardTitle";
import React from "react";
import { FormattedMessage } from "react-intl";

import { variantDetailsChannelsAvailabilityCardMessages as messages } from "../messages";

interface VariantDetailsChannelsAvailabilityCardContainerProps {
  children: React.ReactNode;
}

const VariantDetailsChannelsAvailabilityCardContainer: React.FC<VariantDetailsChannelsAvailabilityCardContainerProps> = ({
  children
}) => (
  <>
    <Card>
      <CardTitle title={<FormattedMessage {...messages.title} />} />
      {children}
    </Card>
    <CardSpacer />
  </>
);

export default VariantDetailsChannelsAvailabilityCardContainer;
