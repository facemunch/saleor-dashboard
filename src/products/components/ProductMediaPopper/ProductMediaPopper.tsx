import {
  ClickAwayListener,
  Grow,
  MenuItem,
  MenuList as Menu,
  Paper,
  Popper
} from "@mui/material";
import React from "react";
import { defineMessages, useIntl } from "react-intl";

interface ProductMediaPopperProps {
  anchorRef: HTMLIonButtonElement;
  imagesUploadRef: HTMLInputElement;
  openMediaUrlModal: () => void;
  popperStatus: boolean;
  setPopperStatus: (popperStatus: boolean) => void;
}

const messages = defineMessages({
  uploadImages: {
    defaultMessage: "Upload Images",
    description: "modal button images upload"
  },
  uploadUrl: {
    defaultMessage: "Upload URL",
    description: "modal button url upload"
  }
});

export const ProductMediaPopper = ({
  anchorRef,
  imagesUploadRef,
  setPopperStatus,
  popperStatus
}: ProductMediaPopperProps) => {
  const intl = useIntl();

  return (
    <Popper
      open={popperStatus}
      anchorEl={anchorRef}
      transition
      placement="bottom-end"
    >
      {({ TransitionProps }) => (
        <Grow {...TransitionProps}>
          <Paper>
            <ClickAwayListener
              onClickAway={() => setPopperStatus(false)}
              mouseEvent="onClick"
            >
              <Menu>
                <MenuItem
                  onClick={() => imagesUploadRef.click()}
                  data-test="uploadImages"
                  key="upload-images"
                >
                  {intl.formatMessage(messages.uploadImages)}
                </MenuItem>
              </Menu>
            </ClickAwayListener>
          </Paper>
        </Grow>
      )}
    </Popper>
  );
};
