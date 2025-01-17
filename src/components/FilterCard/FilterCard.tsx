import { Card, CardContent, CardHeader, IconButton } from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import React from "react";
import { useIntl } from "react-intl";

export interface FilterCardProps {
  handleClear();
}

const FilterCard: React.FC<FilterCardProps> = ({ children, handleClear }) => {
  const intl = useIntl();

  return (
    <Card>
      <form>
        <CardHeader
          action={
            <IconButton onClick={handleClear}>
              <RefreshIcon />
            </IconButton>
          }
          title={intl.formatMessage({
            defaultMessage: "Filters"
          })}
        />
        <CardContent>{children}</CardContent>
      </form>
    </Card>
  );
};
FilterCard.displayName = "FilterCard";
export default FilterCard;
