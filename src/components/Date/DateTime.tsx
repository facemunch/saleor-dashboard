import { Tooltip } from "@mui/material";
import moment from "moment-timezone";
import React from "react";
import ReactMoment from "react-moment";

import { LocaleConsumer } from "../Locale";
import { TimezoneConsumer } from "../Timezone";
import { Consumer } from "./DateContext";

interface DateTimeProps {
  date: string;
  plain?: boolean;
}

export const DateTime: React.FC<DateTimeProps> = ({ date, plain }) => {
  const getTitle = (value: string, locale?: string, tz?: string) => {
    let date = moment(value).locale(locale);
    if (tz !== undefined) {
      date = date.tz(tz);
    }
    return date.format("lll");
  };
  return (
    <TimezoneConsumer>
      {tz => (
        <LocaleConsumer>
          {({ locale }) => (
            <Consumer>
              {currentDate =>
                plain ? (
                  getTitle(date, locale, tz)
                ) : (
                  <Tooltip title={getTitle(date, locale, tz)}>
                    <span>
                      <ReactMoment from={currentDate} locale={locale} tz={tz}>
                        {date}
                      </ReactMoment>
                    </span>
                  </Tooltip>
                )
              }
            </Consumer>
          )}
        </LocaleConsumer>
      )}
    </TimezoneConsumer>
  );
};
DateTime.displayName = "DateTime";
export default DateTime;
