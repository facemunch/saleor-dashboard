import {
  CardContent,
  ClickAwayListener,
  Grow,
  IconButton,
  MenuItem,
  Paper,
  Popper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
  alpha
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  ChannelData,
  ChannelPriceAndPreorderArgs
} from "@saleor/channels/utils";
import CardTitle from "@saleor/components/CardTitle";
import Hr from "@saleor/components/Hr";
import { ProductErrorFragment } from "@saleor/fragments/types/ProductErrorFragment";
import { WarehouseFragment } from "@saleor/fragments/types/WarehouseFragment";
import { FormChange, FormErrors } from "@saleor/hooks/useForm";
import { FormsetAtomicData, FormsetChange } from "@saleor/hooks/useFormset";
import { makeStyles } from "@saleor/macaw-ui";
import { ICONBUTTON_SIZE } from "@saleor/macaw-ui";
import { renderCollection } from "@saleor/misc";
import { getFormErrors, getProductErrorMessage } from "@saleor/utils/errors";
import createNonNegativeValueChangeHandler from "@saleor/utils/handlers/nonNegativeValueChangeHandler";
import React, { useEffect } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { useLocation } from "react-router-dom";

import { ProductCreateData } from "../ProductCreatePage";
import { ProductUpdateSubmitData } from "../ProductUpdatePage/form";
import { ProductVariantCreateData } from "../ProductVariantCreatePage/form";
import { ProductVariantUpdateData } from "../ProductVariantPage/form";
import { IonCard } from "@ionic/react";
export interface ProductStockFormsetData {
  quantityAllocated: number;
}
export type ProductStockInput = FormsetAtomicData<
  ProductStockFormsetData,
  string
>;
export interface ProductStockFormData {
  sku: string;
  trackInventory: boolean;
  isPreorder: boolean;
  globalThreshold: string;
  globalSoldUnits: number;
  hasPreorderEndDate: boolean;
  preorderEndDateTime?: string;
}

export interface ProductStocksProps {
  productVariantChannelListings?: ChannelData[];
  data: ProductStockFormData;
  disabled: boolean;
  isDigitalProduct?: boolean;
  errors: ProductErrorFragment[];
  formErrors:
    | FormErrors<ProductVariantCreateData>
    | FormErrors<ProductVariantUpdateData>
    | FormErrors<ProductUpdateSubmitData>
    | FormErrors<ProductCreateData>;
  hasVariants: boolean;
  defaultInvetoryCount?: number;
  stocks: ProductStockInput[];
  warehouses: WarehouseFragment[];
  onVariantChannelListingChange?: (
    id: string,
    data: Partial<ChannelPriceAndPreorderArgs>
  ) => void;
  onChange: FormsetChange;
  onChangePreorderEndDate: FormChange;
  onFormDataChange: FormChange;
  onWarehouseStockAdd: (warehouseId: string) => void;
  onWarehouseStockDelete: (warehouseId: string) => void;
  onWarehouseConfigure: () => void;
}
const useStyles = makeStyles(
  theme => ({
    colAction: {
      padding: 0,
      width: `calc(${ICONBUTTON_SIZE}px + ${theme.spacing(1)})`
    },
    colName: {},
    colQuantity: {
      textAlign: "left",
      width: 180
    },
    colSoldUnits: {
      textAlign: "left",
      width: 150
    },
    colThreshold: {
      textAlign: "left",
      width: 180
    },
    editWarehouses: {
      marginRight: theme.spacing(-1)
    },
    input: {
      padding: theme.spacing(1.5),
      textAlign: "left"
    },
    menuItem: {
      "&:not(:last-of-type)": {
        marginBottom: theme.spacing(2)
      }
    },
    noWarehouseInfo: {
      marginTop: theme.spacing()
    },
    paper: {
      padding: theme.spacing(2)
    },
    popper: {
      boxShadow: `0px 5px 10px 0 ${alpha(theme.palette.common.black, 0.05)}`,
      marginTop: theme.spacing(1),
      zIndex: 2
    },
    quantityContainer: {
      paddingTop: theme.spacing()
    },
    quantityHeader: {
      alignItems: "center",
      display: "flex",
      justifyContent: "space-between"
    },
    skuInputContainer: {
      display: "grid",
      gridColumnGap: theme.spacing(3),
      gridTemplateColumns: "repeat(2, 1fr)"
    },
    dateTimeInputs: {
      marginTop: theme.spacing(2),
      marginBottom: theme.spacing(2)
    },
    preorderInfo: {
      marginBottom: theme.spacing(2),
      marginTop: theme.spacing(2),
      display: "block"
    },
    caption: {
      fontSize: 14
    },
    thresholdRow: {
      display: "grid",
      gridColumnGap: theme.spacing(3),
      gridTemplateColumns: "3fr 1fr",
      marginTop: theme.spacing(1)
    },
    thresholdInput: {
      maxWidth: 400
    },
    preorderItemsLeftCount: {
      fontSize: 14,
      paddingTop: theme.spacing(2),
      textAlign: "center"
    },
    preorderLimitInfo: {
      marginTop: theme.spacing(3)
    }
  }),
  {
    name: "ProductStocks"
  }
);

const ProductStocks: React.FC<ProductStocksProps> = ({
  data,
  disabled,
  errors,
  stocks,
  warehouses,
  onChange,
  onFormDataChange,
  onWarehouseStockAdd,
  onWarehouseStockDelete,
  defaultInvetoryCount = 1000000
}) => {
  const { search } = useLocation();
  const isDigitalProduct = search.includes("isDigitalProduct");
  const classes = useStyles({});
  const intl = useIntl();
  const anchor = React.useRef<HTMLDivElement>();
  const [isExpanded, setExpansionState] = React.useState(false);

  const warehousesToAssign =
    warehouses?.filter(
      warehouse => !stocks.some(stock => stock.id === warehouse.id)
    ) || [];
  const formErrors = getFormErrors(["sku"], errors);

  useEffect(() => {
    if (warehouses.length === 0) return;
    if (stocks.length === 1) {
      return;
    }
    const defaultWareHouse = warehouses.find(x => x.name === "Default");
    onWarehouseStockAdd(defaultWareHouse.id);
    onChange(defaultWareHouse.id, defaultInvetoryCount);
  }, [warehouses, stocks]);
  return (
    <IonCard>
      <CardTitle
        title={intl.formatMessage({
          defaultMessage: "Inventory",
          description: "product stock, section header",
          id: "productStockHeader"
        })}
      />
      <CardContent>
        <div className={classes.skuInputContainer}>
          <TextField
            disabled={disabled}
            error={!!formErrors.sku}
            fullWidth
            helperText={getProductErrorMessage(formErrors.sku, intl)}
            label={intl.formatMessage({
              defaultMessage: "SKU (Stock Keeping Unit)"
            })}
            name="sku"
            onChange={e => {
              onFormDataChange(e);
            }}
            value={data.sku || ""}
          />
        </div>
      </CardContent>
      <Hr />
      {!isDigitalProduct && warehouses?.length > 0 && !data.isPreorder && (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell className={classes.colQuantity}>
                <FormattedMessage
                  defaultMessage="Quantity"
                  description="table column header"
                  id="tableColQuantity"
                />
              </TableCell>
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {renderCollection(stocks, stock => {
              const handleQuantityChange = createNonNegativeValueChangeHandler(
                event => onChange(stock.id, event.target.value)
              );

              return (
                <TableRow key={stock.id}>
                  <TableCell className={classes.colQuantity}>
                    <TextField
                      disabled={disabled}
                      fullWidth
                      inputProps={{
                        className: classes.input,
                        min: 0,
                        type: "number"
                      }}
                      onChange={e => {
                        handleQuantityChange(e);
                      }}
                      value={stock.value}
                    />
                  </TableCell>
                  {/* <TableCell className={classes.colAction}>
                    <IconButton
                      color="primary"
                      onClick={() => onWarehouseStockDelete(stock.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell> */}
                </TableRow>
              );
            })}
            {warehousesToAssign.length > 0 && (
              <TableRow>
                <TableCell colSpan={3}>
                  <Typography variant="body2">
                    <FormattedMessage
                      defaultMessage="Assign Warehouse"
                      description="button"
                    />
                  </Typography>
                </TableCell>
                <TableCell className={classes.colAction}>
                  <ClickAwayListener
                    onClickAway={() => setExpansionState(false)}
                  >
                    <div ref={anchor}>
                      <IconButton
                        data-test-id="add-warehouse"
                        color="primary"
                        onClick={() => setExpansionState(!isExpanded)}
                      >
                        <AddIcon />
                      </IconButton>
                      <Popper
                        className={classes.popper}
                        open={isExpanded}
                        anchorEl={anchor.current}
                        transition
                        placement="top-end"
                      >
                        {({ TransitionProps }) => (
                          <Grow
                            {...TransitionProps}
                            style={{
                              transformOrigin: "right top"
                            }}
                          >
                            <Paper className={classes.paper}>
                              {warehousesToAssign.map(warehouse => (
                                <MenuItem
                                  className={classes.menuItem}
                                  onClick={() => {
                                    onWarehouseStockAdd(warehouse.id);
                                  }}
                                >
                                  {warehouse.name}
                                </MenuItem>
                              ))}
                            </Paper>
                          </Grow>
                        )}
                      </Popper>
                    </div>
                  </ClickAwayListener>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      )}
    </IonCard>
  );
};

ProductStocks.displayName = "ProductStocks";
export default ProductStocks;
