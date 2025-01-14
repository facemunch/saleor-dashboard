import { DialogContentText } from "@mui/material";
import ActionDialog from "@saleor/components/ActionDialog";
import { ConfirmButtonTransitionState } from "@saleor/components/ConfirmButton";
import React from "react";
import { useIntl } from "react-intl";

import { productVariantEndPreorderDialogMessages } from "./messages";

export interface ProductVariantEndPreorderDialogProps {
  confirmButtonState: ConfirmButtonTransitionState;
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  variantGlobalSoldUnits?: number;
}

const ProductVariantEndPreorderDialog: React.FC<ProductVariantEndPreorderDialogProps> = ({
  confirmButtonState,
  open,
  onClose,
  onConfirm,
  variantGlobalSoldUnits
}) => {
  const intl = useIntl();

  return (
    <ActionDialog
      confirmButtonLabel={intl.formatMessage(
        productVariantEndPreorderDialogMessages.dialogConfirmButtonLabel
      )}
      confirmButtonState={confirmButtonState}
      open={open}
      onClose={onClose}
      onConfirm={onConfirm}
      title={intl.formatMessage(
        productVariantEndPreorderDialogMessages.dialogTitle
      )}
      variant="default"
    >
      <DialogContentText>
        {intl.formatMessage(
          productVariantEndPreorderDialogMessages.dialogMessage,
          {
            variantGlobalSoldUnits
          }
        )}
      </DialogContentText>
    </ActionDialog>
  );
};
ProductVariantEndPreorderDialog.displayName = "ProductVariantEndPreorderDialog";
export default ProductVariantEndPreorderDialog;
