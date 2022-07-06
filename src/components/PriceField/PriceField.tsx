import { InputAdornment, TextField, InputProps } from "@mui/material";
import { makeStyles } from "@saleor/macaw-ui";
import React from "react";
import { FormattedMessage } from "react-intl";

const useStyles = makeStyles(
  theme => ({
    currencySymbol: {
      fontSize: "0.875rem"
    },
    inputContainer: {
      display: "grid",
      gridTemplateColumns: "1fr 2rem 1fr"
    },
    pullDown: {
      marginTop: theme.spacing(2)
    },
    separator: {
      marginTop: theme.spacing(3),
      textAlign: "center",
      width: "100%"
    },
    widgetContainer: {
      marginTop: theme.spacing(2)
    }
  }),
  { name: "PriceField" }
);

interface PriceFieldProps {
  className?: string;
  currencySymbol?: string;
  disabled?: boolean;
  error?: boolean;
  hint?: string;
  label?: string;
  name?: string;
  value?: string | number;
  InputProps?: InputProps;
  inputProps?: InputProps["inputProps"];
  required?: boolean;
  onChange(event: any);
}

export const PriceField: React.FC<PriceFieldProps> = props => {
  const {
    className,
    disabled,
    error,
    label,
    hint = "",
    currencySymbol,
    name,
    onChange,
    required,
    value,
    InputProps,
    inputProps
  } = props;

  const classes = useStyles(props);
  const minValue = 1;
  return (
    <TextField
      className={className}
      error={error || Boolean(value && value < minValue)}
      helperText={
        hint ? (
          hint
        ) : value?.length > 0 && value < minValue ? (
          <FormattedMessage defaultMessage="Price cannot be lower than 1" />
        ) : (
          ""
        )
      }
      label={label}
      fullWidth
      value={value}
      InputProps={{
        ...InputProps,
        endAdornment: currencySymbol ? (
          <InputAdornment position="end" className={classes.currencySymbol}>
            {currencySymbol}
          </InputAdornment>
        ) : (
          <span />
        ),
        inputProps: {
          min: 0,
          ...InputProps?.inputProps,
          "data-test-id": "price-input-field"
        },
        type: "number"
      }}
      inputProps={{
        min: minValue,
        type: "number",
        ...inputProps
      }}
      name={name}
      disabled={disabled}
      required={required}
      onChange={onChange}
    />
  );
};
PriceField.defaultProps = {
  name: "price"
};

PriceField.displayName = "PriceField";
export default PriceField;
