import { Typography } from "@mui/material";
import VerticalSpacer from "@saleor/apps/components/VerticalSpacer";
import ControlledCheckbox from "@saleor/components/ControlledCheckbox";
import { GiftCardSettingsErrorFragment } from "@saleor/fragments/types/GiftCardSettingsErrorFragment";
import { getGiftCardSettingsErrorMessage } from "@saleor/giftCards/GiftCardSettings/messages";
import { FormChange } from "@saleor/hooks/useForm";
import { TimePeriodTypeEnum } from "@saleor/types/globalTypes";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import TimePeriodField from "../TimePeriodField/TimePeriodField";
import { giftCardSettingsExpirySelectMessages as messages } from "./messages";

export interface GiftCardSettingsExpirySelectProps {
  change: FormChange;
  disabled: boolean;
  expiryPeriodActive: boolean;
  expiryPeriodType: TimePeriodTypeEnum;
  expiryPeriodAmount: number;
  errors?: Record<"expiryPeriod", GiftCardSettingsErrorFragment>;
}

const GiftCardSettingsExpirySelect: React.FC<GiftCardSettingsExpirySelectProps> = ({
  errors,
  change,
  disabled,
  expiryPeriodActive,
  expiryPeriodType,
  expiryPeriodAmount
}) => {
  const intl = useIntl();

  return (
    <>
      <ControlledCheckbox
        name={"expiryPeriodActive"}
        label={
          <>
            <FormattedMessage {...messages.setExpirationPeriodTitle} />
            <br/>
            <Typography variant="caption">
              <FormattedMessage {...messages.setExpirationPeriodDescription} />
            </Typography>
          </>
        }
        checked={expiryPeriodActive}
        onChange={change}
        disabled={disabled}
        data-test="expiryPeriodActive"
      />

      {expiryPeriodActive && (
        <>
          <VerticalSpacer spacing={2} />
          <TimePeriodField
            isError={!!errors?.expiryPeriod}
            helperText={getGiftCardSettingsErrorMessage(
              errors?.expiryPeriod,
              intl
            )}
            change={change}
            periodType={expiryPeriodType}
            periodAmount={expiryPeriodAmount}
            amountFieldName={"expiryPeriodAmount"}
            typeFieldName={"expiryPeriodType"}
          />
        </>
      )}
    </>
  );
};

export default GiftCardSettingsExpirySelect;
