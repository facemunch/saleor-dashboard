import {
  IonModal,
  IonButton,
  IonIcon,
  IonContent,
  IonCheckbox,
  IonItem,
  IonLabel,
  IonSearchbar
} from "@ionic/react";
import { closeOutline } from "ionicons/icons";
import Savebar from "@saleor/components/Savebar";
import CountriesDefault from "./countriesDefault";
import { DialogContent, Typography } from "@mui/material";
import { ConfirmButtonTransitionState } from "@saleor/components/ConfirmButton";
import Form from "@saleor/components/Form";
import Hr from "@saleor/components/Hr";
import { ShopInfo_shop_countries } from "@saleor/components/Shop/types/ShopInfo";
import { makeStyles } from "@saleor/macaw-ui";
import { filter } from "fuzzaldrin";
import React, { RefObject } from "react";
import { FormattedMessage } from "react-intl";

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
interface FormData {
  countries: string[];
  query: string;
  restOfTheWorld: boolean;
}

export interface ShippingZoneCountriesAssignDialogProps {
  confirmButtonState: ConfirmButtonTransitionState;
  countries: ShopInfo_shop_countries[];
  initial: string[];
  isDefault: boolean;
  open: boolean;
  onClose: () => void;
  onConfirm: (data: FormData) => void;
  shippingCreateModalRef?: RefObject<HTMLIonModalElement>;
}

const useStyles = makeStyles(
  theme => ({
    checkboxCell: {
      paddingLeft: 0
    },
    heading: {
      marginBottom: theme.spacing(2),
      marginTop: theme.spacing(2)
    },
    container: {
      padding: theme.spacing(1.25, 0),
      opacity: 0.5
    },
    scrollAreaContainer: {
      maxHeight: "25vh",
      padding: theme.spacing(1.25, 0),
      marginBottom: theme.spacing(3)
    },
    table: {
      border: "1px solid " + theme.palette.grey[200]
    },
    wideCell: {
      width: "100%"
    }
  }),
  { name: "ShippingZoneCountriesAssignDialog" }
);
const ShippingZoneCountriesAssignDialog: React.FC<ShippingZoneCountriesAssignDialogProps> = props => {
  const {
    isDefault,
    onClose,
    countries,
    open,
    initial,
    onConfirm,
    shippingCreateModalRef
  } = props;
  const classes = useStyles(props);
  const initialForm: FormData = {
    countries: initial,
    query: "",
    restOfTheWorld: isDefault
  };
  return (
    <IonModal
      style={{
        "--border-radius": "16px"
      }}
      mode="ios"
      backdropDismiss={true}
      isOpen={open}
      presentingElement={shippingCreateModalRef?.current}
      canDismiss={true}
      onDidDismiss={() => {
        open && onClose();
      }}
    >
      <IonContent data-test-id="shipping-zone-countries-assign-view">
        <>
          <span style={spanStyle}>
            <FormattedMessage
              defaultMessage="Assign countries"
              description="dialog header"
            />
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
        <Form initial={initialForm} onSubmit={onConfirm}>
          {({ data, change }) => {
            const countrySelectionMap = countries.reduce((acc, country) => {
              acc[country.code] = !!data.countries.find(
                selectedCountries => selectedCountries === country.code
              );
              return acc;
            }, {});

            return (
              <>
                <DialogContent>
                  <Typography>
                    <FormattedMessage defaultMessage="Choose countries you want to add to shipping zone from list below" />
                  </Typography>
                  <IonSearchbar
                    name="query"
                    autoCorrect={"on"}
                    value={data.query}
                    onIonChange={event => {
                      change(event, () => fetch(data.query));
                    }}
                  />
                </DialogContent>

                <Hr />

                {/* <DialogContent className={classes.container}> */}
                <DialogContent className={classes.container}>
                  <Typography className={classes.heading} variant="subtitle1">
                    <FormattedMessage defaultMessage="Quick Pick" />
                  </Typography>
                </DialogContent>
                <IonItem>
                  <IonLabel className={classes.wideCell}>
                    <FormattedMessage defaultMessage="Rest of the World" />
                    <br />
                    <Typography variant="caption">
                      <FormattedMessage defaultMessage="If selected, this will add all of the countries not selected to other shipping zones" />
                    </Typography>
                  </IonLabel>

                  <IonCheckbox
                    checked={data.restOfTheWorld}
                    slot="end"
                    onIonChange={() =>
                      change({
                        target: {
                          name: "restOfTheWorld" as keyof FormData,
                          value: !data.restOfTheWorld
                        }
                      } as any)
                    }
                  />
                </IonItem>
            

                <DialogContent className={classes.container}>
                  <Typography className={classes.heading} variant="subtitle1">
                    <FormattedMessage
                      defaultMessage="Countries A to Z"
                      description="country selection"
                    />
                  </Typography>
                </DialogContent>

                {filter(
                  countries.length === 0 ? CountriesDefault : countries,
                  data.query,
                  {
                    key: "country"
                  }
                ).map(country => {
                  const isChecked = countrySelectionMap[country.code];

                  return (
                    <IonItem
                      data-test-id={`shipping-zone-countries-assign-${country.code}`}
                      key={country.code}
                    >
                      <IonLabel className={classes.wideCell}>
                        {country.country}
                      </IonLabel>

                      <IonCheckbox
                        checked={isChecked}
                        slot="end"
                        data-test-id={`shipping-zone-countries-assign-${country.code}-checkbox`}
                        onIonChange={() =>
                          isChecked
                            ? change({
                                target: {
                                  name: "countries" as keyof FormData,
                                  value: data.countries.filter(
                                    selectedCountries =>
                                      selectedCountries !== country.code
                                  )
                                }
                              } as any)
                            : change({
                                target: {
                                  name: "countries" as keyof FormData,
                                  value: [...data.countries, country.code]
                                }
                              } as any)
                        }
                      />
                    </IonItem>
                  );
                })}
                <div style={{ height: "100px" }} />
                <Savebar
                  disabled={false}
                  state={"success"}
                  onCancel={onClose}
                  onSubmit={() => onConfirm(data)}
                />
              </>
            );
          }}
        </Form>
      </IonContent>
    </IonModal>
  );
};
ShippingZoneCountriesAssignDialog.displayName =
  "ShippingZoneCountriesAssignDialog";
export default ShippingZoneCountriesAssignDialog;
