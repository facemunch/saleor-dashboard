import { AccordionSummary, Typography } from "@mui/material";
import HorizontalSpacer from "@saleor/apps/components/HorizontalSpacer";
import { ChannelShippingZones } from "@saleor/channels/pages/ChannelDetailsPage/types";
import IconChevronDown from "@saleor/icons/ChevronDown";
import { makeStyles } from "@saleor/macaw-ui";
import React from "react";
import { defineMessages, useIntl } from "react-intl";

const useStyles = makeStyles(
  theme => ({
    container: {
      width: "100%",
      display: "flex",
      flexDirection: "row",
      alignItems: "center"
    },
    // empty expanded needed for mui to use root styles
    expanded: {},
    root: {
      width: "100%",
      border: "none",
      marginRight: theme.spacing(1),
      paddingBottom: theme.spacing(2),
      minHeight: 0,

      "&$expanded": {
        minHeight: 0
      }
    },
    content: {
      paddingLeft: theme.spacing(1),
      margin: 0,

      "&$expanded": {
        margin: 0
      }
    }
  }),
  { name: "ShippingZonesListHeader" }
);

const messages = defineMessages({
  title: {
    defaultMessage: "{zonesCount} Shipping Zones",
    description: "title"
  }
});

interface ShippingZonesListHeaderProps {
  shippingZones: ChannelShippingZones;
}

const ShippingZonesListHeader: React.FC<ShippingZonesListHeaderProps> = ({
  shippingZones
}) => {
  const classes = useStyles({});
  const intl = useIntl();

  return (
    <div className={classes.container}>
      <AccordionSummary expandIcon={<IconChevronDown />} classes={classes}>
        <Typography variant="subtitle2" color="textSecondary">
          {intl.formatMessage(messages.title, {
            zonesCount: shippingZones.length
          })}
        </Typography>
      </AccordionSummary>
      <HorizontalSpacer spacing={1.5} />
    </div>
  );
};

export default ShippingZonesListHeader;
