import { Button, alpha } from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { makeStyles } from "@saleor/macaw-ui";
import classNames from "classnames";
import React from "react";
import { FormattedMessage } from "react-intl";

interface ColumnPickerButtonProps {
  active: boolean;
  className?: string;
  onClick: () => void;
}

const useStyles = makeStyles(
  theme => ({
    icon: {
      marginLeft: theme.spacing(2),
      transition: theme.transitions.duration.short + "ms"
    },
    root: {
      "& span": {
        color: theme.palette.primary.main
      },
      paddingRight: theme.spacing(1)
    },
    rootActive: {
      background: alpha(theme.palette.primary.main, 0.1)
    },
    rotate: {
      transform: "rotate(180deg)"
    }
  }),
  {
    name: "ColumnPickerButton"
  }
);

const ColumnPickerButton: React.FC<ColumnPickerButtonProps> = props => {
  const { active, className, onClick } = props;
  const classes = useStyles(props);

  return (
    <Button
      className={classNames(classes.root, className, {
        [classes.rootActive]: active
      })}
      color="primary"
      onClick={onClick}
      variant="outlined"
    >
      <FormattedMessage
        defaultMessage="Columns"
        description="select visible columns button"
      />
      <ArrowDropDownIcon
        color="primary"
        className={classNames(classes.icon, {
          [classes.rotate]: active
        })}
      />
    </Button>
  );
};

export default ColumnPickerButton;
