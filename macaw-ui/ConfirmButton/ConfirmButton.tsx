import { Button, ButtonProps, CircularProgress } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import clsx from "clsx";
import React from "react";
import { IonButton } from "@ionic/react";

import useStyles from "./styles";

const DEFAULT_NOTIFICATION_SHOW_TIME = 3000;
export type ConfirmButtonTransitionState =
  | "loading"
  | "success"
  | "error"
  | "default";

export type ConfirmButtonLabels = Record<"confirm" | "error", string>;
export interface ConfirmButtonProps extends Omit<ButtonProps, "classes"> {
  labels: ConfirmButtonLabels;
  noTransition?: boolean;
  transitionState: ConfirmButtonTransitionState;
  onTransitionToDefault?: () => void;
}

export const ConfirmButton: React.FC<ConfirmButtonProps> = ({
  children,
  className,
  disabled,
  labels,
  noTransition,
  transitionState,
  onClick,
  onTransitionToDefault,
  ...props
}) => {
  const classes = useStyles();
  const [
    displayCompletedActionState,
    setDisplayCompletedActionState
  ] = React.useState(false);
  const timeout = React.useRef<number>();

  React.useEffect(() => {
    if (!noTransition && transitionState === "loading") {
      setDisplayCompletedActionState(true);
    }
  }, [transitionState, noTransition]);

  React.useEffect(() => {
    if (
      !noTransition &&
      (["error", "success"] as ConfirmButtonTransitionState[]).includes(
        transitionState
      )
    ) {
      timeout.current = (setTimeout(() => {
        setDisplayCompletedActionState(false);
        if (onTransitionToDefault) {
          onTransitionToDefault();
        }
      }, DEFAULT_NOTIFICATION_SHOW_TIME) as unknown) as number;
    } else if (transitionState === "loading") {
      clearTimeout(timeout.current);
    }

    return () => {
      if (timeout.current) {
        clearTimeout(timeout.current);
      }
    };
  }, [noTransition, transitionState, onTransitionToDefault]);

  const isCompleted = noTransition
    ? transitionState !== "default"
    : displayCompletedActionState;

  return (
    <IonButton
      slot="primary"
      // variant="contained"
      onClick={transitionState === "loading" ? undefined : onClick}
      // color="dark"
      fill="solid"
      // className={clsx(className, {
      //   [classes.error]: transitionState === "error" && isCompleted,
      //   [classes.success]: transitionState === "success" && isCompleted
      // })}
      disabled={!isCompleted && disabled}
      data-test-state={isCompleted ? transitionState : "default"}
      {...props}
    >
      <CircularProgress
        size={24}
        color="inherit"
        className={clsx({
          [classes.progress]: true,
          [classes.invisible]: transitionState !== "loading"
        })}
      />
      <CheckIcon
        className={clsx({
          [classes.icon]: true,
          [classes.invisible]: !(transitionState === "success" && isCompleted)
        })}
      />
      <span
        className={clsx({
          [classes.label]: true,
          [classes.invisible]:
            (transitionState === "loading" || transitionState === "success") &&
            isCompleted
        })}
      >
        {transitionState === "error" && isCompleted
          ? labels.error
          : children || labels.confirm}
      </span>
    </IonButton>
  );
};

ConfirmButton.displayName = "ConfirmButton";
