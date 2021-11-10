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
import { Routes, Route } from "react-router-dom";
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
      {/* TODO RA MIGRATION <ThemeProvider overrides={themeOverrides}> */}
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
                          <RoutesApp />
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

const RoutesApp: React.FC = () => {
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
            <Route path="/" element={
                <SectionRoute>
                  <HomePage />
                </SectionRoute>}
              />
              <Route path="/categories" element={
                <SectionRoute permissions={[PermissionEnum.MANAGE_PRODUCTS]}>
                  <CategorySection />
                </SectionRoute>}
              />
              <Route path="/categories/*" element={
                <SectionRoute permissions={[PermissionEnum.MANAGE_PRODUCTS]}>
                  <CategorySection />
                </SectionRoute>}
              />
              <Route path="/collections" element={
                <SectionRoute permissions={[PermissionEnum.MANAGE_PRODUCTS]}>
                  <CollectionSection />
                </SectionRoute>}
              />
              <Route path="/collections/*" element={
                <SectionRoute permissions={[PermissionEnum.MANAGE_PRODUCTS]}>
                  <CollectionSection />
                </SectionRoute>}
              />
              <Route path="/customers" element={
                <SectionRoute permissions={[PermissionEnum.MANAGE_USERS]}>
                  <CustomerSection />
                </SectionRoute>}
              />
              <Route path="/customers/*" element={
                <SectionRoute permissions={[PermissionEnum.MANAGE_USERS]}>
                  <CustomerSection />
                </SectionRoute>}
              />
              <Route path="/gift-cards" element={
                <SectionRoute permissions={[PermissionEnum.MANAGE_GIFT_CARD]}>
                  <GiftCardSection />
                </SectionRoute>}
              />
              <Route path="/gift-cards/*" element={
                <SectionRoute permissions={[PermissionEnum.MANAGE_GIFT_CARD]}>
                  <GiftCardSection />
                </SectionRoute>}
              />
              <Route path="/discounts" element={
                <SectionRoute permissions={[PermissionEnum.MANAGE_DISCOUNTS]}>
                  <DiscountSection />
                </SectionRoute>}
              />
              <Route path="/discounts/*" element={
                <SectionRoute permissions={[PermissionEnum.MANAGE_DISCOUNTS]}>
                  <DiscountSection />
                </SectionRoute>}
              />
              <Route path="/pages" element={
                <SectionRoute permissions={[PermissionEnum.MANAGE_PAGES]}>
                  <PageSection />
                </SectionRoute>}
              />
              <Route path="/pages/*" element={
                <SectionRoute permissions={[PermissionEnum.MANAGE_PAGES]}>
                  <PageSection />
                </SectionRoute>}
              />
              <Route path="/page-types" element={
                <SectionRoute permissions={[
                  PermissionEnum.MANAGE_PAGES,
                  PermissionEnum.MANAGE_PAGE_TYPES_AND_ATTRIBUTES
                ]}>
                  <PageTypesSection />
                </SectionRoute>}
              />
              <Route path="/page-types/*" element={
                <SectionRoute permissions={[
                  PermissionEnum.MANAGE_PAGES,
                  PermissionEnum.MANAGE_PAGE_TYPES_AND_ATTRIBUTES
                ]}>
                  <PageTypesSection />
                </SectionRoute>}
              />
              <Route path="/plugins" element={
                <SectionRoute permissions={[PermissionEnum.MANAGE_PLUGINS]}>
                  <PluginsSection />
                </SectionRoute>}
              />
              <Route path="/plugins/*" element={
                <SectionRoute permissions={[PermissionEnum.MANAGE_PLUGINS]}>
                  <PluginsSection />
                </SectionRoute>}
              />
              <Route path="/orders" element={
                <SectionRoute permissions={[PermissionEnum.MANAGE_ORDERS]}>
                  <OrdersSection />
                </SectionRoute>}
              />
              <Route path="/orders/*" element={
                <SectionRoute permissions={[PermissionEnum.MANAGE_ORDERS]}>
                  <OrdersSection />
                </SectionRoute>}
              />
              <Route path="/products" element={
                <SectionRoute permissions={[PermissionEnum.MANAGE_PRODUCTS]}>
                  <ProductSection />
                </SectionRoute>}
              />
              <Route path="/products/*" element={
                <SectionRoute permissions={[PermissionEnum.MANAGE_PRODUCTS]}>
                  <ProductSection />
                </SectionRoute>}
              />
              <Route path="/product-types" element={
                <SectionRoute permissions={[PermissionEnum.MANAGE_PRODUCT_TYPES_AND_ATTRIBUTES]}>
                  <ProductTypesSection />
                </SectionRoute>}
              />
              <Route path="/product-types/*" element={
                <SectionRoute permissions={[PermissionEnum.MANAGE_PRODUCT_TYPES_AND_ATTRIBUTES]}>
                  <ProductTypesSection />
                </SectionRoute>}
              />
              <Route path="/staff" element={
                <SectionRoute permissions={[PermissionEnum.MANAGE_STAFF]}>
                  <StaffSection />
                </SectionRoute>}
              />
              <Route path="/staff/*" element={
                <SectionRoute permissions={[PermissionEnum.MANAGE_STAFF]}>
                  <StaffSection />
                </SectionRoute>}
              />
              <Route path="/permission-groups" element={
                <SectionRoute permissions={[PermissionEnum.MANAGE_STAFF]}>
                  <PermissionGroupSection />
                </SectionRoute>}
              />
              <Route path="/permission-groups/*" element={
                <SectionRoute permissions={[PermissionEnum.MANAGE_STAFF]}>
                  <PermissionGroupSection />
                </SectionRoute>}
              />
              <Route path="/site-settings" element={
                <SectionRoute permissions={[PermissionEnum.MANAGE_SETTINGS]}>
                  <SiteSettingsSection />
                </SectionRoute>}
              />
              <Route path="/site-settings/*" element={
                <SectionRoute permissions={[PermissionEnum.MANAGE_SETTINGS]}>
                  <SiteSettingsSection />
                </SectionRoute>}
              />
              <Route path="/taxes" element={
                <SectionRoute permissions={[PermissionEnum.MANAGE_SETTINGS]}>
                  <TaxesSection />
                </SectionRoute>}
              />
              <Route path="/taxes/*" element={
                <SectionRoute permissions={[PermissionEnum.MANAGE_SETTINGS]}>
                  <TaxesSection />
                </SectionRoute>}
              />
              <Route path="/shipping" element={
                <SectionRoute permissions={[PermissionEnum.MANAGE_SHIPPING]}>
                  <ShippingSection />
                </SectionRoute>}
              />
              <Route path="/shipping/*" element={
                <SectionRoute permissions={[PermissionEnum.MANAGE_SHIPPING]}>
                  <ShippingSection />
                </SectionRoute>}
              />
              <Route path="/translations" element={
                <SectionRoute permissions={[PermissionEnum.MANAGE_TRANSLATIONS]}>
                  <TranslationsSection />
                </SectionRoute>}
              />
              <Route path="/translations/*" element={
                <SectionRoute permissions={[PermissionEnum.MANAGE_TRANSLATIONS]}>
                  <TranslationsSection />
                </SectionRoute>}
              />
              <Route path="/navigation" element={
                <SectionRoute permissions={[PermissionEnum.MANAGE_MENUS]}>
                  <NavigationSection />
                </SectionRoute>}
              />
              <Route path="/navigation/*" element={
                <SectionRoute permissions={[PermissionEnum.MANAGE_MENUS]}>
                  <NavigationSection />
                </SectionRoute>}
              />
              <Route path="/attributes" element={
                <SectionRoute permissions={[
                  PermissionEnum.MANAGE_PRODUCT_TYPES_AND_ATTRIBUTES,
                  PermissionEnum.MANAGE_PAGE_TYPES_AND_ATTRIBUTES
                ]}>
                  <AttributeSection />
                </SectionRoute>}
              />
              <Route path="/attributes/*" element={
                <SectionRoute permissions={[
                  PermissionEnum.MANAGE_PRODUCT_TYPES_AND_ATTRIBUTES,
                  PermissionEnum.MANAGE_PAGE_TYPES_AND_ATTRIBUTES
                ]}>
                  <AttributeSection />
                </SectionRoute>}
              />
              <Route path="/apps" element={
                <SectionRoute permissions={[PermissionEnum.MANAGE_APPS]}>
                  <AppsSection />
                </SectionRoute>}
              />
              <Route path="/apps/*" element={
                <SectionRoute permissions={[PermissionEnum.MANAGE_APPS]}>
                  <AppsSection />
                </SectionRoute>}
              />
              <Route path="/warehouses" element={
                <SectionRoute permissions={[PermissionEnum.MANAGE_PRODUCTS]}>
                  <WarehouseSection />
                </SectionRoute>}
              />
              <Route path="/warehouses/*" element={
                <SectionRoute permissions={[PermissionEnum.MANAGE_PRODUCTS]}>
                  <WarehouseSection />
                </SectionRoute>}
              />
              <Route path="/channels" element={
                <SectionRoute permissions={[PermissionEnum.MANAGE_CHANNELS]}>
                  <ChannelsSection />
                </SectionRoute>}
              />
              <Route path="/channels/*" element={
                <SectionRoute permissions={[PermissionEnum.MANAGE_CHANNELS]}>
                  <ChannelsSection />
                </SectionRoute>}
              />
              <Route path="/configuration" element={
                <SectionRoute matchPermission="any"
                  permissions={getConfigMenuItemsPermissions(intl)}>
                  <ConfigurationSection />
                </SectionRoute>}
              />
              <Route element={<NotFound />} />
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
