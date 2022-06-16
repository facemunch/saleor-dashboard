import CardSpacer from "@saleor/components/CardSpacer";
import Money from "@saleor/components/Money";
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
import { IonContent, IonCard } from "@ionic/react";
import { Loader } from "frontend/ui/loader";
const useStyles = makeStyles(
  theme => ({
    cardContainer: {
      display: "flex",
      top: '24px',
      position: 'relative',
    },
    icon: {
      "& path": {
        fill: theme.palette.primary.main
      }
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

  const classes = useStyles(props);
  return (
    <>
      <IonContent data-test-id="commerce-home-tab">
        <div style={{ height: "20px" }} />
        {loading && <Loader />}

        <div className={classes.cardContainer}>
          <IonCard>
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
                `${sales?.currency === "USD" && "$" } ${sales?.amount}`
              ) : (
                <Skeleton style={{ width: "5em" }} />
              )}
            </HomeAnalyticsCard>
          </IonCard>
          <IonCard>
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
        <div style={{ height: "100px" }} />
      </IonContent>
    </>
  );
};
HomePage.displayName = "HomePage";
export default memo(HomePage);
