import { TextField } from "@mui/material";
import { FieldType } from "@saleor/components/Filter";
import Arrow from "@saleor/components/Filter/Arrow";
import React from "react";
import { FormattedMessage } from "react-intl";

import {
  FilterFieldBaseProps,
  filterTestingContext,
  useCommonStyles
} from "./utils";

type FilterNumericFieldProps = FilterFieldBaseProps<string> & {
  currencySymbol: string | undefined;
};

export const FilterNumericField: React.FC<FilterNumericFieldProps> = ({
  filter,
  onFilterPropertyChange,
  currencySymbol
}) => {
  const classes = useCommonStyles({});
  const isMultiple = filter.multiple;

  const handleChange = (value: string[]) =>
    onFilterPropertyChange({
      payload: {
        name: filter.name,
        update: {
          value
        }
      },
      type: "set-property"
    });

  return (
    <>
      <div className={classes.inputRange}>
        <div>
          <Arrow className={classes.arrow} />
        </div>
        <TextField
          {...(isMultiple && { "data-test-range-type": "min" })}
          data-test={filterTestingContext}
          data-test-id={filter.name}
          fullWidth
          name={filter.name + (isMultiple ? "_min" : "")}
          InputProps={{
            classes: {
              input: classes.input
            },
            type: "number",
            endAdornment: filter.type === FieldType.price && currencySymbol
          }}
          value={filter.value[0]}
          onChange={({ target: { value } }) =>
            handleChange(isMultiple ? [value, filter.value[1]] : [value])
          }
        />
      </div>
      {filter.multiple && (
        <>
          <div className={classes.inputRange}>
            <div className={classes.spacer} />
            <span className={classes.andLabel}>
              <FormattedMessage
                defaultMessage="and"
                description="filter range separator"
              />
            </span>
          </div>
          <div className={classes.inputRange}>
            <div className={classes.spacer} />
            <TextField
              data-test={filterTestingContext}
              data-test-id={filter.name}
              data-test-range-type="max"
              fullWidth
              name={filter.name + "_max"}
              InputProps={{
                classes: {
                  input: classes.input
                },
                type: "number",
                endAdornment: filter.type === FieldType.price && currencySymbol
              }}
              value={filter.value[1]}
              onChange={event =>
                handleChange([filter.value[0], event.target.value])
              }
            />
          </div>
        </>
      )}
    </>
  );
};
