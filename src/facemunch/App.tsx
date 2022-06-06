import { ThemeProvider } from "@saleor/macaw-ui";
import { defaultDataIdFromObject, InMemoryCache } from "apollo-cache-inmemory";
import { IntrospectionFragmentMatcher } from "apollo-cache-inmemory";
import { ApolloClient } from "apollo-client";
import { ApolloLink } from "apollo-link";
import { BatchHttpLink } from "apollo-link-batch-http";
import { createUploadLink } from "apollo-upload-client";
import React, { useEffect } from "react";
import { ApolloProvider } from "react-apollo";

import { Route, useLocation } from "react-router-dom";
import introspectionQueryResultData from "../../fragmentTypes.json";

import { ExternalAppProvider } from "../apps/components/ExternalAppContext";

import AuthProvider from "../auth/AuthProvider";
import SectionRoute from "../auth/components/SectionRoute";
import authLink from "../auth/link";

import AppLayout from "../components/AppLayout";
// import AuthSandbox from "../auth/views/LoginSandBox";
import { AppChannelProvider } from "../components/AppLayout/AppChannelContext";
import { DateProvider } from "../components/Date";
import { LocaleProvider } from "../components/Locale";
import MessageManagerProvider from "../components/messages";
import { ShopProvider } from "../components/Shop";

import ConfigurationSection from "../configuration";

import AppStateProvider from "../containers/AppState";
import BackgroundTasksProvider from "../containers/BackgroundTasks";
import ServiceWorker from "../containers/ServiceWorker/ServiceWorker";
import { CustomerSection } from "../customers";

import HomePage from "../home";

import OrdersSection from "../orders";

import ProductSection from "../products";

import ShippingSection from "../shipping";
import SiteSettingsSection from "../siteSettings";

import "swiper/css";

import { BrowserRouter } from "react-router-dom";

const linkOptions = {
  credentials: "include",
  uri: localStorage.getItem("ecomAPI")
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

const apolloClient = new ApolloClient({
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

interface IProps {
  onRouteUpdate: (route: string) => void;
}

const App: React.FC<IProps> = ({ onRouteUpdate }) => (
  <ApolloProvider client={apolloClient}>
    <BrowserRouter basename={"/c"}>
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
                          <RoutesApp onRouteUpdate={onRouteUpdate} />
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
    </BrowserRouter>
  </ApolloProvider>
);

const RoutesApp: React.FC<IProps> = ({ onRouteUpdate }) => {
  const location = useLocation();

  useEffect(() => {
    setTimeout(() => onRouteUpdate(window.location.pathname), 0);
  }, [location]);

  return (
    <>
      <AppLayout>
        <Route
          exact
          path={"/home"}
          render={() => (
            <SectionRoute>
              <HomePage />
            </SectionRoute>
          )}
        />

        <Route
          path={"/products/"}
          render={() => (
            <>
              <ProductSection />
            </>
          )}
        />
        <Route
         
          path={"/orders/"}
          render={() => (
            <>
              <OrdersSection />
            </>
          )}
        />
        <Route
          path={"/customers/"}
          render={() => (
            <>
              <CustomerSection />
            </>
          )}
        />
        <Route
          exact
          path={"/configuration"}
          render={() => (
            <>
              <ConfigurationSection />
            </>
          )}
        />
        <Route
          
          path={"/shipping"}
          render={() => (
            <SectionRoute>
              <ShippingSection />
            </SectionRoute>
          )}
        />
        <Route
          
          path={"/site-settings"}
          render={() => (
            <SectionRoute>
              <SiteSettingsSection />
            </SectionRoute>
          )}
        />
      </AppLayout>
    </>
  );
};

export default App;
