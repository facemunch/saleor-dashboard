import { TableCell, TableRow, Typography } from "@mui/material";
import { trashOutline } from "ionicons/icons";

import CardTitle from "@saleor/components/CardTitle";
import Skeleton from "@saleor/components/Skeleton";
import { makeStyles } from "@saleor/macaw-ui";
import { renderCollection } from "@saleor/misc";
import { ShippingZone_shippingZone_shippingMethods_excludedProducts_edges_node } from "@saleor/shipping/types/ShippingZone";
import { ListActions, ListProps } from "@saleor/types";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import {
  IonButton,
  IonCard,
  IonIcon,
  IonImg,
  IonItem,
  IonLabel,
  IonList,
  IonThumbnail
} from "@ionic/react";

const useStyles = makeStyles(
  theme => ({
    colAction: {
      "&:last-child": {
        paddingRight: theme.spacing(3)
      },
      textAlign: "right",
      width: 100
    },
    colName: {
      width: "auto"
    },
    colProductName: {
      paddingLeft: 0
    },
    table: {
      tableLayout: "fixed"
    }
  }),
  { name: "ShippingMethodProducts" }
);

export interface ShippingMethodProductsProps
  extends Pick<ListProps, Exclude<keyof ListProps, "onRowClick">>,
    ListActions {
  products: ShippingZone_shippingZone_shippingMethods_excludedProducts_edges_node[];
  onProductAssign: () => void;
  onProductUnassign: (ids: string[]) => void;
}

const ShippingMethodProducts: React.FC<ShippingMethodProductsProps> = props => {
  const { products, onProductAssign, onProductUnassign } = props;

  const classes = useStyles(props);
  const intl = useIntl();

  return (
    <IonCard>
      <CardTitle
        title={intl.formatMessage({
          defaultMessage: "Excluded Products",
          description: "section header"
        })}
        toolbar={
          <IonButton
            size="small"
            color="primary"
            variant="text"
            onClick={onProductAssign}
          >
            <FormattedMessage
              defaultMessage="Assign products"
              description="button"
            />
          </IonButton>
        }
      />
      <IonList>
        {products?.length === 0 ? (
          <TableRow>
            <TableCell colSpan={5}>
              <FormattedMessage defaultMessage="No Products" />
            </TableCell>
          </TableRow>
        ) : (
          renderCollection(products, product => {
            return (
              <IonItem
                style={{ "--background": "#313131" }}
                key={product ? product.id : "skeleton"}
              >
                <IonThumbnail style={{ '--border-radius': "8px" }} slot="start">
                  <IonImg src={product?.thumbnail?.url} />
                </IonThumbnail>
                <IonLabel>
                  {" "}
                  {product?.name ? (
                    <Typography variant="body2">{product.name}</Typography>
                  ) : (
                    <Skeleton />
                  )}
                </IonLabel>

                <TableCell className={classes.colAction}>
                  <IonButton
                    slot="end"
                    fill="clear"
                    shape="round"
                    onClick={() => onProductUnassign([product.id])}
                  >
                    <IonIcon icon={trashOutline} slot="icon-only"></IonIcon>
                  </IonButton>
                </TableCell>
              </IonItem>
            );
          })
        )}
      </IonList>
    </IonCard>
  );
};
ShippingMethodProducts.displayName = "ShippingMethodProducts";
export default ShippingMethodProducts;
