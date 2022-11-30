import { ThemeProvider } from "@saleor/macaw-ui";
import { defaultDataIdFromObject, InMemoryCache } from "apollo-cache-inmemory";
import { IntrospectionFragmentMatcher } from "apollo-cache-inmemory";
import { ApolloClient } from "apollo-client";
import { ApolloLink } from "apollo-link";
import { BatchHttpLink } from "apollo-link-batch-http";
import { createUploadLink } from "apollo-upload-client";
import React, { memo, useMemo } from "react";
import { ApolloProvider } from "react-apollo";

import introspectionQueryResultData from "../../fragmentTypes.json";

import { ExternalAppProvider } from "../apps/components/ExternalAppContext";

import AuthProvider from "../auth/AuthProvider";
import { AppChannelProvider } from "../components/AppLayout/AppChannelContext";
import { DateProvider } from "../components/Date";
import { LocaleProvider } from "../components/Locale";
import MessageManagerProvider from "../components/messages";
import { ShopProvider } from "../components/Shop";

import AppStateProvider from "../containers/AppState";
import BackgroundTasksProvider from "../containers/BackgroundTasks";
import ServiceWorker from "../containers/ServiceWorker/ServiceWorker";

import { setContext } from "apollo-link-context";
import Routes from "./Routes";
import OnboardingProvider from "@saleor/components/Onboarding/Onboarding";

interface IProps {
  onRouteUpdate?: (route: string) => void;
  ecomAccessToken?: string | null;
  ecomAPI?: string | null;
  isDemoMode?: boolean;
  isActiveSeller?: boolean;
  isShowConnectMessage?: boolean;
  connect?: () => void;
  dismissConnectMessage?: () => void;
}

const createClient = () => {
  let client;
  return (url: string, token: string) => {
    if (client) return client;
    return (client = getApolloClient(url, token));
  };
};

export const getClient = createClient();

const getApolloClient = (ecomAPI, ecomAccessToken) => {
  const linkOptions = {
    credentials: "include",
    uri: ecomAPI
  };
  const uploadLink = createUploadLink(linkOptions);
  const batchLink = new BatchHttpLink({
    batchInterval: 100,
    ...linkOptions
  });

  const link = ApolloLink.split(
    operation => operation.getContext().useBatching,
    batchLink,
    uploadLink
  );

  const fragmentMatcher = new IntrospectionFragmentMatcher({
    introspectionQueryResultData
  });

  const tokenLink = setContext((_, context) => {
    return {
      ...context,
      headers: {
        ...context.headers,
        "Authorization-Bearer": ecomAccessToken || null
      }
    };
  });

  const noTokenLink = setContext((_, context) => {
    return {
      ...context,
      headers: {
        ...context.headers
      }
    };
  });

  const authLink = tokenLink;

  return new ApolloClient({
    cache: new InMemoryCache({
      fragmentMatcher,
      dataIdFromObject: (obj: any) => {
        if (obj.__typename === "Shop") {
          return "shop";
        }
        return defaultDataIdFromObject(obj);
      }
    }),

    link: ApolloLink.split(
      operation => operation.getContext().api === "public",
      noTokenLink,
      authLink
    ).concat(link)
  });
};

const App: React.FC<IProps> = ({
  ecomAccessToken,
  ecomAPI,
  isDemoMode,
  isActiveSeller,
  isShowConnectMessage,
  connect,
  dismissConnectMessage
}) => {
  const apolloClient = useMemo(() => {
    return getClient(ecomAPI, ecomAccessToken);
  }, [ecomAPI, ecomAccessToken]);

  return (
    <ApolloProvider client={apolloClient}>
      <ThemeProvider>
        <DateProvider>
          <LocaleProvider>
            <MessageManagerProvider>
              <ServiceWorker />
              <BackgroundTasksProvider>
                <AppStateProvider>
                  <AuthProvider>
                    <ShopProvider>
                      <AppChannelProvider>
                        <ExternalAppProvider>
                          <OnboardingProvider 
                            isDemoMode={isDemoMode}
                            isActiveSeller={isActiveSeller}
                            isShowConnectMessage={isShowConnectMessage}
                            connect={connect}
                            dismissConnectMessage={dismissConnectMessage}>
                            <Routes ecomAccessToken={ecomAccessToken} />
                          </OnboardingProvider>
                        </ExternalAppProvider>
                      </AppChannelProvider>
                    </ShopProvider>
                  </AuthProvider>
                </AppStateProvider>
              </BackgroundTasksProvider>
            </MessageManagerProvider>
          </LocaleProvider>
        </DateProvider>
      </ThemeProvider>
    </ApolloProvider>
  );
};

export default memo(App);
