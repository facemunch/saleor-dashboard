import CardMenu from "@saleor/components/CardMenu";
import CardSpacer from "@saleor/components/CardSpacer";
import { ConfirmButtonTransitionState } from "@saleor/components/ConfirmButton";
import { DateTime } from "@saleor/components/Date";
import Grid from "@saleor/components/Grid";
import PageHeader from "@saleor/components/PageHeader";
import Savebar from "@saleor/components/Savebar";
import Skeleton from "@saleor/components/Skeleton";
import { sectionNames } from "@saleor/intl";
import { Backlink } from "@saleor/macaw-ui";
import { makeStyles } from "@saleor/macaw-ui";
import { SearchCustomers_search_edges_node } from "@saleor/searches/types/SearchCustomers";
import { FetchMoreProps, UserPermissionProps } from "@saleor/types";
import React from "react";
import { useIntl } from "react-intl";
import { IonContent, IonPage, IonCardContent } from "@ionic/react";

import { OrderDetails_order } from "../../types/OrderDetails";
import OrderCustomer, { CustomerEditData } from "../OrderCustomer";
import OrderDraftDetails from "../OrderDraftDetails/OrderDraftDetails";
import { FormData as OrderDraftDetailsProductsFormData } from "../OrderDraftDetailsProducts";
import OrderHistory, { FormData as HistoryFormData } from "../OrderHistory";

const useStyles = makeStyles(
  theme => ({
    date: {
      marginBottom: theme.spacing(3)
    },
    header: {
      display: "flex",
      marginBottom: 0
    }
  }),
  { name: "OrderDraftPage" }
);

export interface OrderDraftPageProps
  extends FetchMoreProps,
    UserPermissionProps {
  disabled: boolean;
  order: OrderDetails_order;
  users: SearchCustomers_search_edges_node[];
  usersLoading: boolean;
  saveButtonBarState: ConfirmButtonTransitionState;
  fetchUsers: (query: string) => void;
  onBack: () => void;
  onBillingAddressEdit: () => void;
  onCustomerEdit: (data: CustomerEditData) => void;
  onDraftFinalize: () => void;
  onDraftRemove: () => void;
  onNoteAdd: (data: HistoryFormData) => void;
  onOrderLineAdd: () => void;
  onOrderLineChange: (
    id: string,
    data: OrderDraftDetailsProductsFormData
  ) => void;
  onOrderLineRemove: (id: string) => void;
  onProductClick: (id: string) => void;
  onShippingAddressEdit: () => void;
  onShippingMethodEdit: () => void;
  onProfileView: () => void;
}

const OrderDraftPage: React.FC<OrderDraftPageProps> = props => {
  const {
    disabled,
    fetchUsers,
    hasMore,
    saveButtonBarState,
    onBack,
    onBillingAddressEdit,
    onCustomerEdit,
    onDraftFinalize,
    onDraftRemove,
    onFetchMore,
    onNoteAdd,
    onOrderLineAdd,
    onOrderLineChange,
    onOrderLineRemove,
    onShippingAddressEdit,
    onShippingMethodEdit,
    onProfileView,
    order,
    users,
    usersLoading,
    userPermissions
  } = props;
  const classes = useStyles(props);

  const intl = useIntl();

  return (
    <IonPage>
      <IonContent>
        <IonCardContent>
          <Backlink onClick={onBack}>
            {intl.formatMessage(sectionNames.draftOrders)}
          </Backlink>
          <PageHeader
            className={classes.header}
            inline
            title={order?.number ? "#" + order?.number : undefined}
          >
            <CardMenu
              menuItems={[
                {
                  label: intl.formatMessage({
                    defaultMessage: "Cancel order",
                    description: "button"
                  }),
                  onSelect: onDraftRemove
                }
              ]}
            />
          </PageHeader>
          <div className={classes.date}>
            {order && order.created ? (
              <>
                <DateTime date={order.created} />
              </>
            ) : (
              <Skeleton style={{ width: "10em" }} />
            )}
          </div>
        </IonCardContent>
        <Grid>
          <div>
            <OrderDraftDetails
              order={order}
              onOrderLineAdd={onOrderLineAdd}
              onOrderLineChange={onOrderLineChange}
              onOrderLineRemove={onOrderLineRemove}
              onShippingMethodEdit={onShippingMethodEdit}
            />
            <OrderHistory
              history={order?.events}
              orderCurrency={order?.total?.gross.currency}
              onNoteAdd={onNoteAdd}
            />
          </div>
          <div>
            <OrderCustomer
              canEditAddresses={true}
              canEditCustomer={true}
              fetchUsers={fetchUsers}
              hasMore={hasMore}
              loading={usersLoading}
              order={order}
              users={users}
              userPermissions={userPermissions}
              onBillingAddressEdit={onBillingAddressEdit}
              onCustomerEdit={onCustomerEdit}
              onFetchMore={onFetchMore}
              onProfileView={onProfileView}
              onShippingAddressEdit={onShippingAddressEdit}
            />
            <CardSpacer />
            <div style={{ height: "100px" }}></div>
            {/* <DraftOrderChannelSectionCard channelName={order?.channel?.name} /> */}
          </div>
        </Grid>
        <Savebar
          state={saveButtonBarState}
          disabled={disabled || !order?.canFinalize}
          onCancel={onBack}
          onSubmit={onDraftFinalize}
          labels={{
            confirm: intl.formatMessage({
              defaultMessage: "Finalize",
              description: "button"
            })
          }}
        />
      </IonContent>
    </IonPage>
  );
};
OrderDraftPage.displayName = "OrderDraftPage";
export default OrderDraftPage;
