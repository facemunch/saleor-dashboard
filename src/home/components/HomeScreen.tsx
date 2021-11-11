import { Card, CardContent, Typography } from "@mui/material";
import CardTitle from "@saleor/components/CardTitle";
import Container from "@saleor/components/Container";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

interface HomeScreenProps {
  user: {
    email: string;
  };
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ user }) => {
  const intl = useIntl();

  return (
    <Container>
     
      <Card>
        <CardTitle
          title={intl.formatMessage({
            defaultMessage: "Disclaimer",
            description: "header",
            id: "homeScreenDisclaimer"
          })}
        />
        <CardContent>
          <Typography>
            <FormattedMessage
              defaultMessage="The new dashboard and the GraphQL API are preview-quality software."
              id="homeScreenDisclaimerText1"
            />
          </Typography>
          <Typography>
            <FormattedMessage
              defaultMessage="The GraphQL API is beta quality. It is not fully optimized and some mutations or queries may be missing."
              id="homeScreenDisclaimerText2"
            />
          </Typography>
        </CardContent>
      </Card>
    </Container>
  );
};
