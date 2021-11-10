import { TableCell, TableRow } from "@mui/material";
import Skeleton from "@saleor/components/Skeleton";
import React from "react";

import { useStyles } from "../../styles";

export const AppsSkeleton = () => {
  const classes = useStyles({});

  return (
    <TableRow className={classes.tableRow}>
      <TableCell className={classes.colName}>
        <Skeleton />
      </TableCell>
    </TableRow>
  );
};

AppsSkeleton.displayName = "AppsSkeleton";
export default AppsSkeleton;
