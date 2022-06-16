import Portal from "@mui/material/Portal";
import React from "react";

import { ConfirmButtonTransitionState } from "../ConfirmButton";
import { useActionBar } from "./context";
import { IonFooter, IonToolbar } from "@ionic/react";
import { Slide } from "@mui/material";

const fixedStyle = {
  position: "fixed",
  bottom: 0,
  width: "100vw",
};
const toolBarStyle = {
  "--background": "#404040",
  borderRadius: "16px 16px 0 0"
};
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

  if (!anchor.current) {
    return null;
  }

  return (
    <Portal container={anchor.current}>
      <Slide direction="up" in={!!anchor} container={anchor.current}>
        <IonFooter style={fixedStyle}>
          <IonToolbar style={toolBarStyle}>{children}</IonToolbar>
        </IonFooter>
      </Slide>
    </Portal>
  );
};
ActionBar.displayName = "ActionBar";
