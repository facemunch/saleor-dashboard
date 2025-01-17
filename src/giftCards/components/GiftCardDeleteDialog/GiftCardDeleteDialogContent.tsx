import {
  CircularProgress,
  DialogContentText,
  Typography
} from "@mui/material";
import ActionDialog, {
  ActionDialogProps
} from "@saleor/components/ActionDialog";
import DeleteWarningDialogConsentContent from "@saleor/components/TypeDeleteWarningDialog/DeleteWarningDialogConsentContent";
import { UseGiftCardListProps } from "@saleor/giftCards/GiftCardsList/providers/GiftCardListProvider/hooks/useGiftCardList";
import { UseGiftCardListBulkActionsProps } from "@saleor/giftCards/GiftCardsList/providers/GiftCardListProvider/hooks/useGiftCardListBulkActions";
import { GiftCardDetailsConsumerProps } from "@saleor/giftCards/GiftCardUpdate/providers/GiftCardDetailsProvider";
import { getById } from "@saleor/orders/components/OrderReturnPage/utils";
import React, { useEffect, useState } from "react";
import { useIntl } from "react-intl";

import { giftCardDeleteDialogMessages as messages } from "./messages";
import { useGiftCardDeleteDialogContentStyles as useStyles } from "./styles";

export const SINGLE = 1;

export interface GiftCardDeleteDialogContentProps
  extends Pick<
      ActionDialogProps,
      "open" | "onClose" | "onConfirm" | "confirmButtonState"
    >,
    Partial<Pick<UseGiftCardListProps, "giftCards" | "loading">>,
    Partial<
      Pick<
        UseGiftCardListBulkActionsProps,
        "listElements" | "selectedItemsCount"
      >
    >,
    Partial<Pick<GiftCardDetailsConsumerProps, "giftCard">> {
  id?: string;
  singleDeletion: boolean;
}

const GiftCardDeleteDialogContent: React.FC<GiftCardDeleteDialogContentProps> = ({
  id,
  open,
  onClose,
  onConfirm,
  confirmButtonState,
  singleDeletion,
  selectedItemsCount: listSelectedItemsCount,
  listElements,
  giftCards,
  giftCard,
  loading
}) => {
  const intl = useIntl();
  const classes = useStyles({});

  const [isConsentChecked, setConsentChecked] = useState(false);

  const selectedItemsCount = listSelectedItemsCount || SINGLE;

  useEffect(() => {
    if (!open) {
      setConsentChecked(false);
    }
  }, [open]);

  const hasSelectedAnyGiftCardsWithBalance = () => {
    if (!giftCards) {
      return false;
    }

    return listElements?.some(hasSelectedGiftCardBalance);
  };

  const hasSelectedGiftCardBalance = (id: string) => {
    const card = giftCards?.find(getById(id)) || giftCard;

    return card?.currentBalance?.amount > 0;
  };

  const deletingCardsWithBalance = singleDeletion
    ? hasSelectedGiftCardBalance(id)
    : hasSelectedAnyGiftCardsWithBalance();

  const submitEnabled = deletingCardsWithBalance ? isConsentChecked : true;

  return (
    <ActionDialog
      open={open}
      onClose={onClose}
      variant="delete"
      title={intl.formatMessage(messages.title, { selectedItemsCount })}
      onConfirm={onConfirm}
      confirmButtonState={confirmButtonState}
      disabled={!submitEnabled}
    >
      {loading ? (
        <div className={classes.progressContainer}>
          <CircularProgress />
        </div>
      ) : deletingCardsWithBalance ? (
        <DeleteWarningDialogConsentContent
          isConsentChecked={isConsentChecked}
          onConsentChange={setConsentChecked}
          description={intl.formatMessage(messages.withBalanceDescription, {
            selectedItemsCount
          })}
          consentLabel={intl.formatMessage(messages.consentLabel, {
            selectedItemsCount
          })}
        />
      ) : (
        <DialogContentText>
          <Typography>
            {intl.formatMessage(messages.defaultDescription, {
              selectedItemsCount
            })}
          </Typography>
        </DialogContentText>
      )}
    </ActionDialog>
  );
};

export default GiftCardDeleteDialogContent;
