import { IonButton, IonToolbar, IonIcon, IonModal, IonCardContent } from "@ionic/react";
import AddressEdit from "@saleor/components/AddressEdit";
import ConfirmButton, {
  ConfirmButtonTransitionState
} from "@saleor/components/ConfirmButton";
import { closeOutline } from "ionicons/icons";

import Form from "@saleor/components/Form";
import { ShopInfo_shop_countries } from "@saleor/components/Shop/types/ShopInfo";
import { AddressTypeInput } from "@saleor/customers/types";
import { OrderErrorFragment } from "@saleor/fragments/types/OrderErrorFragment";
import useAddressValidation from "@saleor/hooks/useAddressValidation";
import useModalDialogErrors from "@saleor/hooks/useModalDialogErrors";
import useStateFromProps from "@saleor/hooks/useStateFromProps";
import { buttonMessages } from "@saleor/intl";
import { AddressInput } from "@saleor/types/globalTypes";
import createSingleAutocompleteSelectHandler from "@saleor/utils/handlers/singleAutocompleteSelectChangeHandler";
import { mapCountriesToChoices } from "@saleor/utils/maps";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";



interface OrderAddressEditDialogProps {
  confirmButtonState: ConfirmButtonTransitionState;
  address: AddressTypeInput;
  open: boolean;
  errors: OrderErrorFragment[];
  variant: "billing" | "shipping" | string;
  countries?: ShopInfo_shop_countries[];
  onClose();
  onConfirm(data: AddressInput);
}

const spanStyle = {
  width: "100%",
  display: "block",
  position: "relative",
  top: "-2px",
  marginTop: "12px",
  fontFamily: "Inter",
  fontStyle: "normal",
  fontWeight: "600",
  fontSize: "14px",
  lineHeight: "20px",
  textAlign: "center",
  color: "#ffffff"
};

const OrderAddressEditDialog: React.FC<OrderAddressEditDialogProps> = props => {
  const {
    address,
    confirmButtonState,
    open,
    errors = [],
    variant,
    countries = [],
    onClose,
    onConfirm
  } = props;

  const intl = useIntl();
  const [countryDisplayName, setCountryDisplayName] = useStateFromProps(
    countries.find(country => address?.country === country.code)?.country
  );
  const {
    errors: validationErrors,
    submit: handleSubmit
  } = useAddressValidation(onConfirm);
  const dialogErrors = useModalDialogErrors(
    [...errors, ...validationErrors],
    open
  );

  const countryChoices = mapCountriesToChoices(countries);

  return (
    <IonModal
      style={{
        "--border-radius": "16px 16px 0px 0px"
      }}
      mode="ios"
      backdropDismiss={true}
      isOpen={open}
      onWillDismiss={() => onClose()}
      initialBreakpoint={0.95}
      handle={false}
      backdropBreakpoint={0.95}
    >

      <>
        <span style={spanStyle}>
          {variant === "billing"
            ? intl.formatMessage({
                defaultMessage: "Edit Billing Address",
                description: "dialog header"
              })
            : intl.formatMessage({
                defaultMessage: "Edit Shipping Address",
                description: "dialog header"
              })}
        </span>

        <IonButton
          data-test={"close-modal"}
          size="small"
          style={{
            position: "absolute",
            right: "0",
            top: "4px"
          }}
          fill="clear"
          onClick={() => {
            onClose();
          }}
        >
          <IonIcon slot="icon-only" color="dark" icon={closeOutline} />
        </IonButton>
      </>
      <IonCardContent>
        <Form
          initial={address}
          onSubmit={e => {
            handleSubmit(e);
          }}
        >
          {({ change, data }) => {
            const handleCountrySelect = createSingleAutocompleteSelectHandler(
              change,
              setCountryDisplayName,
              countryChoices
            );

            return (
              <>
                <AddressEdit
                  countries={countryChoices}
                  countryDisplayValue={countryDisplayName}
                  data={data}
                  errors={dialogErrors}
                  onChange={change}
                  onCountryChange={handleCountrySelect}
                />
                <IonToolbar
                  style={{
                    position: "fixed",
                    bottom: "66px",
                    width: "100vw",
                    left: "0"
                  }}
                  slot="fixed"
                >
                  <IonButton fill="outline" slot="start" onClick={onClose}>
                    <FormattedMessage {...buttonMessages.back} />
                  </IonButton>
                  <ConfirmButton
                    slot="end"
                    data-test-id="order-address-edit-dialog-confirm-button"
                    transitionState={confirmButtonState}
                    color="primary"
                    variant="contained"
                    type="submit"
                  >
                    <FormattedMessage {...buttonMessages.confirm} />
                  </ConfirmButton>
                </IonToolbar>
              </>
            );
          }}
        </Form>
      </IonCardContent>
    </IonModal>
  );
};

OrderAddressEditDialog.displayName = "OrderAddressEditDialog";
export default OrderAddressEditDialog;
