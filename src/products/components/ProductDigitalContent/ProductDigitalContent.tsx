import { CardContent } from "@mui/material";
import CardTitle from "@saleor/components/CardTitle";
import ImageUpload from "@saleor/components/ImageUpload";
import { DigitalContentFragment } from "@saleor/fragments/types/DigitalContentFragment";
import { makeStyles } from "@saleor/macaw-ui";
import { ProductMediaPopper } from "@saleor/products/components/ProductMediaPopper/ProductMediaPopper";
import createMultiFileUploadHandler from "@saleor/utils/handlers/multiFileUploadHandler";
import React from "react";
import { defineMessages, useIntl } from "react-intl";
import { IonCard, IonButton } from "@ionic/react";
const messages = defineMessages({
  media: {
    defaultMessage: "Digital content",
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


interface ProductDigitalContentProps {
  content: DigitalContentFragment;
  loading?: boolean;
  onFileDelete: (id: string) => () => void;
  onFileUpload(file: File);
}

const ProductDigitalContent: React.FC<ProductDigitalContentProps> = props => {
  const {
    content,
    onFileDelete,
    onFileUpload,
  } = props;

  const classes = useStyles(props);
  const intl = useIntl();
  const filesUpload = React.useRef<HTMLInputElement>(null);
  const anchor = React.useRef<HTMLIonButtonElement>();
  const [popperOpenStatus, setPopperOpenStatus] = React.useState(false);

  const handleFileUpload = createMultiFileUploadHandler(onFileUpload, {
    onAfterUpload: null,
    onStart: null
  });

  return (
    <IonCard className={classes.card}>
      <CardTitle
        title={intl.formatMessage(messages.media)}
        toolbar={
          <>
            <IonButton
              onClick={() => setPopperOpenStatus(true)}
              size="small"
              color="primary"
              data-test="button-upload-file"
              ref={anchor}
            >
              {intl.formatMessage(messages.upload)}
            </IonButton>

            <ProductMediaPopper
              anchorRef={anchor.current}
              imagesUploadRef={filesUpload.current}
              setPopperStatus={setPopperOpenStatus}
              popperStatus={popperOpenStatus}
              openMediaUrlModal={() => {}}
            />

            <input
              className={classes.fileField}
              id="fileUpload"
              onChange={event => handleFileUpload(event.target.files)}
              multiple
              type="file"
              ref={filesUpload}
            />
          </>
        }
      />
      <>
        { content ? (
          <CardContent>
            <IonButton
              onClick={() => onFileDelete(content.productVariant.id)()}
              size="small"
              color="primary"
              data-test="button-upload-file"
              ref={anchor}
            >
              Delete
            </IonButton>
          </CardContent>
        ) : (
          <ImageUpload onImageUpload={handleFileUpload} />
        )}
      </>
    </IonCard>
  );
};
ProductDigitalContent.displayName = "ProductDigitalContent";
export default ProductDigitalContent;
