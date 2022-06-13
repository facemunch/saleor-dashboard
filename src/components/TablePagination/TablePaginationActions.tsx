import { IconButton, alpha } from "@mui/material";
import ArrowLeft from "@mui/icons-material/ArrowLeft";
import ArrowRight from "@mui/icons-material/ArrowRight";
import { makeStyles, useTheme } from "@saleor/macaw-ui";
import { isDarkTheme } from "@saleor/misc";
import classNames from "classnames";
import React from "react";
import { IonButtons } from "@ionic/react";

const useStyles = makeStyles(
  theme => ({
    dark: {
      "& svg": {
        color: theme.palette.primary.main
      },
      "&$disabled": {
        "& svg": {
          color: alpha(theme.palette.primary.main, 0.2)
        }
      },
      "&:focus, &:hover": {
        "& > span:first-of-type": {
          backgroundColor: alpha(theme.palette.primary.main, 0.2)
        }
      }
    },
    disabled: {},
    iconButton: {
      "& > span:first-of-type": {
        backgroundColor: theme.palette.background.default,
        borderRadius: "100%",
        transition: theme.transitions.duration.standard + "ms"
      },
      "& svg": {
        border: `solid 1px #BDBDBD`,
        borderRadius: "50%"
      },
      "&:focus, &:hover": {
        "& > span:first-of-type": {
          backgroundColor: alpha(theme.palette.primary.main, 0.2)
        },
        backgroundColor: "transparent"
      },
      padding: 6
    },
    root: {
      color: theme.palette.text.secondary,
      flexShrink: 0,
      margin: theme.spacing(0, 2.5)
    }
  }),
  { name: "TablePaginationActions" }
);

export interface TablePaginationActionsProps {
  backIconButtonProps?: any;
  className?: string;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  nextIconButtonProps?: any;
  onNextPage(event);
  onPreviousPage(event);
}

export const TablePaginationActions: React.FC<TablePaginationActionsProps> = props => {
  const {
    backIconButtonProps,
    className,
    hasNextPage,
    hasPreviousPage,
    nextIconButtonProps,
    onNextPage,
    onPreviousPage,
    ...other
  } = props;
  const classes = useStyles(props);

  const { direction, themeType } = useTheme();

  const isDark = isDarkTheme(themeType);

  return (
    <IonButtons slot="end">
      <IconButton
        className={classNames(classes.iconButton, {
          [classes.dark]: isDark,
          [classes.disabled]: !hasPreviousPage
        })}
        onClick={onPreviousPage}
        disabled={!hasPreviousPage}
        data-test="button-pagination-back"
        {...backIconButtonProps}
      >
        {direction === "rtl" ? <ArrowRight /> : <ArrowLeft />}
      </IconButton>
      <IconButton
        className={classNames(classes.iconButton, {
          [classes.dark]: isDark,
          [classes.disabled]: !hasNextPage
        })}
        onClick={onNextPage}
        disabled={!hasNextPage}
        data-test="button-pagination-next"
        {...nextIconButtonProps}
      >
        {direction === "rtl" ? <ArrowLeft /> : <ArrowRight />}
      </IconButton>
    </IonButtons>
  );
};

TablePaginationActions.displayName = "TablePaginationActions";
export default TablePaginationActions;
