import { Card, CardContent, TextField, Typography } from "@mui/material";
import CardTitle from "@saleor/components/CardTitle";
import { FormSpacer } from "@saleor/components/FormSpacer";
import { AccountErrorFragment } from "@saleor/fragments/types/AccountErrorFragment";
import { getFormErrors } from "@saleor/utils/errors";
import getAccountErrorMessage from "@saleor/utils/errors/account";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { IonCard, IonCardContent } from "@ionic/react";

export interface CustomerCreateNoteProps {
  data: {
    note: string;
  };
  disabled: boolean;
  errors: AccountErrorFragment[];
  onChange: (event: React.ChangeEvent<any>) => void;
}

const CustomerCreateNote: React.FC<CustomerCreateNoteProps> = ({
  data,
  disabled,
  errors,
  onChange
}) => {
  const intl = useIntl();

  const formErrors = getFormErrors(["note"], errors);

  return (
    <IonCard>
      <CardTitle
        title={intl.formatMessage({
          defaultMessage: "Notes",
          description: "notes about customer header"
        })}
      />
      <IonCardContent>
        <Typography>
          <FormattedMessage defaultMessage="Enter any extra infotmation regarding this customer." />
        </Typography>
        <FormSpacer />
        <TextField
          disabled={disabled}
          error={!!formErrors.note}
          fullWidth
          multiline
          name="note"
          helperText={getAccountErrorMessage(formErrors.note, intl)}
          label={intl.formatMessage({
            defaultMessage: "Note",
            description: "note about customer"
          })}
          value={data.note}
          onChange={onChange}
        />
      </IonCardContent>
    </IonCard>
  );
};
CustomerCreateNote.displayName = "CustomerCreateNote";
export default CustomerCreateNote;
