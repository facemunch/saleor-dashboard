import {
  IonModal,
  IonButton,
  IonIcon,
  IonContent,
  IonFooter,
  IonToolbar,
  IonButtons
} from "@ionic/react";
import { closeOutline } from "ionicons/icons";

import {
  DialogContent,
  TableCell,
  TableRow,
  TextField,
  Typography
} from "@mui/material";
import Checkbox from "@saleor/components/Checkbox";
import ConfirmButton, {
  ConfirmButtonTransitionState
} from "@saleor/components/ConfirmButton";
import Form from "@saleor/components/Form";
import FormSpacer from "@saleor/components/FormSpacer";
import Hr from "@saleor/components/Hr";
import { ShopInfo_shop_countries } from "@saleor/components/Shop/types/ShopInfo";
import { buttonMessages } from "@saleor/intl";
import { makeStyles } from "@saleor/macaw-ui";
import { filter } from "fuzzaldrin";
import React, { useEffect } from "react";
import { FormattedMessage, useIntl } from "react-intl";

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
      padding: theme.spacing(1.25, 0)
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
    confirmButtonState,
    isDefault,
    onClose,
    countries,
    open,
    initial,
    onConfirm
  } = props;

  const classes = useStyles(props);
  const intl = useIntl();

  useEffect(() => {
    let footer = document.getElementById("action-bar-footer");
    if (open) {
      if (footer) {
        footer.style.display = "none";
      }
    } else {
      if (footer) {
        footer.style.display = "block";
      }
    }
    return () => {
      footer = null;
    };
  }, [open]);

  const initialForm: FormData = {
    countries: initial,
    query: "",
    restOfTheWorld: isDefault
  };
  return (
    <IonModal
      style={{ "--z-index": "1000000" }}
      isOpen={open}
      initialBreakpoint={0.91}
    >
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

      <IonContent data-test-id="shipping-zone-countries-assign-view">
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
                  <FormSpacer />
                  <TextField
                    name="query"
                    value={data.query}
                    onChange={event => change(event, () => fetch(data.query))}
                    label={intl.formatMessage({
                      defaultMessage: "Search Countries"
                    })}
                    placeholder={intl.formatMessage({
                      defaultMessage: "Search by country name"
                    })}
                    fullWidth
                  />
                </DialogContent>
                <Hr />

                <DialogContent className={classes.container}>
                  <Typography className={classes.heading} variant="subtitle1">
                    <FormattedMessage defaultMessage="Quick Pick" />
                  </Typography>

                  <TableCell className={classes.wideCell}>
                    <FormattedMessage defaultMessage="Rest of the World" />
                    <Typography variant="caption">
                      <FormattedMessage defaultMessage="If selected, this will add all of the countries not selected to other shipping zones" />
                    </Typography>
                  </TableCell>
                  <TableCell
                    padding="checkbox"
                    className={classes.checkboxCell}
                  >
                    <Checkbox
                      checked={data.restOfTheWorld}
                      onChange={() =>
                        change({
                          target: {
                            name: "restOfTheWorld" as keyof FormData,
                            value: !data.restOfTheWorld
                          }
                        } as any)
                      }
                    />
                  </TableCell>
                </DialogContent>

                <DialogContent className={classes.container}>
                  <Typography className={classes.heading} variant="subtitle1">
                    <FormattedMessage
                      defaultMessage="Countries A to Z"
                      description="country selection"
                    />
                  </Typography>
                </DialogContent>

                {filter(countries, data.query, {
                  key: "country"
                }).map(country => {
                  const isChecked = countrySelectionMap[country.code];

                  return (
                    <TableRow
                      data-test-id={`shipping-zone-countries-assign-${country.code}`}
                      key={country.code}
                    >
                      <TableCell className={classes.wideCell}>
                        {country.country}
                      </TableCell>
                      <TableCell
                        padding="checkbox"
                        className={classes.checkboxCell}
                      >
                        <Checkbox
                          checked={isChecked}
                          data-test-id={`shipping-zone-countries-assign-${country.code}-checkbox`}
                          onChange={() =>
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
                      </TableCell>
                    </TableRow>
                  );
                })}

                <IonFooter
                  style={{
                    top: "calc(91% - 50px)",
                    position: "fixed"
                  }}
                >
                  <IonToolbar>
                    <IonButtons slot="primary">
                      <IonButton
                        fill="clear"
                        data-test-id={`shipping-zone-countries-assign-clear-selection`}
                        onClick={onClose}
                      >
                        <FormattedMessage {...buttonMessages.back} />
                      </IonButton>

                      <ConfirmButton
                        transitionState={confirmButtonState}
                        color="primary"
                        variant="contained"
                        type="submit"
                        onClick={confirmButtonState}
                      >
                        <FormattedMessage
                          defaultMessage="Assign countries"
                          description="button"
                        />
                      </ConfirmButton>
                    </IonButtons>
                  </IonToolbar>
                </IonFooter>
              </>
            );
          }}
        </Form>
        {/* </DialogContent> */}
      </IonContent>
    </IonModal>
  );
};
ShippingZoneCountriesAssignDialog.displayName =
  "ShippingZoneCountriesAssignDialog";
export default ShippingZoneCountriesAssignDialog;
