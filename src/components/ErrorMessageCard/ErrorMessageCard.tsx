import { Card, CardContent, Typography } from "@mui/material";
import React from "react";
import { FormattedMessage } from "react-intl";
interface ErrorMessageCardProps {
  message: string;
}

const ErrorMessageCard: React.FC<ErrorMessageCardProps> = ({ message }) => (
  <Card>
    <CardContent>
      <Typography variant="h5" component="h2">
        <FormattedMessage defaultMessage="Error" description="header" />
      </Typography>
      <Typography variant="body1">{message}</Typography>
    </CardContent>
  </Card>
);
ErrorMessageCard.displayName = "ErrorMessageCard";
export default ErrorMessageCard;
