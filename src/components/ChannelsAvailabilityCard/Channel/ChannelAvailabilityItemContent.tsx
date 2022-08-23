import { TextField, Typography } from "@mui/material";
import { ChannelData } from "@saleor/channels/utils";
import Hr from "@saleor/components/Hr";
import RadioSwitchField from "@saleor/components/RadioSwitchField";
import useCurrentDate from "@saleor/hooks/useCurrentDate";
import useDateLocalize from "@saleor/hooks/useDateLocalize";
import { getFormErrors, getProductErrorMessage } from "@saleor/utils/errors";
import React, { useState } from "react";
import { useIntl } from "react-intl";

import { useStyles } from "../styles";
import { ChannelOpts, ChannelsAvailabilityError, Messages } from "../types";
export interface ChannelContentProps {
  disabled?: boolean;
  data: ChannelData;
  errors: ChannelsAvailabilityError[];
  messages: Messages;
  onChange: (id: string, data: ChannelOpts) => void;
}
const ChannelContent: React.FC<ChannelContentProps> = ({
  data,
  disabled,
  errors,
  messages,
  onChange
}) => {
  const {
    availableForPurchase,
    isAvailableForPurchase: isAvailable,
    isPublished,
    publicationDate,
    visibleInListings,
    id
  } = data;
  const formData = {
    ...(availableForPurchase !== undefined ? { availableForPurchase } : {}),
    ...(isAvailable !== undefined
      ? { isAvailableForPurchase: isAvailable }
      : {}),
    isPublished,
    publicationDate,
    ...(visibleInListings !== undefined ? { visibleInListings } : {})
  };
  const dateNow = useCurrentDate();
  const localizeDate = useDateLocalize();
  const hasAvailableProps =
    isAvailable !== undefined && availableForPurchase !== undefined;
  const [isPublicationDate, setPublicationDate] = useState(
    publicationDate === null
  );
  const [isAvailableDate, setAvailableDate] = useState(false);
  const intl = useIntl();
  const classes = useStyles({});

  const todayDate = localizeDate(new Date(dateNow).toISOString(), "YYYY-MM-DD");

  const visibleMessage = (date: string) =>
    intl.formatMessage(
      {
        defaultMessage: "since {date}",
        description: "date"
      },
      {
        date: localizeDate(date, "L")
      }
    );
  const formErrors = getFormErrors(
    ["availableForPurchaseDate", "publicationDate"],
    errors
  );
  return (
    <div className={classes.container}>
      {hasAvailableProps && (
        <>
          <RadioSwitchField
            className={classes.radioField}
            disabled={disabled}
            firstOptionLabel={
              <>
                <p className={classes.label}>{messages.availableLabel}</p>
              </>
            }
            name={`channel:isAvailableForPurchase:${id}`}
            secondOptionLabel={
              <>
                <p className={classes.label}>{messages.unavailableLabel}</p>
              </>
            }
            value={isAvailable}
            onChange={e => {
              const { value } = e.target;
              return onChange(id, {
                ...formData,
                availableForPurchase: !value ? null : availableForPurchase,
                isAvailableForPurchase: value
              });
            }}
          />
          {!isAvailable && (
            <>
              <Typography
                className={classes.setPublicationDate}
                onClick={() => setAvailableDate(!isAvailableDate)}
              >
                {messages.setAvailabilityDateLabel}
              </Typography>
              {isAvailableDate && (
                <TextField
                  error={!!formErrors.availableForPurchaseDate}
                  disabled={disabled}
                  label={intl.formatMessage({
                    defaultMessage: "Set available on",
                    description: "available on date"
                  })}
                  name={`channel:availableForPurchase:${id}`}
                  type="date"
                  fullWidth={true}
                  helperText={
                    formErrors.availableForPurchaseDate
                      ? getProductErrorMessage(
                          formErrors.availableForPurchaseDate,
                          intl
                        )
                      : ""
                  }
                  value={availableForPurchase ? availableForPurchase : ""}
                  onChange={e =>
                    onChange(id, {
                      ...formData,
                      availableForPurchase: e.target.value
                    })
                  }
                  className={classes.date}
                  InputLabelProps={{
                    shrink: true
                  }}
                />
              )}
            </>
          )}
        </>
      )}
    </div>
  );
};
export default ChannelContent;
