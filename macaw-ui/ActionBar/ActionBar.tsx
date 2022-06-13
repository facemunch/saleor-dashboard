import Portal from "@mui/material/Portal";
import React from "react";

import { ConfirmButtonTransitionState } from "../ConfirmButton";
import { useActionBar } from "./context";
import { IonFooter, IonToolbar } from "@ionic/react";
import { Slide } from "@mui/material";

export interface ActionBarProps {
  disabled: boolean;
  state: ConfirmButtonTransitionState;
  children: React.ReactNode[] | React.ReactNode;
}

export const ActionBar: React.FC<ActionBarProps> = ({
  disabled,
  children,
  state
}) => {
  const { anchor, setDocked } = useActionBar();
  React.useEffect(() => {
    if (!disabled && state !== "loading") {
      setDocked(false);
    }
  }, [disabled, state, setDocked]);
  React.useEffect(() => () => setDocked(true), [setDocked]);
  console.log("state", {
    state,
    disabled,
    anchor: anchor.current,
    "!!anchor": !!anchor
  });
  if (!anchor.current) {
    return null;
  }

  return (
    <Portal container={anchor.current}>
      <Slide direction="up" in={!!anchor} container={anchor.current}>
        <IonFooter>
          <IonToolbar
            style={{ "--background": "#404040", borderRadius: "16px 16px 0 0" }}
          >
            {children}
          </IonToolbar>
        </IonFooter>
      </Slide>
    </Portal>
  );
};
ActionBar.displayName = "ActionBar";
