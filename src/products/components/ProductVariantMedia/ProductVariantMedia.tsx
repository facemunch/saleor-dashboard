import { Button, Card, CardContent, Typography } from "@mui/material";
import CardTitle from "@saleor/components/CardTitle";
import Skeleton from "@saleor/components/Skeleton";
import { ProductMediaFragment } from "@saleor/fragments/types/ProductMediaFragment";
import { makeStyles } from "@saleor/macaw-ui";
import React from "react";
import { defineMessages, useIntl } from "react-intl";

const messages = defineMessages({
  chooseMedia: {
    defaultMessage: "Choose media",
    description: "button"
  },
  media: {
    defaultMessage: "Media",
    description: "section header"
  },
  selectSpecificVariant: {
    defaultMessage: "Select a specific variant media from product media",
    description: "select variant media"
  }
});

const useStyles = makeStyles(
  theme => ({
    gridElement: {
      "& img": {
        width: "100%"
      }
    },
    helpText: {
      gridColumnEnd: "span 4"
    },
    image: {
      objectFit: "contain",
      width: "100%"
    },
    imageContainer: {
      background: "#ffffff",
      border: "1px solid #eaeaea",
      borderRadius: theme.spacing(),
      height: theme.spacing(17.5),
      marginBottom: theme.spacing(2),
      padding: theme.spacing(2)
    },
    root: {
      display: "grid",
      gridColumnGap: theme.spacing(2),
      gridTemplateColumns: "repeat(4, 1fr)"
    }
  }),
  { name: "ProductVariantMedia" }
);

interface ProductVariantMediaProps {
  media?: ProductMediaFragment[];
  placeholderImage?: string;
  disabled: boolean;
  onImageAdd();
}

export const ProductVariantMedia: React.FC<ProductVariantMediaProps> = props => {
  const intl = useIntl();
  const classes = useStyles(props);
  const { disabled, media, onImageAdd } = props;

  return (
    <Card>
      <CardTitle
        title={intl.formatMessage(messages.media)}
        toolbar={
          <Button
            color="primary"
            variant="text"
            disabled={disabled}
            onClick={onImageAdd}
          >
            {intl.formatMessage(messages.chooseMedia)}
          </Button>
        }
      />
      <CardContent>
        <div className={classes.root}>
          {media === undefined || media === null ? (
            <Skeleton />
          ) : media.length > 0 ? (
            media
              .sort((prev, next) => (prev.sortOrder > next.sortOrder ? 1 : -1))
              .map(mediaObj => {
                const parsedMediaOembedData = JSON.parse(mediaObj?.oembedData);
                const mediaUrl =
                  parsedMediaOembedData?.thumbnail_url || mediaObj.url;
                return (
                  <img
                    key={mediaObj.id}
                    className={classes.image}
                    src={mediaUrl}
                    alt={mediaObj.alt}
                  />
                );
              })
          ) : (
            <Typography className={classes.helpText}>
              {intl.formatMessage(messages.selectSpecificVariant)}
            </Typography>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
ProductVariantMedia.displayName = "ProductVariantMedia";
export default ProductVariantMedia;
