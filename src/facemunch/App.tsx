import { ThemeProvider } from "@saleor/macaw-ui";
import { defaultDataIdFromObject, InMemoryCache } from "apollo-cache-inmemory";
import { IntrospectionFragmentMatcher } from "apollo-cache-inmemory";
import { ApolloClient } from "apollo-client";
import { ApolloLink } from "apollo-link";
import { BatchHttpLink } from "apollo-link-batch-http";
import { createUploadLink } from "apollo-upload-client";
import React, { memo, useMemo } from "react";
import { ApolloProvider } from "react-apollo";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/free-mode";
import "swiper/css/history";

import "@ionic/react/css/ionic-swiper.css";

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
import { IonReactRouter } from "@ionic/react-router";

interface IProps {
  onRouteUpdate: (route: string) => void;
  ecomAccessToken?: string | null;
  ecomAPI?: string | null;
}
const App: React.FC<IProps> = ({ onRouteUpdate, ecomAccessToken, ecomAPI }) => {
  const apolloClient = useMemo(() => {
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

      const authToken = ecomAccessToken;
      return {
        ...context,
        headers: {
          ...context.headers,
          "Authorization-Bearer": authToken || null
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
      link: authLink.concat(link)
    });
  }, [ecomAPI, ecomAccessToken]);
  return (
    <ApolloProvider client={apolloClient}>
      <IonReactRouter basename={"/c/"}>
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
                            <Routes
                              ecomAccessToken={ecomAccessToken}
                              onRouteUpdate={onRouteUpdate}
                            />
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
      </IonReactRouter>
    </ApolloProvider>
  );
};

export default memo(App);
