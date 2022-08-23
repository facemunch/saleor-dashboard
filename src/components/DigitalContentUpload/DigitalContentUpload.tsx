import { Typography, alpha } from "@mui/material";
import { makeStyles } from "@saleor/macaw-ui";
import classNames from "classnames";
import React from "react";
import { FormattedMessage } from "react-intl";
import Dropzone from "../Dropzone";

interface DigitalContentUploadProps {
  children?: (props: { isDragActive: boolean }) => React.ReactNode;
  className?: string;
  disableClick?: boolean;
  isActiveClassName?: string;
  iconContainerClassName?: string;
  iconContainerActiveClassName?: string;
  hideUploadIcon?: boolean;
  uploading?: boolean;
  onDigitalContentUpload: (file: FileList) => void;
}

const useStyles = makeStyles(
  theme => ({
    backdrop: {
      background: alpha(theme.palette.primary.main, 0.1),
      color: theme.palette.primary.main
    },
    fileField: {
      display: "none"
    },
    imageContainer: {
      background: "#ffffff",
      border: "1px solid #eaeaea",
      borderRadius: theme.spacing(),
      height: 148,
      justifySelf: "start",
      overflow: "hidden",
      padding: theme.spacing(2),
      position: "relative",
      transition: theme.transitions.duration.standard + "s",
      width: 148
    },
    photosIcon: {
      height: "64px",
      margin: "0 auto",
      width: "64px"
    },
    photosIconContainer: {
      padding: theme.spacing(5, 0),
      textAlign: "center"
    },
    uploadText: {
      color: theme.typography.body1.color,
      fontSize: 12,
      fontWeight: 600,
      textTransform: "uppercase"
    }
  }),
  { name: "DigitalContentUpload" }
);

export const DigitalContentUpload: React.FC<DigitalContentUploadProps> = props => {
  const {
    children,
    className,
    disableClick,
    iconContainerActiveClassName,
    iconContainerClassName,
    isActiveClassName,
    hideUploadIcon,
    onDigitalContentUpload,
    uploading
  } = props;

  const classes = useStyles(props);
  return (
    <Dropzone disableClick={disableClick} onDrop={onDigitalContentUpload}>
      {({ isDragActive, getInputProps, getRootProps }) => (
        <>
          <div
            {...getRootProps()}
            className={classNames(className, classes.photosIconContainer, {
              [classes.backdrop]: isDragActive,
              [isActiveClassName]: isDragActive
            })}
          >
            {!hideUploadIcon && (
              <div
                className={classNames(iconContainerClassName, {
                  [iconContainerActiveClassName]: isDragActive
                })}
              >
                <input {...getInputProps()} className={classes.fileField} />
                <Typography className={classes.uploadText}>
                  {!uploading ? (
                    <FormattedMessage
                      defaultMessage={"Tap to upload file"}
                      description="upload file"
                    />
                  ) : (
                    <div className={"animate-pulse"}>
                      <FormattedMessage
                        defaultMessage={"Uploading"}
                        description="uploading file"
                      />
                    </div>
                  )}
                </Typography>
              </div>
            )}
          </div>
          {children && children({ isDragActive })}
        </>
      )}
    </Dropzone>
  );
};
DigitalContentUpload.displayName = "DigitalContentUpload";
export default DigitalContentUpload;
