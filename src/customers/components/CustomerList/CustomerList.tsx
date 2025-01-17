import {
  IonList,
  IonItem,
  IonNote,
  IonLabel,
  IonCardContent,
  IonRippleEffect
} from "@ionic/react";
import { Typography } from "@mui/material";
import Skeleton from "@saleor/components/Skeleton";
import { CustomerListUrlSortField } from "@saleor/customers/urls";
import { makeStyles } from "@saleor/macaw-ui";
import { getUserName, maybe } from "@saleor/misc";
import { ListActions, ListProps, SortPage } from "@saleor/types";
import { Loader } from "frontend/ui/loader";
import React from "react";
import { FormattedMessage } from "react-intl";
import { ListCustomers_customers_edges_node } from "../../types/ListCustomers";

const useStyles = makeStyles(
  theme => ({
    colEmail: {},
    colName: {
      paddingLeft: 0,
      textTransform: "capitalize"
    },
    colOrders: {
      color: "white",
      fontFamily: "Inter",
      fontStyle: "normal",
      fontWeight: "400",
      fontSize: "16px",
      lineHeight: "24px",
      display: "flex",
      alignItems: "flex-end",
      textAlign: "right"
    },
    tableRow: {
      cursor: "pointer"
    }
  }),
  { name: "CustomerList" }
);

export interface CustomerListProps
  extends ListProps,
    ListActions,
    SortPage<CustomerListUrlSortField> {
  customers: ListCustomers_customers_edges_node[];
  loading?: boolean;
}

const CustomerList: React.FC<CustomerListProps> = props => {
  const { customers, onRowClick, loading } = props;

  const classes = useStyles(props);

  return (
    <IonList style={{ "--ion-item-background": "#313131" }}>
      <div>
        {loading && <Loader />}

        {!loading && customers &&
          customers.map(customer => {
            return (
              <IonItem
                button
                detail={false}
                className={!!customer ? classes.tableRow : undefined}
                key={customer ? customer.id : "skeleton"}
                onClick={customer ? onRowClick(customer.id) : undefined}
              >
                <IonRippleEffect></IonRippleEffect>

                <IonLabel className={classes.colName}>
                  {getUserName(customer)}
                  <br />
                  <Typography variant="caption">
                    {maybe<React.ReactNode>(() => customer.email, <Skeleton />)}
                  </Typography>
                </IonLabel>

                <IonNote className={classes.colOrders}>
                  {maybe<React.ReactNode>(
                    () => customer.orders.totalCount + " orders",
                    <Skeleton />
                  )}
                </IonNote>
              </IonItem>
            );
          })}

        {!loading && customers?.length === 0 && (
          <IonCardContent style={{ textAlign: "center" }}>
            <FormattedMessage defaultMessage="No customers found" />
          </IonCardContent>
        )}
      </div>
    </IonList>
  );
};
CustomerList.displayName = "CustomerList";
export default CustomerList;
