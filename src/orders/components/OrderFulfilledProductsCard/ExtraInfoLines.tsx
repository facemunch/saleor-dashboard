import { Typography } from "@mui/material";
import { makeStyles } from "@saleor/macaw-ui";
import React from "react";
import { FormattedMessage } from "react-intl";

import { OrderDetails_order_fulfillments } from "../../types/OrderDetails";
import { extraInfoMessages } from "./messages";

const useStyles = makeStyles(
  theme => ({
    infoLabel: {
      display: "inline-block"
    },
    infoLabelWithMargin: {
      marginBottom: theme.spacing()
    },
    infoRow: {
      padding: "16px 0"
    }
  }),
  { name: "ExtraInfoLines" }
);

interface ExtraInfoLinesProps {
  fulfillment?: OrderDetails_order_fulfillments;
}

const ExtraInfoLines: React.FC<ExtraInfoLinesProps> = ({ fulfillment }) => {
  const classes = useStyles({});

  if (!fulfillment || !fulfillment?.warehouse || !fulfillment?.trackingNumber) {
    return null;
  }

  const { trackingNumber } = fulfillment;

  return (
    <>
      <div className={classes.infoRow}>
        <div>
          {trackingNumber && (
            <FormattedMessage
              {...extraInfoMessages.tracking}
              values={{
                trackingNumber: (
                  <Typography
                    className={classes.infoLabel}
                    color="textPrimary"
                    variant="body2"
                  >
                    {trackingNumber}
                  </Typography>
                )
              }}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default ExtraInfoLines;
