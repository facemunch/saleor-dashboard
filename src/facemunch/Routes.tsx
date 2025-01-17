import React, { memo, useEffect, useMemo, useRef } from "react";
import useUser from "@saleor/hooks/useUser";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, History } from "swiper";
import { Route, useLocation, useHistory } from "react-router-dom";
import { IonicSlides, IonModal, IonPage } from "@ionic/react";
import { productPath } from "../products/urls";
import { userDataQuery } from "./queries";

import { ProductUpdate, ProductCreate } from "../products";

import { CustomerDetailsView, CustomerAddressesView } from "../customers";

import { customerAddressesPath, customerPath } from "../customers/urls";

import { OrderDetails, OrderRefund } from "../orders";
import { orderPath, orderRefundPath } from "../orders/urls";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/free-mode";
import "swiper/css/history";

import "@ionic/react/css/ionic-swiper.css";

// import authLink from "../auth/link";
import AppLayout from "../components/AppLayout";
import { CustomerListView } from "../customers";

import HomePage from "../home";
import { OrderList } from "../orders";
import ConfigurationSection from "../configuration";
import ShippingSection from "../shipping";
import { ProductList } from "../products";

interface IProps {
  onRouteUpdate: (route: string) => void;
  ecomAccessToken?: string | null;
  ecomAPI?: string | null;
  match?: string | null;
}

const menu = {
  0: "Home",
  1: "Products",
  2: "Orders",
  3: "Customers"
};

const RoutesApp: React.FC<IProps> = ({ onRouteUpdate, ecomAccessToken }) => {
  const { loginByToken } = useUser();
  const { data, loading } = userDataQuery();

  const { pathname, search } = useLocation();
  const { goBack, push } = useHistory();

  const refto = useRef();
  const homeModalRef = useRef();
  const orderModalRef = useRef();

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

  const onSlideChange = e => {
    e.activeIndex === 0 && onRouteUpdate("/c/home");
    e.activeIndex === 1 && onRouteUpdate("/c/products" + search);
    e.activeIndex === 2 && onRouteUpdate("/c/orders" + search);
    e.activeIndex === 3 && onRouteUpdate("/c/customers" + search);
  };

  useEffect(() => {
    if (!ecomAccessToken || loading || !data) return;
    loginByToken(ecomAccessToken, "", data.me);
  }, [ecomAccessToken, data, loading]);
  return (
    <IonPage ref={refto}>
      <AppLayout>
        <>
          <Swiper
            cssMode={true}
            style={{
              height: "100vh",
              width: "100vw"
            }}
            onSlideChangeTransitionEnd={onSlideChange}
            onInit={e => {
              e.updateActiveIndex(getActiveIndex);
            }}
            spaceBetween={0}
            slidesPerView={1}
            history={{
              enabled: true,
              root: "/",
              key: "c",
              keepQuery: true
            }}
            pagination={{
              enabled: true,
              clickable: true,
              renderBullet: function(index, className) {
                return (
                  "<ion-segment-button data-test-id='commerce-tab-" +
                  menu[index].toLowerCase() +
                  "-trigger' class='ios in-segment segment-button-has-label segment-button-has-label-only segment-button-layout-icon-top ion-activatable ion-activatable-instant ion-focusable SideBarDrawer-menuItemBtn-150 " +
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

          <IonModal
            mode="ios"
            style={{
              "--border-radius": "16px"
            }}
            backdropDismiss={true}
            isOpen={
              pathname.includes("/products/") && pathname !== "/products/add"
            }
            canDismiss={true}
            presentingElement={refto.current || undefined}
            onWillDismiss={() =>
              pathname.includes("/products/") && push("/products")
            }
          >
            <Route
              path={"/products/" + productPath(":id", "")}
              render={() => <ProductUpdate />}
            />
          </IonModal>
          <IonModal
            style={{
              "--border-radius": "16px"
            }}
            mode="ios"
            backdropDismiss={true}
            isOpen={pathname.includes("/products/add")}
            canDismiss={true}
            presentingElement={refto.current || undefined}
            onWillDismiss={() =>
              pathname === "/products/add" && push("/products")
            }
          >
            <ProductCreate />
          </IonModal>
          <IonModal
            style={{
              "--border-radius": "16px"
            }}
            mode="ios"
            ref={orderModalRef}
            backdropDismiss={true}
            isOpen={pathname.includes("/orders/")}
            canDismiss={true}
            presentingElement={refto.current || undefined}
            onWillDismiss={() => pathname.includes("/orders/") && goBack()}
          >
            <Route
              path={"/orders/" + orderPath(":id", "")}
              render={() => <OrderDetails />}
            />
          </IonModal>
          <IonModal
            style={{
              "--border-radius": "16px"
            }}
            mode="ios"
            backdropDismiss={true}
            isOpen={
              pathname.includes("/orders/") && pathname.includes("/refund")
            }
            canDismiss={true}
            presentingElement={orderModalRef.current || undefined}
            // onWillDismiss={() => pathname.includes("/orders/") && goBack()}
          >
            <Route
              exact
              path={"/orders/" + orderRefundPath(":id", "")}
              render={() => <OrderRefund />}
            />
          </IonModal>
          <IonModal
            style={{
              "--border-radius": "16px"
            }}
            mode="ios"
            backdropDismiss={true}
            isOpen={pathname.includes("/customers/")}
            canDismiss={true}
            presentingElement={refto.current || undefined}
            onWillDismiss={() => pathname.includes("/customers/") && goBack()}
          >
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
          </IonModal>
          <IonModal
            style={{
              "--border-radius": "16px"
            }}
            mode="ios"
            ref={homeModalRef}
            backdropDismiss={true}
            isOpen={
              pathname === "/configuration" || pathname.includes("/shipping")
            }
            canDismiss={true}
            presentingElement={refto.current || undefined}
            onWillDismiss={() => push("/home")}
          >
            <ConfigurationSection />
          </IonModal>
          <IonModal
            style={{
              "--border-radius": "16px"
            }}
            mode="ios"
            backdropDismiss={true}
            isOpen={pathname.includes("/shipping")}
            canDismiss={true}
            presentingElement={homeModalRef.current || undefined}
            onWillDismiss={() => push("/configuration")}
          >
            <ShippingSection />
          </IonModal>
        </>
      </AppLayout>
    </IonPage>
  );
};

export default memo(RoutesApp);
