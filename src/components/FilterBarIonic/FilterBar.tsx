import { Button } from "@mui/material";
import { makeStyles } from "@saleor/macaw-ui";
import React, { useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import useNavigator from "@saleor/hooks/useNavigator";
import { closeOutline, checkmarkOutline } from "ionicons/icons";
import { FilterProps } from "../../types";
import Filter from "../Filter";
import { FilterErrorMessages, IFilter } from "../Filter/types";
import { SearchBarProps } from "../SearchBar";
import SearchInput from "../SearchBar/SearchInput";
import FilterTabs, { FilterTab } from "../TableFilter";
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonIcon,
  IonButton,
  IonModal,
  IonList,
  IonItem,
  IonBadge
} from "@ionic/react";
import { repeatOutline } from "ionicons/icons";
import { useLocation } from "react-router-dom";

export interface FilterBarProps<TKeys extends string = string>
  extends FilterProps<TKeys>,
    SearchBarProps {
  errorMessages?: FilterErrorMessages<TKeys>;
  filterStructure: IFilter<TKeys>;
}

const useStyles = makeStyles(
  theme => ({
    root: {
      borderBottom: `1px solid rgba(255, 255, 255, 0.06)`,
      display: "flex",
      flexWrap: "wrap",
      padding: theme.spacing(2)
    },
    tabActionButton: {
      marginLeft: theme.spacing(2),
      paddingLeft: theme.spacing(4),
      paddingRight: theme.spacing(2),
      width: "auto"
    }
  }),
  {
    name: "FilterBar"
  }
);

const labelStyle = {
  fontFamily: "Inter",
  fontStyle: "normal",
  fontWeight: "400",
  fontSize: "14px",
  lineHeight: "20px",
  display: "flex",
  alignItems: "center",
  color: "#FFFFFF"
};

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

const badgeStyle = {
  background: "#9275fc",
  width: "8px",
  height: "8px",
  borderRadius: "50%",
  position: "absolute",
  top: "0",
  right: "-4px"
};

const options = [
  { label: "Product name A-Z", path: "?asc=true&sort=name" },
  { label: "Product name Z-A", path: "?asc=false&sort=name" },
  { label: "Price (lowest first)", path: "?asc=true&sort=price" },
  { label: "Price (highest first)", path: "?asc=false&sort=price" }
];

const FilterBar: React.FC<FilterBarProps> = props => {
  const {
    allTabLabel,
    currencySymbol,
    filterStructure,
    currentTab,
    initialSearch,
    searchPlaceholder,
    tabs,
    onAll,
    onSearchChange,
    onFilterChange,
    onFilterAttributeFocus,
    onTabChange,
    onTabDelete,
    onTabSave,
    errorMessages,
    options = options
  } = props;
  const navigate = useNavigator();
  const { search } = useLocation();

  const classes = useStyles(props);
  const intl = useIntl();
  const [showModal, setShowModal] = useState(false);
  const isCustom = currentTab === tabs.length + 1;
  const displayTabAction = isCustom
    ? "save"
    : currentTab === 0
    ? null
    : "delete";
  return (
    <>
      <div className={classes.root}>
        <Filter
          errorMessages={errorMessages}
          menu={filterStructure}
          currencySymbol={currencySymbol}
          onFilterAdd={onFilterChange}
          onFilterAttributeFocus={onFilterAttributeFocus}
        />
        <SearchInput
          initialSearch={initialSearch}
          placeholder={searchPlaceholder}
          onSearchChange={onSearchChange}
        />
        <IonButton
          size="small"
          fill="clear"
          style={{ marginTop: "16px", overflow: "visible" }}
          color="dark"
          onClick={() => {
            setShowModal(true);
          }}
        >
          {search.length > 0 && <span style={badgeStyle}></span>}
          <IonIcon
            slot="icon-only"
            style={{ transform: "rotate(90deg)" }}
            icon={repeatOutline}
          />
        </IonButton>

        {/* {displayTabAction &&
          (displayTabAction === "save" ? (
            <Button
              className={classes.tabActionButton}
              color="primary"
              onClick={onTabSave}
            >
              <FormattedMessage
                defaultMessage="Save Search"
                description="button"
              />
            </Button>
          ) : (
            displayTabAction === "delete" && (
              <Button
                className={classes.tabActionButton}
                color="primary"
                onClick={onTabDelete}
              >
                <FormattedMessage
                  defaultMessage="Delete Search"
                  description="button"
                />
              </Button>
            )
          ))} */}
      </div>
      <IonModal
        swipeToClose={false}
        showBackdrop={false}
        onDidDismiss={() => {
          setShowModal(false);
        }}
        style={{
          "--background": "#262626"
        }}
        isOpen={showModal}
        canDismiss={true}
        initialBreakpoint={0.37}
      >
        <>
          <span style={spanStyle}>Sort by</span>

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
              setShowModal(false);
            }}
          >
            <IonIcon slot="icon-only" color="dark" icon={closeOutline} />
          </IonButton>
        </>
        <IonContent>
          <IonList
            style={{
              height: "33vh",
              overflow: "scroll"
            }}
            // className="default-panel-bg"
          >
            {options.map(opt => (
              <IonItem
                key={opt.path}
                onClick={() => {
                  navigate(opt.path);
                  setShowModal(false);
                }}
                className="default-panel-bg"
              >
                <IonLabel style={labelStyle}>{opt.label}</IonLabel>
                {(search.length === 0 || search.includes(opt.path)) && (
                  <IonIcon color="primary" icon={checkmarkOutline} slot="end" />
                )}
              </IonItem>
            ))}
          </IonList>
        </IonContent>
      </IonModal>
    </>
  );
};

FilterBar.displayName = "FilterBar";
export default FilterBar;
