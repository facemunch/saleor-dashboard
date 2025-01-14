import { Card, CardContent } from "@mui/material";
import { makeStyles } from "@saleor/macaw-ui";
import classNames from "classnames";
import React from "react";

import { IonCardContent, IonCard } from "@ionic/react";

import CardTitle from "../CardTitle";
import CompanyAddressForm, {
  CompanyAddressFormProps
} from "./CompanyAddressForm";

interface CompanyAddressInputProps extends CompanyAddressFormProps {
  className?: string;
  header: string;
}

const useStyles = makeStyles(
  {
    root: {
      overflow: "visible"
    }
  },
  { name: "CompanyAddressInput" }
);

const CompanyAddressInput: React.FC<CompanyAddressInputProps> = props => {
  const { className, header, ...formProps } = props;
  const classes = useStyles(props);

  return (
    <IonCard className={classNames(classes.root, className)}>
      <CardTitle title={header} />
      <IonCardContent>
        <CompanyAddressForm {...formProps} />
      </IonCardContent>
    </IonCard>
  );
};
CompanyAddressInput.displayName = "CompanyAddressInput";
export default CompanyAddressInput;
