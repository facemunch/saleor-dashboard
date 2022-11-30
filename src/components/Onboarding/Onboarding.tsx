import React, { useEffect } from "react";

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
  const [state, setState] = React.useState<OnboardingContextType>({
    isDemoMode,
    isActiveSeller,
    isShowConnectMessage,
    connect,
    dismissConnectMessage
  });

  useEffect(() => {
    if (isDemoMode !== state.isDemoMode) {
      setState(prev => ({...prev, isDemoMode}))
    }
    if (isActiveSeller !== state.isActiveSeller) {
      setState(prev => ({...prev, isActiveSeller}))
    }
    if (isShowConnectMessage !== state.isShowConnectMessage) {
      setState(prev => ({...prev, isShowConnectMessage}))
    }
  }, [isDemoMode, isActiveSeller, isShowConnectMessage])

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
