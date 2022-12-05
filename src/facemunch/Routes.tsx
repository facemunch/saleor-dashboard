import React, { memo, useEffect, useMemo, useRef } from "react";
import useUser from "@saleor/hooks/useUser";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, History } from "swiper";
import { Route, useLocation, useHistory } from "react-router-dom";
import { IonContent, IonicSlides, IonModal } from "@ionic/react";
import { productPath } from "../products/urls";
import { userDataQuery } from "./queries";
import { CustomerDetailsView } from "../customers";
import { customerPath } from "../customers/urls";

import { ProductUpdate, ProductCreate } from "../products";

import { OrderDetails, OrderRefund } from "../orders";
import { orderPath, orderRefundPath } from "../orders/urls";
import { useTabs } from "frontend/hooks/tabsProvider";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/free-mode";
import "swiper/css/history";

import "@ionic/react/css/ionic-swiper.css";
import AppLayout from "../components/AppLayout";

import HomePage from "../home";
import { OrderList } from "../orders";
import ConfigurationSection from "../configuration";
import { ShippingZonesList } from "../shipping";
import { ProductList } from "../products";

interface IProps {
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

const RoutesApp: React.FC<IProps> = ({ ecomAccessToken }) => {
  const { loginByToken } = useUser();
  const { data, loading } = userDataQuery();

  const { pathname } = useLocation();

  useEffect(() => {
    if (!ecomAccessToken || loading || !data) return;
    loginByToken(ecomAccessToken, "", data.me);
  }, [ecomAccessToken, data, loading]);

  return <RoutesInner pathname={pathname} />;
};

const RoutesInner: React.FC<{ pathname: string }> = memo(({ pathname }) => {
  const { setVisible } = useTabs();
  const activeIndex = useMemo(() => {
    if (pathname.includes("home")) {
      return 0;
    } else if (pathname.includes("products")) {
      pathname === "/c/products" && setVisible(true);
      return 1;
    } else if (pathname.includes("orders")) {
      return 2;
    } else if (pathname.includes("customers")) {
      return 3;
    }
  }, [pathname]);
  const refto = useRef();
  const homeModalRef = useRef();
  const shippingListModalRef = useRef();
  const orderModalRef = useRef();
  const { goBack, push } = useHistory();
  return (
    <>
      <IonContent id="ecommerce" scrollX={false} scrollY={false} ref={refto}>
        <AppLayout>
          <>
            <Swiper
              cssMode={true}
              style={{
                height: "100vh",
                width: "100vw"
              }}
              onInit={e => {
                e.activeIndex = activeIndex;
                e.updateSlides();
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
                    "<ion-segment-button style='margin: 0' data-test-id='commerce-tab-" +
                    menu[index].toLowerCase() +
                    "-trigger' class='ios in-segment segment-button-has-label segment-button-has-label-only segment-button-layout-icon-top ion-activatable ion-activatable-instant SideBarDrawer-menuItemBtn-150 " +
                    className +
                    "'>" +
                    menu[index] +
                    "</ion-segment-button>"
                  );
                }
              }}
              modules={[Pagination, History, Navigation, IonicSlides]}
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
            </Swiper>

            <IonModal
              mode="ios"
              style={{
                "--border-radius": "16px"
              }}
              backdropDismiss={true}
              isOpen={
                pathname.includes("/products/") &&
                pathname !== "/c/products/add"
              }
              breakpoints={[0, 1]}
              canDismiss={true}
              presentingElement={refto.current}
              onWillDismiss={() => {
                if (pathname.includes("/products/")) {
                  push("/c/products");
                }
              }}
            >
              <Route
                path={"/c/products/" + productPath(":id", "")}
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
              breakpoints={[0, 1]}
              presentingElement={refto.current}
              onWillDismiss={() => {
                if (pathname === "/c/products/add") {
                  push("/c/products");
                }
              }}
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
              presentingElement={refto.current}
              onWillDismiss={() =>
                pathname.includes("/orders/") && push("/c/orders")
              }
            >
              <Route
                path={"/c/orders/" + orderPath(":id", "")}
                render={() => <OrderDetails orderModalRef={orderModalRef} />}
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
              presentingElement={orderModalRef.current}
              onWillDismiss={() => {
                pathname.includes("/orders/") &&
                  push(`${pathname.replace("/refund", "")}`);
              }}
            >
              <Route
                exact
                path={"/c/orders/" + orderRefundPath(":id", "")}
                render={() => <OrderRefund />}
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
                pathname === "/c/configuration" ||
                pathname.includes("/shipping")
              }
              canDismiss={true}
              presentingElement={refto.current}
              onWillDismiss={() => push("/c/home")}
            >
              <ConfigurationSection />
            </IonModal>
            <IonModal
              style={{
                "--border-radius": "16px"
              }}
              mode="ios"
              ref={shippingListModalRef}
              backdropDismiss={true}
              isOpen={pathname.includes("/shipping")}
              canDismiss={true}
              presentingElement={homeModalRef.current}
              onWillDismiss={() => push("/c/configuration")}
            >
              <ShippingZonesList shippingListModalRef={shippingListModalRef} />
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
                path={"/customers/" + customerPath(":id", "")}
                render={() => <CustomerDetailsView />}
              />
            </IonModal>
          </>
        </AppLayout>
      </IonContent>
    </>
  );
});

export default memo(RoutesApp);
