import { Typography } from "@mui/material";
import { Channel as ChannelList, ChannelData } from "@saleor/channels/utils";
import Hr from "@saleor/components/Hr";
import useDateLocalize from "@saleor/hooks/useDateLocalize";
import { RequireOnlyOne } from "@saleor/misc";
import { PermissionEnum } from "@saleor/types/globalTypes";
import React, { useEffect } from "react";
import { useIntl } from "react-intl";

import { IonCard, IonCardContent } from "@ionic/react";

import ChannelAvailabilityItemContent from "./Channel/ChannelAvailabilityItemContent";
import ChannelAvailabilityItemWrapper from "./Channel/ChannelAvailabilityItemWrapper";
import ChannelsAvailabilityCardWrapper, {
  ChannelsAvailabilityWrapperProps
} from "./ChannelsAvailabilityCardWrapper";
import { useStyles } from "./styles";
import { ChannelOpts, ChannelsAvailabilityError, Messages } from "./types";
import { getChannelsAvailabilityMessages } from "./utils";

export interface ChannelsAvailability
  extends Omit<ChannelsAvailabilityWrapperProps, "children"> {
  channels: ChannelData[];
  channelsList: ChannelList[];
  errors?: ChannelsAvailabilityError[];
  isAutoPresentToPublished?: boolean;
  disabled?: boolean;
  isDigitalProduct?: boolean;
  messages?: Messages;
  managePermissions: PermissionEnum[];
  onChange?: (id: string, data: ChannelOpts) => void;
}

export type ChannelsAvailabilityCardProps = RequireOnlyOne<
  ChannelsAvailability,
  "channels" | "channelsList"
>;

export const ChannelsAvailability: React.FC<ChannelsAvailabilityCardProps> = props => {
  const {
    channelsList,
    errors = [],
    selectedChannelsCount = 0,
    allChannelsCount = 0,
    channels,
    messages,
    managePermissions,
    onChange,
    openModal,
    isDigitalProduct = false,
    isAutoPresentToPublished = false
  } = props;
  const intl = useIntl();
  const localizeDate = useDateLocalize();
  const classes = useStyles({});

  const channelsMessages = getChannelsAvailabilityMessages({
    messages,
    channels,
    intl,
    localizeDate
  });
  useEffect(() => {
    if (!isAutoPresentToPublished) return;
    onChange(channels[0].id, {
      availableForPurchase: null,
      isAvailableForPurchase: true,
      isPublished: true,
      publicationDate: "2022-06-03",
      visibleInListings: true
    });
  }, [channels, isAutoPresentToPublished]);

  return (
    <IonCard>
      <IonCardContent>
        {/* <ChannelsAvailabilityCardWrapper
      selectedChannelsCount={selectedChannelsCount}
      allChannelsCount={allChannelsCount}
      managePermissions={managePermissions}
      openModal={openModal}
    > */}

        {channels
          ? channels.map(data => {
              const channelErrors =
                errors?.filter(error => error.channels.includes(data.id)) || [];

              return (
                <div>
                  {/* <ChannelAvailabilityItemWrapper messages={messages} data={data}> */}
                  <ChannelAvailabilityItemContent
                    data={data}
                    onChange={onChange}
                    messages={channelsMessages[data.id]}
                    errors={channelErrors}
                  />
                  {/* </ChannelAvailabilityItemWrapper> */}
                </div>
              );
            })
          : channelsList
          ? channelsList.map(data => (
              <React.Fragment key={data.id}>
                <div className={classes.channelItem}>
                  <div className={classes.channelName}>
                    <Typography>{data.name}</Typography>
                  </div>
                </div>
                <Hr className={classes.hr} />
              </React.Fragment>
            ))
          : null}
        {/* </ChannelsAvailabilityCardWrapper> */}
      </IonCardContent>
    </IonCard>
  );
};

export default ChannelsAvailability;
