import React from "react";

export type OnboardingContextType = {
  isDemoMode?: boolean;
  isActiveSeller?: boolean;
  isShowConnectMessage?: boolean;
  connect?: () => void;
  dismissConnectMessage?: () => void;
};

export const OnboardingContext = React.createContext<OnboardingContextType>({});

const OnboardingProvider: React.FC<OnboardingContextType> = ({
  isDemoMode,
  isActiveSeller,
  isShowConnectMessage,
  connect,
  dismissConnectMessage,
  children
}) => {
  const [state] = React.useState<OnboardingContextType>({
    isDemoMode,
    isActiveSeller,
    isShowConnectMessage,
    connect,
    dismissConnectMessage
  });

  return (
    <OnboardingContext.Provider value={state}>
      {children}
    </OnboardingContext.Provider>
  );
};

export const useOnboarding = () => {
  return React.useContext(OnboardingContext);
};

export const { Consumer } = OnboardingContext;

export default OnboardingProvider;
