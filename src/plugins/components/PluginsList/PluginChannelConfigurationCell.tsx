import { TableCell } from "@mui/material";
import { PluginBaseFragment } from "@saleor/fragments/types/PluginBaseFragment";
import { isPluginGlobal } from "@saleor/plugins/views/utils";
import React from "react";
import { FormattedMessage } from "react-intl";

import { pluginChannelConfigurationCellMessages as messages } from "./messages";

interface PluginChannelConfigurationCellProps {
  plugin: PluginBaseFragment;
}

const PluginChannelConfigurationCell: React.FC<PluginChannelConfigurationCellProps> = ({
  plugin
}) => {
  const message = isPluginGlobal(plugin.globalConfiguration)
    ? messages.globalLabel
    : messages.channelLabel;

  return (
    <TableCell colSpan={2}>
      <FormattedMessage {...message} />
    </TableCell>
  );
};

export default PluginChannelConfigurationCell;
