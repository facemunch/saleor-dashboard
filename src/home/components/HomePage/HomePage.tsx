import CardSpacer from "@saleor/components/CardSpacer";
import Skeleton from "@saleor/components/Skeleton";
import { makeStyles } from "@saleor/macaw-ui";
import { UserPermissionProps } from "@saleor/types";
import React, { memo } from "react";
import Orders from "../../../icons/Orders";
import Sales from "../../../icons/Sales";
import {
  Home_activities_edges_node,
  Home_productTopToday_edges_node,
  Home_salesToday_gross
} from "../../types/Home";
import HomeActivityCard from "../HomeActivityCard";
import HomeAnalyticsCard from "../HomeAnalyticsCard";
import HomeProductListCard from "../HomeProductListCard";
import { IonContent, IonCard, IonText, IonButton } from "@ionic/react";
import { Loader } from "frontend/ui/loader";
import { useOnboarding } from "@saleor/components/Onboarding/Onboarding";
import SVG from "react-inlinesvg";
import ConnectImage from "./assets/connect.svg";
import DoneImage from "./assets/done.svg";
import AlertImage from "./assets/alert.svg";

const useStyles = makeStyles(
  theme => ({
    cardContainer: {
      display: "flex",
      justifyContent: "space-between",
      margin: "1rem"
    },
    icon: {
      "& path": {
        fill: theme.palette.primary.main
      }
    },
    loader: {
      position: "fixed",
      top: "0",
      height: "calc(100% - 150px)"
    },
    onboarding: {
      display: "flex",
      background: "white",
      padding: "1rem",
      flexDirection: "column",
      margin: "1rem 1rem 1.5rem 1rem",
      alignItems: "center",
      borderRadius: "1rem"
    },
    onboardingHeader: {
      color: "#101010",
      fontWeight: "800",
      fontSize: "20px",
      marginTop: "0.5rem",
      lineHeight: "30px"
    },
    onboardingMessage: {
      color: "#101010",
      fontWeight: "400",
      fontSize: "16px",
      lineHeight: "20px",
      opacity: "0.7"
    },
    onboardingButton: {
      marginTop: "1rem",
      fontWeight: "600",
      color: "#101010",
    }
  }),
  { name: "HomePage" }
);

export interface HomePageProps extends UserPermissionProps {
  activities: Home_activities_edges_node[];
  orders: number | null;
  loading: boolean;
  ordersToCapture: number | null;
  ordersToFulfill: number | null;
  productsOutOfStock: number;
  sales: Home_salesToday_gross;
  topProducts: Home_productTopToday_edges_node[] | null;
  userName: string;
  onCreateNewChannelClick: () => void;
  onOrdersToCaptureClick: () => void;
  onOrdersToFulfillClick: () => void;
  onProductClick: (productId: string, variantId: string) => void;
  onProductsOutOfStockClick: () => void;
  noChannel: boolean;
}

const HomePage: React.FC<HomePageProps> = props => {
  const {
    orders,
    sales,
    topProducts,
    onProductClick,
    activities,
    noChannel,
    loading
  } = props;

  const {
    isDemoMode,
    isActiveSeller,
    isShowConnectMessage,
    connect,
    goToStripe,
    dismissConnectMessage
  } = useOnboarding();
  const classes = useStyles(props);
  return (
    <>
      {loading ? (
        <div className={classes.loader}>
          <Loader />
        </div>
      ) : (
        <IonContent data-test-id="commerce-home-tab">
          <div style={{ height: "44px" }} />
          {isDemoMode && (
            <div className={classes.onboarding}>
              <SVG src={ConnectImage} />
              <IonText className={classes.onboardingHeader}>
                Start selling
              </IonText>
              <IonText className={classes.onboardingMessage}>
                Connect your account with Stripe to start accepting payments.
              </IonText>
              <IonButton
                shape="round"
                className={classes.onboardingButton}
                onClick={connect}
              >
                Connect to Stripe
              </IonButton>
            </div>
          )}
          {isShowConnectMessage && (
            <div className={classes.onboarding}>
              <SVG src={DoneImage} />
              <IonText className={classes.onboardingHeader}>
                Stripe connected
              </IonText>
              <IonText className={classes.onboardingMessage}>
                You can now publish pages with products.
              </IonText>
              <IonButton
                shape="round"
                fill="outline"
                className={classes.onboardingButton}
                onClick={dismissConnectMessage}
              >
                Got it
              </IonButton>
            </div>
          )}
          {!isActiveSeller && (
            <div className={classes.onboarding}>
              <SVG src={AlertImage} />
              <IonText className={classes.onboardingHeader}>
                Action required
              </IonText>
              <IonText className={classes.onboardingMessage}>
                Stripe needs an additional verification to enable your payments.
              </IonText>
              <IonButton
                shape="round"
                className={classes.onboardingButton}
                onClick={goToStripe}
              >
                Visit Stripe
              </IonButton>
            </div>
          )}
          <div className={classes.cardContainer}>
            <IonCard style={{ margin: 0, marginInline: 0 }}>
              <HomeAnalyticsCard
                title={"Sales"}
                testId="sales-analytics"
                icon={
                  <Sales
                    className={classes.icon}
                    fontSize={"inherit"}
                    viewBox="0 0 64 64"
                  />
                }
              >
                {noChannel ? (
                  0
                ) : sales ? (
                  <span>{`${sales?.currency === "USD" && "$"}${
                    sales?.amount
                  }`}</span>
                ) : (
                  <Skeleton style={{ width: "5em" }} />
                )}
              </HomeAnalyticsCard>
            </IonCard>
            <IonCard style={{ margin: 0, marginInline: 0 }}>
              <HomeAnalyticsCard
                title={"Orders"}
                testId="orders-analytics"
                icon={
                  <Orders
                    className={classes.icon}
                    fontSize={"inherit"}
                    viewBox="0 0 64 64"
                  />
                }
              >
                {noChannel ? (
                  0
                ) : orders !== undefined ? (
                  orders
                ) : (
                  <Skeleton style={{ width: "5em" }} />
                )}
              </HomeAnalyticsCard>
            </IonCard>
          </div>

          <CardSpacer />
          <IonCard>
            {topProducts && (
              <>
                <HomeProductListCard
                  testId="top-products"
                  onRowClick={onProductClick}
                  topProducts={topProducts}
                />
                <CardSpacer />
              </>
            )}
          </IonCard>
          <IonCard>
            {activities && (
              <div>
                <>
                  <HomeActivityCard
                    activities={activities}
                    testId="activity-card"
                  />
                </>
              </div>
            )}
          </IonCard>
          <div style={{ height: "300px" }} />
        </IonContent>
      )}
    </>
  );
};
HomePage.displayName = "HomePage";
export default memo(HomePage);
