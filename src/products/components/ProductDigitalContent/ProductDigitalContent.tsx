import CardTitle from "@saleor/components/CardTitle";
import DigitalContentUpload from "@saleor/components/DigitalContentUpload";
import { DigitalContentFragment } from "@saleor/fragments/types/DigitalContentFragment";
import { makeStyles } from "@saleor/macaw-ui";
import createMultiFileUploadHandler from "@saleor/utils/handlers/multiFileUploadHandler";
import React, { useState } from "react";
import { defineMessages, useIntl } from "react-intl";
import { trashOutline, documentOutline } from "ionicons/icons";

import {
  IonCard,
  IonButton,
  IonItem,
  IonLabel,
  IonThumbnail,
  IonList,
  IonIcon,
  useIonAlert
} from "@ionic/react";
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

const useStyles = makeStyles(theme => ({
  card: {
    marginTop: theme.spacing(2),
    [theme.breakpoints.down("sm")]: {
      marginTop: 0
    }
  },
  fileField: {
    display: "none"
  },
  thumbnail: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#FFEF5B",
    borderRadius: "8px",
    margin: "10px 10px 10px 0"
  },
  productName: {
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    maxWidth: "45vw"
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
  }
}));

interface ProductDigitalContentProps {
  content: DigitalContentFragment;
  loading?: boolean;
  onFileDelete: (id: string) => () => void;
  onFileUpload(file: File);
}

const ProductDigitalContent: React.FC<ProductDigitalContentProps> = props => {
  const { content, onFileDelete, onFileUpload } = props;
  const classes = useStyles(props);
  const intl = useIntl();
  const filesUpload = React.useRef<HTMLInputElement>(null);
  const anchor = React.useRef<HTMLIonButtonElement>();
  const [uploading, setUploading] = useState(false);

  const handleFileUpload = createMultiFileUploadHandler(onFileUpload, {
    onAfterUpload: e => {
      setUploading(false);
    },
    onStart: e => {
      setUploading(true);
    }
  });
  const [presentAlert] = useIonAlert();

  const replaceContent = () => {};

  const onDeleteHandler = () => {
    presentAlert({
      header: "Delete current file?",
      message:
        "Do you really want to delete current file? This action cannot be reversed.",
      buttons: [
        "Cancel",
        {
          text: "Delete",
          role: "destructive",
          handler: async () => {
            onFileDelete(content.productVariant.id)();
          }
        }
      ]
    });
  };

  return (
    <IonCard className={classes.card}>
      <CardTitle
        title={intl.formatMessage(messages.media)}
        toolbar={
          <>
            {!content && (
              <IonButton
                onClick={() =>
                  content ? replaceContent : filesUpload.current.click()
                }
                disabled={uploading}
                size="small"
                color="primary"
                data-test="button-upload-file"
                ref={anchor}
              >
                {intl.formatMessage(messages.upload)}
              </IonButton>
            )}

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
        {content ? (
          <IonList>
            <IonItem style={{ "--background": "#313131" }}>
              <IonThumbnail className={classes.thumbnail} slot="start">
                <IonIcon size="large" color="light" icon={documentOutline} />
              </IonThumbnail>
              <IonLabel>
                <p className={classes.productName}>
                  <a href={content?.urls[0]?.url} target="_blank">
                    {content?.contentFile?.replace("digital_contents/", "")}
                  </a>
                </p>
              </IonLabel>
              <IonButton
                slot="end"
                onClick={onDeleteHandler}
                size="small"
                fill="clear"
                color="dark"
                data-test="button-upload-file"
                ref={anchor}
              >
                <IonIcon slot="icon-only" icon={trashOutline} />
              </IonButton>
            </IonItem>
          </IonList>
        ) : (
          <DigitalContentUpload
            uploading={uploading}
            onDigitalContentUpload={handleFileUpload}
          />
        )}
      </>
    </IonCard>
  );
};
ProductDigitalContent.displayName = "ProductDigitalContent";
export default ProductDigitalContent;
