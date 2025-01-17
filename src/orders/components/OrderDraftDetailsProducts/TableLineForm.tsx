import { TextField } from "@mui/material";
import DebounceForm from "@saleor/components/DebounceForm";
import Form from "@saleor/components/Form";
import { makeStyles } from "@saleor/macaw-ui";
import { OrderDetails_order_lines } from "@saleor/orders/types/OrderDetails";
import createNonNegativeValueChangeHandler from "@saleor/utils/handlers/nonNegativeValueChangeHandler";
import React from "react";

const useStyles = makeStyles(
  () => ({
    quantityField: {
      "& input": {
        padding: "12px 12px 10px",
        textAlign: "right"
      },
      width: 100
    }
  }),
  { name: "TableLineForm" }
);

export interface FormData {
  quantity: number;
}

interface TableLineFormProps {
  line: OrderDetails_order_lines;
  onOrderLineChange: (id: string, data: FormData) => void;
}

const TableLineForm: React.FC<TableLineFormProps> = ({
  line,
  onOrderLineChange
}) => {
  const classes = useStyles({});
  const { id, quantity } = line;

  return (
    <Form initial={{ quantity }} onSubmit={data => onOrderLineChange(id, data)}>
      {({ change, data, hasChanged, submit }) => {
        const handleQuantityChange = createNonNegativeValueChangeHandler(
          change
        );

        return (
          <DebounceForm
            change={handleQuantityChange}
            submit={hasChanged ? submit : undefined}
            time={200}
          >
            {debounce => (
              <TextField
                className={classes.quantityField}
                fullWidth
                name="quantity"
                type="number"
                value={data.quantity}
                onChange={debounce}
                onBlur={submit}
                inputProps={{
                  min: 1
                }}
              />
            )}
          </DebounceForm>
        );
      }}
    </Form>
  );
};

export default TableLineForm;
