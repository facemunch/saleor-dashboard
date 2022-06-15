import Container from "@saleor/components/Container";
import Grid from "@saleor/components/Grid";
import PageHeader from "@saleor/components/PageHeader";
import RequirePermissions from "@saleor/components/RequirePermissions";
import { ShippingZoneFragment } from "@saleor/fragments/types/ShippingZoneFragment";
import { sectionNames } from "@saleor/intl";
import { Backlink } from "@saleor/macaw-ui";
import { ListActions, PageListProps, UserPermissionProps } from "@saleor/types";
import { PermissionEnum, WeightUnitsEnum } from "@saleor/types/globalTypes";
import React from "react";
import { useIntl } from "react-intl";
import { IonContent, IonPage } from "@ionic/react";

import ShippingWeightUnitForm from "../ShippingWeightUnitForm";
import ShippingZonesList from "../ShippingZonesList";

export interface ShippingZonesListPageProps
  extends PageListProps,
    ListActions,
    UserPermissionProps {
  defaultWeightUnit: WeightUnitsEnum;
  shippingZones: ShippingZoneFragment[];
  onBack: () => void;
  onRemove: (id: string) => void;
  onSubmit: (unit: WeightUnitsEnum) => void;
}

const ShippingZonesListPage: React.FC<ShippingZonesListPageProps> = ({
  defaultWeightUnit,
  disabled,
  userPermissions,
  onBack,
  onSubmit,
  ...listProps
}) => {
  const intl = useIntl();

  return (
    <>
      <IonContent data-test-id="shipping-zone-list">
        <PageHeader
          title={intl.formatMessage({
            defaultMessage: "Shipping",
            description: "header"
          })}
        />
        <Grid>
          <div>
            <ShippingZonesList disabled={disabled} {...listProps} />
          </div>
          <div>
            <RequirePermissions
              userPermissions={userPermissions}
              requiredPermissions={[PermissionEnum.MANAGE_SETTINGS]}
            >
              <ShippingWeightUnitForm
                defaultWeightUnit={defaultWeightUnit}
                disabled={disabled}
                onSubmit={onSubmit}
              />
            </RequirePermissions>
          </div>
        </Grid>
      </IonContent>
    </>
  );
};
ShippingZonesListPage.displayName = "ShippingZonesListPage";
export default ShippingZonesListPage;
