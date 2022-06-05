import Portal from "@mui/material/Portal";
import React from "react";

import { ConfirmButtonTransitionState } from "../ConfirmButton";
import useWindowScroll from "../tools/useWindowScroll";
import { useActionBar } from "./context";
import { IonFooter, IonToolbar } from "@ionic/react";

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
  const scrollPosition = useWindowScroll();

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
      <IonFooter style={{ width: "100vw" }}>
        <IonToolbar
          style={{ "--background": "#404040", borderRadius: "16px 16px 0 0" }}
        >
          {children}
        </IonToolbar>
      </IonFooter>
    </Portal>
  );
};
ActionBar.displayName = "ActionBar";
