import { IconButton, TableCell } from "@mui/material";
import { ICONBUTTON_SIZE, makeStyles } from "@saleor/macaw-ui";
import classNames from "classnames";
import React from "react";

import { stopPropagation } from "../../misc";

export interface IconButtonTableCellProps {
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  onClick: () => void;
}

const useStyles = makeStyles(
  theme => ({
    root: {
      "&:last-child": {
        paddingRight: 0
      },
      paddingRight: 0,
      width: `calc(${ICONBUTTON_SIZE}px + ${theme.spacing(0.5)})`
    }
  }),
  { name: "IconButtonTableCell" }
);
const IconButtonTableCell: React.FC<IconButtonTableCellProps> = props => {
  const { children, className, disabled, onClick } = props;

  const classes = useStyles(props);

  return (
    <TableCell className={classNames(classes.root, className)}>
      <IconButton
        color="primary"
        disabled={disabled}
        onClick={stopPropagation(onClick)}
      >
        {children}
      </IconButton>
    </TableCell>
  );
};
IconButtonTableCell.displayName = "IconButtonTableCell";
export default IconButtonTableCell;
