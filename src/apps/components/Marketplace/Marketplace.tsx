import { Button, Card, CardContent, Typography } from "@mui/material";
import CardTitle from "@saleor/components/CardTitle";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { useStyles } from "../../styles";

interface MarketplaceProps {
  link?: () => void;
}

const Marketplace: React.FC<MarketplaceProps> = ({ link }) => {
  const intl = useIntl();
  const classes = useStyles({});

  return (
    <div className={classes.appContainer}>
      <Card>
        <CardTitle
          title={intl.formatMessage({
            defaultMessage: "FaceMunch's Marketplace",
            description: "section header"
          })}
        />
        <CardContent className={classes.marketplaceContent}>
          {!!link ? (
            <>
              <Typography variant="body2">
                <FormattedMessage
                  defaultMessage="Discover great free and paid apps in our FaceMunch's Marketplace."
                  description="marketplace content"
                />
              </Typography>
              <Button color="primary" onClick={link}>
                <FormattedMessage
                  defaultMessage="Visit Marketplace"
                  description="marketplace button"
                />
              </Button>
            </>
          ) : (
            <Typography variant="body2">
              <FormattedMessage
                defaultMessage="Marketplace is coming soon"
                description="marketplace content"
              />
            </Typography>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

Marketplace.displayName = "Marketplace";
export default Marketplace;
