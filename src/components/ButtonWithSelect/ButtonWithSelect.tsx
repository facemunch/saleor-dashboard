import {
  Button,
  ButtonGroup,
  ButtonGroupProps,
  ClickAwayListener,
  Grow,
  MenuItem,
  MenuList,
  Paper,
  Popper
} from "@mui/material";
import { ArrowDropDown as ArrowDropDownIcon } from "@mui/icons-material";
import React from "react";

import { useStyles } from "./styles";

interface Option {
  label: string;
  disabled?: boolean;
  onSelect(e: React.MouseEvent<HTMLLIElement, MouseEvent>): void;
}

export interface ButtonWithSelectProps
  extends Omit<ButtonGroupProps, "onClick"> {
  options: Option[];
  onClick(e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void;
}

export const ButtonWithSelect: React.FC<ButtonWithSelectProps> = ({
  options,
  children,
  onClick,
  ...props
}) => {
  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef<HTMLDivElement>(null);
  const classes = useStyles();

  const handleMenuItemClick = (
    event: React.MouseEvent<HTMLLIElement, MouseEvent>,
    onClick: (event: React.MouseEvent<HTMLLIElement, MouseEvent>) => void
  ) => {
    onClick(event);
    setOpen(false);
  };

  const handleToggle = () => {
    setOpen(prevOpen => !prevOpen);
  };

  const handleClose = (event: any) => {
    if (
      anchorRef.current &&
      anchorRef.current.contains(event.target as HTMLElement)
    ) {
      return;
    }

    setOpen(false);
  };

  return (
    <>
      <ButtonGroup
        variant="contained"
        color="primary"
        ref={anchorRef}
        aria-label="button with select"
        {...props}
      >
        <Button onClick={onClick}>{children}</Button>
        {options.length > 0 && (
          <Button
            color="primary"
            size="small"
            aria-controls={open ? "button-with-select-menu" : undefined}
            aria-expanded={open ? "true" : undefined}
            aria-label="select different option"
            aria-haspopup="menu"
            onClick={handleToggle}
          >
            <ArrowDropDownIcon className={classes.buttonIcon} />
          </Button>
        )}
      </ButtonGroup>
      <Popper
        open={open}
        anchorEl={anchorRef.current}
        transition
        disablePortal
        placement="bottom-end"
        className={classes.popper}
      >
        {({ TransitionProps }) => (
          <Grow {...TransitionProps}>
            <Paper className={classes.paper}>
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList id="button-with-select-menu">
                  {options.map((option, i) => (
                    <MenuItem
                      key={option.label + i}
                      disabled={option.disabled}
                      onClick={e => handleMenuItemClick(e, option.onSelect)}
                    >
                      {option.label}
                    </MenuItem>
                  ))}
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </>
  );
};
