import React from "react";

import { useActionBar } from "../ActionBar";
import { ActionBar } from "../ActionBar/ActionBar";
import {
  ConfirmButton,
  ConfirmButtonLabels,
  ConfirmButtonTransitionState
} from "../ConfirmButton";
import { ButtonTooltipDecorator } from "./ButtonTooltipDecorator";
import useStyles from "./styles";

import { IonButton } from "@ionic/react";

export type SavebarLabels = ConfirmButtonLabels &
  Record<"delete" | "cancel", string>;
export type SavebarTooltips = Partial<
  Record<"confirm" | "delete" | "cancel", string>
>;
export interface SavebarProps {
  disabled: boolean;
  state: ConfirmButtonTransitionState;
  labels: SavebarLabels;
  tooltips?: SavebarTooltips;
  onCancel: () => void;
  onDelete?: () => void;
  onSubmit: () => void;
}

export const Savebar: React.FC<SavebarProps> = ({
  disabled,
  labels,
  tooltips,
  state,
  onCancel,
  onDelete,
  onSubmit
}) => {
  const classes = useStyles();
  const { setDocked } = useActionBar();

  return (
    <ActionBar state={state} disabled={disabled}>
      {!!onDelete && (
        <ButtonTooltipDecorator tooltip={tooltips?.delete}>
          <IonButton
            fill="clear"
            color="danger"
            onClick={onDelete}
            // className={classes.deleteButton}
            data-test="button-bar-delete"
          >
            {labels.delete}
          </IonButton>
        </ButtonTooltipDecorator>
      )}
      <div className={classes.spacer} />
      <ButtonTooltipDecorator tooltip={tooltips?.cancel}>
        <IonButton
          slot="start"
          className={classes.cancelButton}
          fill="clear"
          onClick={onCancel}
          data-test="button-bar-cancel"
        >
          {labels.cancel}
        </IonButton>
      </ButtonTooltipDecorator>
      <ButtonTooltipDecorator tooltip={tooltips?.confirm}>
        <ConfirmButton
          disabled={disabled}
          labels={labels}
          onClick={onSubmit}
          transitionState={state}
          data-test="button-bar-confirm"
          onTransitionToDefault={() => setDocked(true)}
        />
      </ButtonTooltipDecorator>
    </ActionBar>
  );
};
Savebar.displayName = "Savebar";
