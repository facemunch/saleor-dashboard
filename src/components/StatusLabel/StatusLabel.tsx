import { IonChip, IonIcon, IonLabel } from "@ionic/react";
import { Typography } from "@mui/material";
import grey from "@mui/material/colors/grey";
import yellow from "@mui/material/colors/yellow";
import { makeStyles } from "@saleor/macaw-ui";
import Label from "@saleor/orders/components/OrderHistory/Label";
import classNames from "classnames";
import React from "react";

export const useStyles = makeStyles(
  theme => {
    const dot = {
      borderRadius: "100%",
      height: 8,
      minHeight: 8,
      width: 8,
      minWidth: 8
    };

    return {
      dot,
      container: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center"
      },
      containerVertical: {
        alignItems: "flex-start"
      },
      textContainer: {
        marginLeft: theme.spacing(1),
        display: "flex",
        flexDirection: "column",
        width: "100%"
      },
      dotVertical: {
        marginTop: theme.spacing(1)
      },
      alertDot: {
        backgroundColor: yellow[500],
        ...dot
      },
      errorDot: {
        backgroundColor: theme.palette.error.main,
        ...dot
      },
      neutralDot: {
        backgroundColor: grey[300],
        ...dot
      },
      successDot: {
        backgroundColor: theme.palette.primary.main,
        ...dot
      },
      span: {
        display: "inline"
      }
    };
  },
  { name: "StatusLabel" }
);

const chipStyle = {
  fontSize: '11px',
  margin: 0,
  height: "24px"
}

export interface StatusLabelProps {
  label: string | React.ReactNode;
  status: "success" | "alert" | "neutral" | "error" | undefined;
  subtitle?: string;
  className?: string;
}

const StatusLabel: React.FC<StatusLabelProps> = ({
  className,
  label,
  status,
  subtitle
}) => {
  const classes = useStyles({});

  return (
    <IonChip color={'dark'} style={chipStyle}>
      <IonIcon
        className={classNames({
          [className]: true,
          [classes.dotVertical]: !!subtitle,
          [classes.successDot]: status === "success",
          [classes.alertDot]: status === "alert",
          [classes.neutralDot]: status === "neutral",
          [classes.errorDot]: status === "error"
        })}
      ></IonIcon>
      <IonLabel>
        {label}
        {subtitle && <Label text={subtitle} />}
      </IonLabel>
    </IonChip>
  );
};

export default StatusLabel;
