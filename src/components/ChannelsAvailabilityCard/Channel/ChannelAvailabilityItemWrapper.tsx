import {
  Accordion,
  AccordionSummary,
  Typography
} from "@mui/material";
import { ChannelData } from "@saleor/channels/utils";
import IconChevronDown from "@saleor/icons/ChevronDown";
import { makeStyles } from "@saleor/macaw-ui";
import React from "react";

import { Messages } from "../types";

const useExpanderStyles = makeStyles(
  theme => ({
    expanded: {},
    root: {
      boxShadow: "none !important",
      margin: 0,
      padding: 0,
      paddingBottom: theme.spacing(2),

      "&:before": {
        content: "none"
      },

      "&$expanded": {
        margin: 0,
        border: "none"
      }
    }
  }),
  { name: "ChannelContentWrapperExpander" }
);

const useSummaryStyles = makeStyles(
  theme => ({
    expanded: {},
    root: {
      width: "100%",
      border: "none",
      margin: 0,
      padding: 0,
      minHeight: 0,
      paddingTop: theme.spacing(2),

      "&$expanded": {
        minHeight: 0,
        padding: theme.spacing(2, 0)
      }
    },
    content: {
      margin: 0,

      "&$expanded": {
        margin: 0
      }
    }
  }),
  { name: "ChannelContentWrapperExpanderSummary" }
);

export interface ChannelContentWrapperProps {
  data: ChannelData;
  children: React.ReactNode;
  messages: Messages;
}

const ChannelContentWrapper: React.FC<ChannelContentWrapperProps> = ({
  data,
  messages,
  children
}) => {
  const expanderClasses = useExpanderStyles({});
  const summaryClasses = useSummaryStyles({});

  const { name } = data;

  return (
    <Accordion
      classes={expanderClasses}
      data-test="channel-availability-item"
    >
      <AccordionSummary
        expandIcon={<IconChevronDown />}
        classes={summaryClasses}
      >
        <Typography>{name}</Typography>
        <Typography variant="caption">{messages.availableDateText}</Typography>
      </AccordionSummary>
      {children}
    </Accordion>
  );
};

export default ChannelContentWrapper;
