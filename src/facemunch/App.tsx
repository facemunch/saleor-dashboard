import { ThemeProvider } from "@saleor/macaw-ui";
import { defaultDataIdFromObject, InMemoryCache } from "apollo-cache-inmemory";
import { IntrospectionFragmentMatcher } from "apollo-cache-inmemory";
import { ApolloClient } from "apollo-client";
import { ApolloLink } from "apollo-link";
import { BatchHttpLink } from "apollo-link-batch-http";
import { createUploadLink } from "apollo-upload-client";
import React, { useEffect, useMemo, useRef } from "react";
import { ApolloProvider } from "react-apollo";
import useUser from "@saleor/hooks/useUser";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, History } from "swiper";
import { Route, useLocation } from "react-router-dom";
import { IonicSlides } from "@ionic/react";
import { productPath } from "../products/urls";

import { ProductUpdate, ProductCreate } from "../products";

import { CustomerDetailsView, CustomerAddressesView } from "../customers";

import { customerAddressesPath, customerPath } from "../customers/urls";

import {
  // OrderSettings,
  OrderFulfill,
  OrderReturn,
  OrderDetails
} from "../orders";
import { orderFulfillPath, orderReturnPath, orderPath } from "../orders/urls";

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
import authLink from "../auth/link";
import AppLayout from "../components/AppLayout";
import { AppChannelProvider } from "../components/AppLayout/AppChannelContext";
import { DateProvider } from "../components/Date";
import { LocaleProvider } from "../components/Locale";
import MessageManagerProvider from "../components/messages";
import { ShopProvider } from "../components/Shop";

import AppStateProvider from "../containers/AppState";
import BackgroundTasksProvider from "../containers/BackgroundTasks";
import ServiceWorker from "../containers/ServiceWorker/ServiceWorker";
import { CustomerListView } from "../customers";

import HomePage from "../home";
import { OrderList } from "../orders";
import ConfigurationSection from "../configuration";
import ShippingSection from "../shipping";
import { ProductList } from "../products";

import { BrowserRouter } from "react-router-dom";
import { PermissionEnum } from "@saleor/types/globalTypes";
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
  }, [ecomAPI]);

  return (
    <ApolloProvider client={apolloClient}>
      <BrowserRouter basename={"/c/"}>
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
                            <RoutesApp
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
      </BrowserRouter>
    </ApolloProvider>
  );
};

const menu = {
  0: "Home",
  1: "Products",
  2: "Orders",
  3: "Customers"
};

const RoutesApp: React.FC<IProps> = ({ onRouteUpdate, ecomAccessToken }) => {
  const { loginByToken } = useUser();

  const { pathname, search } = useLocation();

  const swiperRef = useRef();

  const getActiveIndex = useMemo(() => {
    if (pathname.includes("home")) {
      return 0;
    } else if (pathname.includes("products")) {
      return 1;
    } else if (pathname.includes("orders")) {
      return 2;
    } else if (pathname.includes("customers")) {
      return 3;
    }
  }, [pathname]);

  useEffect(() => {
    console.log("pathname, RoutesApp", { pathname, swiperRef, search });
    if (!swiperRef.current) return;

    if (pathname.includes("home")) {
      swiperRef.current.slideTo(0);
    } else if (pathname.includes("products")) {
      swiperRef.current.slideTo(1);
    } else if (pathname.includes("orders")) {
      swiperRef.current.slideTo(2);
    } else if (pathname.includes("customers")) {
      swiperRef.current.slideTo(3);
    }
  }, [pathname, search]);

  const onSlideChange = e => {
    e.activeIndex === 0 && onRouteUpdate("/c/home");
    e.activeIndex === 1 && onRouteUpdate("/c/products" + search);
    e.activeIndex === 2 && onRouteUpdate("/c/orders" + search);
    e.activeIndex === 3 && onRouteUpdate("/c/customers" + search);
  };

  useEffect(() => {
    if (!ecomAccessToken) return;
    loginByToken(ecomAccessToken, "", {
      __typename: "User",
      id: "",
      email: "",
      firstName: "",
      lastName: "",
      isStaff: true,
      userPermissions: [
        {
          code: "MANAGE_ORDERS" as PermissionEnum,
          name: "Manage orders.",
          __typename: "UserPermission"
        },
        {
          code: "MANAGE_USERS" as PermissionEnum,
          name: "Manage users.",
          __typename: "UserPermission"
        },
        {
          code: "MANAGE_PRODUCTS" as PermissionEnum,
          name: "Manage products.",
          __typename: "UserPermission"
        },
        {
          code: "MANAGE_SHIPPING" as PermissionEnum,
          name: "Manage shipping.",
          __typename: "UserPermission"
        }
      ],
      avatar: undefined
    });
  }, [ecomAccessToken]);

  const isTopRoute = location =>
    ["/home", "/products", "/orders", "/customers"].includes(location.pathname);
  return (
    <>
      <AppLayout>
        <>
          <Route
            render={({ location }) => (
              <Swiper
                cssMode={true}
                style={{
                  opacity: isTopRoute(location) ? 1 : 0,
                  zIndex: isTopRoute(location) ? 0 : -1,
                  height: "100vh",
                  width: "100vw"
                }}
                onSlideChangeTransitionEnd={onSlideChange}
                onInit={e => {
                  e.updateActiveIndex(getActiveIndex);
                  swiperRef.current = e;
                }}
                spaceBetween={0}
                slidesPerView={1}
                history={{
                  enabled: true,
                  root: "/",
                  key: "c"
                }}
                pagination={{
                  enabled: true,
                  clickable: true,
                  renderBullet: function(index, className) {
                    return (
                      "<ion-segment-button class='ios in-segment segment-button-has-label segment-button-has-label-only segment-button-checked segment-button-layout-icon-top ion-activatable ion-activatable-instant ion-focusable SideBarDrawer-menuItemBtn-150 " +
                      className +
                      "'>" +
                      menu[index] +
                      "</ion-segment-button>"
                    );
                  }
                }}
                modules={[Pagination, Navigation, History, IonicSlides]}
                className="mySwiper"
              >
                <SwiperSlide data-history="home">
                  <HomePage />
                </SwiperSlide>
                <SwiperSlide data-history="products">
                  <ProductList />
                </SwiperSlide>
                <SwiperSlide data-history="orders">
                  <OrderList />
                </SwiperSlide>
                <SwiperSlide data-history="customers">
                  <CustomerListView />
                </SwiperSlide>
              </Swiper>
            )}
          />
          <Route
            exact
            path={"/products/add"}
            render={() => <ProductCreate />}
          />
          <Route
            exact
            path={"/products/" + productPath(":id", "")}
            render={() => <ProductUpdate />}
          />
          <Route
            exact
            path={"/orders/" + orderFulfillPath(":id", "")}
            render={() => <OrderFulfill />}
          />
          <Route
            exact
            path={"/orders/" + orderReturnPath(":id", "")}
            render={() => <OrderReturn />}
          />

          <Route
            exact
            path={"/orders/" + orderPath(":id", "")}
            render={() => <OrderDetails />}
          />
          <Route
            exact
            path={"/customers/" + customerAddressesPath(":id", "")}
            render={() => <CustomerAddressesView />}
          />
          <Route
            exact
            path={"/customers/" + customerPath(":id", "")}
            render={() => <CustomerDetailsView />}
          />

          {/* <Route
          exact
          path={"/orders/" + productPath(":id", "")}
          render={() => <ProductUpdate />}
        /> */}

          {/* <Route
          exact
          path={"/home"}
          render={() => (
            <SectionRoute>
             
            </SectionRoute>
          )}
        /> */}

          {/* <Route
          path={"/products/"}
          render={() => (
            <>
              <ProductSection />
            </>
          )}
        /> */}
          {/* <Route
          path={"/orders/"}
          render={() => (
            <>
              <OrdersSection />
            </>
          )}
        />
        <Route
          path={"/customers"}
          render={() => (
            <>
              <CustomerSection />
            </>
          )}
        /> */}
          <Route
            exact
            path={"/configuration"}
            render={() => (
              <>
                <ConfigurationSection />
              </>
            )}
          />
          <Route path={"/shipping"} render={() => <ShippingSection />} />
          {/* <Route
          path={"/site-settings"}
          render={() => (
              <SiteSettingsSection />
          )}
        /> */}
        </>
      </AppLayout>
    </>
  );
};

export default App;
