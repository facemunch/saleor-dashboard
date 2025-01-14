import { IonButtons } from "@ionic/react";
import { MenuItem, Select } from "@mui/material";
import { makeStyles } from "@saleor/macaw-ui";
import React from "react";
import { FormattedMessage } from "react-intl";

const useStyles = makeStyles(
  theme => ({
    label: {
      marginLeft: '22px',
      fontSize: 14
    },
    select: {
      "& div": {
        "&:focus": {
          background: "none"
        },
        color: theme.palette.primary.main,
        marginLeft: theme.spacing(1)
      },
      "& svg": {
        color: theme.palette.primary.main
      },
      "&:after, &:before, &:hover": {
        border: "none !important"
      }
    }
  }),
  {
    name: "RowNumberSelect"
  }
);

interface RowNumberSelectProps {
  choices: number[];
  className?: string;
  rowNumber: number;
  onChange(value: number);
}

const RowNumberSelect: React.FC<RowNumberSelectProps> = ({
  className,
  choices,
  rowNumber,
  onChange
}) => {
  const classes = useStyles({});

  return (
    <IonButtons slot="start" >
      <span className={classes.label}>
        <FormattedMessage defaultMessage="No of Rows:" />
      </span>
      <Select
        data-test-id="rowNumberSelect"
        className={classes.select}
        value={rowNumber}
        sx={{ ml: 1, " .MuiSelect-select": { p: 0 } }}
        onChange={event => onChange(event.target.value as number)}
      >
        {choices.length > 0 &&
          choices.map(choice => (
            <MenuItem
              value={choice}
              key={choice}
              data-test-id="rowNumberOption"
            >
              {choice}
            </MenuItem>
          ))}
      </Select>
    </IonButtons>
  );
};

export default RowNumberSelect;
