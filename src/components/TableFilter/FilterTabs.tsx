import { Tabs } from "@mui/material";
import { makeStyles } from "@saleor/macaw-ui";
import React from "react";

const useStyles = makeStyles(
  theme => ({
    tabsRoot: {
      borderBottom: `1px solid rgba(255, 255, 255, 0.06)`,
      paddingLeft: theme.spacing(1)
    },
    " .MuiTabs-indicator": {
      left: "0px",
      width: "15px",
      height: "7px",
      borderRadius: "5px 5px 0 0"
    }
  }),
  { name: "FilterTabs" }
);

interface FilterTabsProps {
  children?: React.ReactNode;
  currentTab: number;
}

export const FilterTabs: React.FC<FilterTabsProps> = props => {
  const { children, currentTab } = props;

  const classes = useStyles(props);

  return (
    <Tabs
      className={classes.tabsRoot}
      value={currentTab}
      indicatorColor={"primary"}
    >
      {children}
    </Tabs>
  );
};

export default FilterTabs;
