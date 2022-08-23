import { IonIcon } from "@ionic/react";
import useNavigator from "@saleor/hooks/useNavigator";
import React from "react";
import { close } from "ionicons/icons";

interface ModalCloseIconProps {
  to: string;
}

const ModalCloseIcon: React.FC<ModalCloseIconProps> = ({ to = "/c/home" }) => {
  const navigate = useNavigator();

  return (
    <button
      data-theme="black"
      className="btn btn-secondary btn-circle btn-xs "
      style={{
        position: "absolute",
        top: "0",
        zIndex: "100",
        right: "0",
        margin: "12px"
      }}
    >
      <IonIcon
        onClick={() => {
          navigate(to);
        }}
        slot="iconOnly"
        icon={close}
      />
    </button>
  );
};
ModalCloseIcon.displayName = "ModalCloseIcon";
export default ModalCloseIcon;
