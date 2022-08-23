import { CardContent } from "@mui/material";
import CardTitle from "@saleor/components/CardTitle";
import ImageUpload from "@saleor/components/ImageUpload";
import MediaTile from "@saleor/components/MediaTile";
import { ProductMediaFragment } from "@saleor/fragments/types/ProductMediaFragment";
import { makeStyles } from "@saleor/macaw-ui";
import { ReorderAction } from "@saleor/types";
import { ProductMediaType } from "@saleor/types/globalTypes";
import createMultiFileUploadHandler from "@saleor/utils/handlers/multiFileUploadHandler";
import classNames from "classnames";
import React from "react";
import { defineMessages, useIntl } from "react-intl";
import { IonCard, IonButton } from "@ionic/react";
const messages = defineMessages({
  media: {
    defaultMessage: "Media",
    description: "section header"
  },
  upload: {
    defaultMessage: "Upload",
    description: "modal button upload"
  }
});

const useStyles = makeStyles(
  theme => ({
    card: {
      marginTop: theme.spacing(2),
      [theme.breakpoints.down("sm")]: {
        marginTop: 0
      }
    },
    fileField: {
      display: "none"
    },
    icon: {
      color: "rgba(255, 255, 255, 0.54)"
    },
    image: {
      height: "100%",
      objectFit: "contain",
      userSelect: "none",
      width: "100%"
    },
    imageContainer: {
      "&:hover, &.dragged": {
        "& $imageOverlay": {
          display: "block"
        }
      },
      background: "#ffffff",
      border: "1px solid #eaeaea",
      borderRadius: theme.spacing(),
      height: 140,
      margin: "auto",
      overflow: "hidden",
      padding: theme.spacing(2),
      position: "relative",
      width: 140
    },
    imageGridContainer: {
      position: "relative"
    },
    imageOverlay: {
      background: "rgba(0, 0, 0, 0.6)",
      cursor: "move",
      display: "none",
      height: 140,
      left: 0,
      padding: theme.spacing(2),
      position: "absolute",
      top: 0,
      width: 140
    },
    imageOverlayToolbar: {
      alignContent: "flex-end",
      display: "flex",
      position: "relative",
      right: theme.spacing(-3),
      top: theme.spacing(-2)
    },
    imageUpload: {
      height: "100%",
      left: 0,
      outline: 0,
      position: "absolute",
      top: 0,
      width: "100%"
    },
    imageUploadActive: {
      zIndex: 1
    },
    imageUploadIconActive: {
      display: "block"
    },
    root: {
      display: "grid",
      gridColumnGap: theme.spacing(2),
      gridRowGap: theme.spacing(2),
      gridTemplateColumns: "repeat(4, 1fr)",
      [theme.breakpoints.down("sm")]: {
        gridTemplateColumns: "repeat(2, 1fr)"
      },
      [theme.breakpoints.down("xs")]: {
        gridTemplateColumns: "repeat(2, 1fr)"
      }
    },
    rootDragActive: {
      opacity: 0.2
    }
  }),
  { name: "ProductMedia" }
);

const SortableMedia = ({ media, onEdit, onDelete }) => (
  <MediaTile
    media={media}
    onEdit={onEdit ? () => onEdit(media.id) : undefined}
    onDelete={onDelete}
  />
);

const MediaListContainer = ({ media, preview, onDelete, onEdit, ...props }) => (
  <div {...props}>
    {media.map((mediaObj, index) => (
      <SortableMedia
        key={`item-${index}`}
        index={index}
        media={mediaObj}
        onEdit={onEdit ? onEdit(mediaObj.id) : null}
        onDelete={onDelete(mediaObj.id)}
      />
    ))}
  </div>
);

interface ProductMediaProps {
  placeholderImage?: string;
  media: ProductMediaFragment[];
  loading?: boolean;
  onImageDelete: (id: string) => () => void;
  onImageEdit: (id: string) => () => void;
  onImageReorder?: ReorderAction;
  onImageUpload(file: File);
  openMediaUrlModal();
}

const ProductMedia: React.FC<ProductMediaProps> = props => {
  const {
    media,
    placeholderImage,
    onImageDelete,
    onImageUpload
  } = props;

  const classes = useStyles(props);
  const intl = useIntl();
  const imagesUpload = React.useRef<HTMLInputElement>(null);
  const anchor = React.useRef<HTMLIonButtonElement>();
  const [imagesToUpload, setImagesToUpload] = React.useState<
    ProductMediaFragment[]
  >([]);

  const handleImageUpload = createMultiFileUploadHandler(onImageUpload, {
    onAfterUpload: () =>
      setImagesToUpload(prevImagesToUpload => prevImagesToUpload.slice(1)),
    onStart: files => {
      Array.from(files).forEach((file, fileIndex) => {
        const reader = new FileReader();
        reader.onload = event => {
          setImagesToUpload(prevImagesToUpload => [
            ...prevImagesToUpload,
            {
              __typename: "ProductMedia",
              alt: "",
              id: "",
              sortOrder: fileIndex,
              type: ProductMediaType.IMAGE,
              url: event.target.result as string,
              oembedData: null
            }
          ]);
        };
        reader.readAsDataURL(file);
      });
    }
  });

  return (
    <IonCard className={classes.card}>
      <CardTitle
        title={intl.formatMessage(messages.media)}
        toolbar={
          <>
            <IonButton
              onClick={imagesUpload.current?.click}
              size="small"
              color="primary"
              data-test="button-upload-image"
              ref={anchor}
            >
              {intl.formatMessage(messages.upload)}
            </IonButton>

            <input
              className={classes.fileField}
              id="fileUpload"
              onChange={event => handleImageUpload(event.target.files)}
              multiple
              type="file"
              ref={imagesUpload}
              accept="image/*"
            />
          </>
        }
      />
      <div className={classes.imageGridContainer}>
        {media === undefined ? (
          <CardContent>
            <div className={classes.root}>
              <div className={classes.imageContainer}>
                <img className={classes.image} src={placeholderImage} />
              </div>
            </div>
          </CardContent>
        ) : media.length > 0 ? (
          <>
            <ImageUpload
              className={classes.imageUpload}
              isActiveClassName={classes.imageUploadActive}
              disableClick={true}
              hideUploadIcon={true}
              iconContainerActiveClassName={classes.imageUploadIconActive}
              onImageUpload={handleImageUpload}
            >
              {({ isDragActive }) => (
                <CardContent>
                  <MediaListContainer
                    media={media}
                    className={classNames({
                      [classes.root]: true,
                      [classes.rootDragActive]: isDragActive
                    })}
                    onDelete={onImageDelete}
                  />
                </CardContent>
              )}
            </ImageUpload>
          </>
        ) : (
          <ImageUpload onImageUpload={handleImageUpload} />
        )}
      </div>
    </IonCard>
  );
};
ProductMedia.displayName = "ProductMedia";
export default ProductMedia;
