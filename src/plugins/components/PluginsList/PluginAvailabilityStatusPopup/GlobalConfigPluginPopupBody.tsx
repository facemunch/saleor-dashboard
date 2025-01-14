import { CardContent, Typography } from "@mui/material";
import CardSpacer from "@saleor/components/CardSpacer";
import StatusLabel from "@saleor/components/StatusLabel";
import { statusLabelMessages } from "@saleor/components/StatusLabel/messages";
import { PluginBaseFragment } from "@saleor/fragments/types/PluginBaseFragment";
import React from "react";
import { useIntl } from "react-intl";

import { globalConfigPluginMessages as messages } from "../messages";

interface GlobalConfigPluginPopupBodyProps {
  plugin: PluginBaseFragment;
}

const GlobalConfigPluginPopupBody: React.FC<GlobalConfigPluginPopupBodyProps> = ({
  plugin
}) => {
  const intl = useIntl();

  const { active } = plugin.globalConfiguration;

  return (
    <>
      <CardContent>
        <Typography>{intl.formatMessage(messages.title)}</Typography>
        <CardSpacer />
        <Typography variant="caption">
          {intl.formatMessage(messages.description)}
        </Typography>
        <CardSpacer />
        <StatusLabel
          status={active ? "success" : "error"}
          label={intl.formatMessage(
            active ? statusLabelMessages.active : statusLabelMessages.inactive
          )}
        />
      </CardContent>
    </>
  );
};

export default GlobalConfigPluginPopupBody;
