import { Button } from "@mui/material";
import { makeStyles } from "@saleor/macaw-ui";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { FilterProps } from "../../types";
import Filter from "../Filter";
import { FilterErrorMessages, IFilter } from "../Filter/types";
import { SearchBarProps } from "../SearchBar";
import SearchInput from "../SearchBar/SearchInput";
import FilterTabs, { FilterTab } from "../TableFilter";
import { useNode, useEditor } from "@craftjs/core";
import { getRandomId } from "@craftjs/utils";


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
    errorMessages
  } = props;

  const classes = useStyles(props);
  const intl = useIntl();

  const isCustom = currentTab === tabs.length + 1;
  const displayTabAction = isCustom
    ? "save"
    : currentTab === 0
    ? null
    : "delete";

  return (
    <>
      {/* <FilterTabs currentTab={currentTab}>
        <FilterTab label={allTabLabel} onClick={onAll} />
        {tabs.map((tab, tabIndex) => (
          <FilterTab
            onClick={() => onTabChange(tabIndex + 1)}
            label={tab}
            key={tabIndex}
          />
        ))}
        {isCustom && (
          <FilterTab
            onClick={() => undefined}
            label={intl.formatMessage({
              defaultMessage: "Custom Filter"
            })}
          />
        )}
      </FilterTabs> */}
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
    </>
  );
};
FilterBar.displayName = "FilterBar";
export default FilterBar;
