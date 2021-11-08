import DemoBanner from "@saleor/components/DemoBanner";
import useAppState from "@saleor/hooks/useAppState";
import { ThemeProvider } from "@saleor/macaw-ui";
import { defaultDataIdFromObject, InMemoryCache } from "apollo-cache-inmemory";
import { IntrospectionFragmentMatcher } from "apollo-cache-inmemory";
import { ApolloClient } from "apollo-client";
import { ApolloLink } from "apollo-link";
import { BatchHttpLink } from "apollo-link-batch-http";
import { createUploadLink } from "apollo-upload-client";
import React from "react";
import { ApolloProvider } from "react-apollo";
import ErrorBoundary from "react-error-boundary";
import TagManager from "react-gtm-module";
import { useIntl } from "react-intl";
import { Routes } from "react-router-dom";
import { Route } from "react-router";
import introspectionQueryResultData from "../../fragmentTypes.json";
import AppsSection from "../apps";
import { ExternalAppProvider } from "../apps/components/ExternalAppContext";
import AttributeSection from "../attributes";
import Auth from "../auth";
import AuthProvider, { useAuth } from "../auth/AuthProvider";
import LoginLoading from "../auth/components/LoginLoading/LoginLoading";
import SectionRoute from "../auth/components/SectionRoute";
import authLink from "../auth/link";
import CategorySection from "../categories";
import ChannelsSection from "../channels";
import { channelsSection } from "../channels/urls";
import CollectionSection from "../collections";
import AppLayout from "../components/AppLayout";
import useAppChannel, {
  AppChannelProvider
} from "../components/AppLayout/AppChannelContext";
import { DateProvider } from "../components/Date";
import { LocaleProvider } from "../components/Locale";
import MessageManagerProvider from "../components/messages";
import { ShopProvider } from "../components/Shop";
import { WindowTitle } from "../components/WindowTitle";
import { API_URI, DEMO_MODE, GTM_ID } from "../config";
import ConfigurationSection from "../configuration";
import { getConfigMenuItemsPermissions } from "../configuration/utils";
import AppStateProvider from "../containers/AppState";
import BackgroundTasksProvider from "../containers/BackgroundTasks";
import ServiceWorker from "../containers/ServiceWorker/ServiceWorker";
import { CustomerSection } from "../customers";
import DiscountSection from "../discounts";
import GiftCardSection from "../giftCards";
import HomePage from "../home";
import { commonMessages } from "../intl";
import NavigationSection from "../navigation";
import { NotFound } from "../NotFound";
import OrdersSection from "../orders";
import PageSection from "../pages";
import PageTypesSection from "../pageTypes";
import PermissionGroupSection from "../permissionGroups";
import PluginsSection from "../plugins";
import ProductSection from "../products";
import ProductTypesSection from "../productTypes";
import errorTracker from "../services/errorTracking";
import ShippingSection from "../shipping";
import SiteSettingsSection from "../siteSettings";
import StaffSection from "../staff";
import TaxesSection from "../taxes";
import themeOverrides from "../themeOverrides";
import TranslationsSection from "../translations";
import { PermissionEnum } from "../types/globalTypes";
import WarehouseSection from "../warehouses";

if (process.env.GTM_ID) {
  TagManager.initialize({ gtmId: GTM_ID });
}

errorTracker.init();

// DON'T TOUCH THIS
// These are separate clients and do not share configs between themselves
// so we need to explicitly set them
const linkOptions = {
  credentials: "include",
  uri: API_URI || `https://alex.commerce.fcmn.ch/graphql/`
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
      // We need to set manually shop's ID, since it is singleton and
      // API does not return its ID
      if (obj.__typename === "Shop") {
        return "shop";
      }
      return defaultDataIdFromObject(obj);
    }
  }),
  link: authLink.concat(link)
});

const App: React.FC = () => (
  <ApolloProvider client={apolloClient}>
    {/* <HashRouter basename={"/ecommerce"}> */}
      <ThemeProvider overrides={themeOverrides}>
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
                          <Routes2 />
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
    {/* </HashRouter> */}
  </ApolloProvider>
);

const Routes2: React.FC = () => {
  const intl = useIntl();
  const [, dispatchAppState] = useAppState();
  const {
    hasToken,
    isAuthenticated,
    tokenAuthLoading,
    tokenVerifyLoading
  } = useAuth();


  const { channel } = useAppChannel(false);

  const channelLoaded = typeof channel !== "undefined";

  const homePageLoaded =
    channelLoaded &&
    isAuthenticated &&
    !tokenAuthLoading &&
    !tokenVerifyLoading;

  const homePageLoading =
    (isAuthenticated && !channelLoaded) || (hasToken && tokenVerifyLoading);

  return (
    <>
      <WindowTitle title={intl.formatMessage(commonMessages.dashboard)} />
      {DEMO_MODE && <DemoBanner />}
      {homePageLoaded ? (
        <AppLayout>
          <ErrorBoundary
            onError={e => {
              const errorId = errorTracker.captureException(e);

              dispatchAppState({
                payload: {
                  error: "unhandled",
                  errorId
                },
                type: "displayError"
              });
            }}
          >
            <Routes>
              <SectionRoute path="/" element={<HomePage />} />
              <SectionRoute
                permissions={[PermissionEnum.MANAGE_PRODUCTS]}
                path="/categories"
                element={<CategorySection />}
              />
              <SectionRoute
                permissions={[PermissionEnum.MANAGE_PRODUCTS]}
                path="/categories/*"
                element={<CategorySection />}
              />
              <SectionRoute
                permissions={[PermissionEnum.MANAGE_PRODUCTS]}
                path="/collections"
                element={<CollectionSection />}
              />
              <SectionRoute
                permissions={[PermissionEnum.MANAGE_PRODUCTS]}
                path="/collections/*"
                element={<CollectionSection />}
              />
              <SectionRoute
                permissions={[PermissionEnum.MANAGE_USERS]}
                path="/customers"
                element={<CustomerSection />}
              />
              <SectionRoute
                permissions={[PermissionEnum.MANAGE_USERS]}
                path="/customers/*"
                element={<CustomerSection />}
              />
              <SectionRoute
                permissions={[PermissionEnum.MANAGE_GIFT_CARD]}
                path="/gift-cards"
                element={<GiftCardSection />}
              />
              <SectionRoute
                permissions={[PermissionEnum.MANAGE_GIFT_CARD]}
                path="/gift-cards/*"
                element={<GiftCardSection />}
              />
              <SectionRoute
                permissions={[PermissionEnum.MANAGE_DISCOUNTS]}
                path="/discounts"
                element={<DiscountSection />}
              />
              <SectionRoute
                permissions={[PermissionEnum.MANAGE_DISCOUNTS]}
                path="/discounts/*"
                element={<DiscountSection />}
              />
              <SectionRoute
                permissions={[PermissionEnum.MANAGE_PAGES]}
                path="/pages"
                element={<PageSection />}
              />
              <SectionRoute
                permissions={[PermissionEnum.MANAGE_PAGES]}
                path="/pages/*"
                element={<PageSection />}
              />
              <SectionRoute
                permissions={[
                  PermissionEnum.MANAGE_PAGES,
                  PermissionEnum.MANAGE_PAGE_TYPES_AND_ATTRIBUTES
                ]}
                path="/page-types"
                element={<PageTypesSection />}
                matchPermission="any"
              />
              <SectionRoute
                permissions={[
                  PermissionEnum.MANAGE_PAGES,
                  PermissionEnum.MANAGE_PAGE_TYPES_AND_ATTRIBUTES
                ]}
                path="/page-types/*"
                element={<PageTypesSection />}
                matchPermission="any"
              />
              <SectionRoute
                permissions={[PermissionEnum.MANAGE_PLUGINS]}
                path="/plugins"
                element={<PluginsSection />}
              />
              <SectionRoute
                permissions={[PermissionEnum.MANAGE_PLUGINS]}
                path="/plugins/*"
                element={<PluginsSection />}
              />
              <SectionRoute
                permissions={[PermissionEnum.MANAGE_ORDERS]}
                path="/orders"
                element={<OrdersSection />}
              />
              <SectionRoute
                permissions={[PermissionEnum.MANAGE_ORDERS]}
                path="/orders/*"
                element={<OrdersSection />}
              />
              <SectionRoute
                permissions={[PermissionEnum.MANAGE_PRODUCTS]}
                path="products"
                element={ <ProductSection />}
              />
              <SectionRoute
                permissions={[PermissionEnum.MANAGE_PRODUCTS]}
                path="products/*"
                element={ <ProductSection />}
              />
              <SectionRoute
                permissions={[
                  PermissionEnum.MANAGE_PRODUCT_TYPES_AND_ATTRIBUTES
                ]}
                path="/product-types"
                element={<ProductTypesSection />}
              />
              <SectionRoute
                permissions={[
                  PermissionEnum.MANAGE_PRODUCT_TYPES_AND_ATTRIBUTES
                ]}
                path="/product-types/*"
                element={<ProductTypesSection />}
              />
              <SectionRoute
                permissions={[PermissionEnum.MANAGE_STAFF]}
                path="/staff"
                element={<StaffSection />}
              />
              <SectionRoute
                permissions={[PermissionEnum.MANAGE_STAFF]}
                path="/staff/*"
                element={<StaffSection />}
              />
              <SectionRoute
                permissions={[PermissionEnum.MANAGE_STAFF]}
                path="/permission-groups"
                element={<PermissionGroupSection />}
              />
              <SectionRoute
                permissions={[PermissionEnum.MANAGE_STAFF]}
                path="/permission-groups/*"
                element={<PermissionGroupSection />}
              />
              <SectionRoute
                permissions={[PermissionEnum.MANAGE_SETTINGS]}
                path="/site-settings"
                element={<SiteSettingsSection />}
              />
              <SectionRoute
                permissions={[PermissionEnum.MANAGE_SETTINGS]}
                path="/site-settings/*"
                element={<SiteSettingsSection />}
              />
              <SectionRoute
                permissions={[PermissionEnum.MANAGE_SETTINGS]}
                path="/taxes"
                element={<TaxesSection />}
              />
              <SectionRoute
                permissions={[PermissionEnum.MANAGE_SETTINGS]}
                path="/taxes/*"
                element={<TaxesSection />}
              />
              <SectionRoute
                permissions={[PermissionEnum.MANAGE_SHIPPING]}
                path="/shipping"
                element={<ShippingSection />}
              />
              <SectionRoute
                permissions={[PermissionEnum.MANAGE_SHIPPING]}
                path="/shipping/*"
                element={<ShippingSection />}
              />
              <SectionRoute
                permissions={[PermissionEnum.MANAGE_TRANSLATIONS]}
                path="/translations"
                element={<TranslationsSection />}
              />
              <SectionRoute
                permissions={[PermissionEnum.MANAGE_TRANSLATIONS]}
                path="/translations/*"
                element={<TranslationsSection />}
              />
              <SectionRoute
                permissions={[PermissionEnum.MANAGE_MENUS]}
                path="/navigation"
                element={<NavigationSection />}
              />
              <SectionRoute
                permissions={[PermissionEnum.MANAGE_MENUS]}
                path="/navigation/*"
                element={<NavigationSection />}
              />
              <SectionRoute
                permissions={[
                  PermissionEnum.MANAGE_PRODUCT_TYPES_AND_ATTRIBUTES,
                  PermissionEnum.MANAGE_PAGE_TYPES_AND_ATTRIBUTES
                ]}
                path="/attributes"
                element={<AttributeSection />}
                matchPermission="any"
              />
              <SectionRoute
                permissions={[
                  PermissionEnum.MANAGE_PRODUCT_TYPES_AND_ATTRIBUTES,
                  PermissionEnum.MANAGE_PAGE_TYPES_AND_ATTRIBUTES
                ]}
                path="/attributes/*"
                element={<AttributeSection />}
                matchPermission="any"
              />
              <SectionRoute
                permissions={[PermissionEnum.MANAGE_APPS]}
                path="/apps"
                element={<AppsSection />}
              />
              <SectionRoute
                permissions={[PermissionEnum.MANAGE_APPS]}
                path="/apps/*"
                element={<AppsSection />}
              />
              <SectionRoute
                permissions={[PermissionEnum.MANAGE_PRODUCTS]}
                path="/warehouses"
                element={<WarehouseSection />}
              />
              <SectionRoute
                permissions={[PermissionEnum.MANAGE_PRODUCTS]}
                path="/warehouses/*"
                element={<WarehouseSection />}
              />
              <SectionRoute
                permissions={[PermissionEnum.MANAGE_CHANNELS]}
                path={channelsSection}
                element={<ChannelsSection />}
              />
              <SectionRoute
                matchPermission="any"
                permissions={getConfigMenuItemsPermissions(intl)}
                path="/configuration"
                element={<ConfigurationSection />}
              />
              <Route component={NotFound} />
            </Routes>
          </ErrorBoundary>
        </AppLayout>
      ) : homePageLoading ? (
        <LoginLoading />
      ) : (
        <Auth />
      )}
    </>
  );
};

export default App;
