import { Card, CardContent, Typography, IconProps } from "@mui/material";
import { makeStyles } from "@saleor/macaw-ui";
import React from "react";
import { FormattedMessage } from "react-intl";

const useStyles = makeStyles(
  theme => ({
    cardContent: {
      "&:last-child": {
        // padding: theme.spacing(2, 3)
      },
      width: "42vw",
      display: "grid",
      gridColumnGap: theme.spacing(3),
      gridTemplateColumns: "1fr 48px"
    },
    cardSpacing: {},
    cardSubtitle: {
      fontSize: 12,
      height: "20px",
      lineHeight: 0.9,
      opacity: 0.7
    },
    cardTitle: {
      fontSize: 20,
      fontWeight: 500 as 500
    },
    icon: {
      color: theme.palette.primary.contrastText,
      fontSize: 54,
      margin: ".5rem .3rem"
    },
    iconBackground: {
      backgroundColor: "#22262C",
      borderRadius: "8px",
      color: "white",
      fontSize: "54px",
      height: "100%",
      padding: "10px 5px 0px 5px",
      width: "100%"
    },
    value: {
      textAlign: "left",
      paddingLeft: "12px"
    }
  }),
  { name: "HomeAnalyticsCard" }
);

interface HomeAnalyticsCardProps {
  testId?: string;
  icon: React.ReactElement<IconProps>;
  title: string;
  children?: React.ReactNode;
}

const HomeAnalyticsCard: React.FC<HomeAnalyticsCardProps> = props => {
  const { children, title, icon, testId } = props;

  const classes = useStyles(props);

  return (
    <Card className={classes.cardSpacing}>
      <CardContent className={classes.cardContent} data-test-id={testId}>
        <div>
          <Typography className={classes.cardTitle} variant="subtitle1">
            {title}
          </Typography>

          <Typography
            className={classes.value}
            color="textPrimary"
            variant="h4"
          >
            {children}
          </Typography>
          <Typography
            className={classes.cardSubtitle}
            variant="caption"
            color="textSecondary"
          >
            <FormattedMessage
              defaultMessage="Today"
              id="homeAnalyticsCardHeader"
            />
          </Typography>
        </div>
      </CardContent>
    </Card>
  );
};
HomeAnalyticsCard.displayName = "HomeAnalyticsCard";
export default HomeAnalyticsCard;
