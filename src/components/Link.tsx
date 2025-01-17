import { Typography, TypographyProps } from "@mui/material";
import { makeStyles } from "@saleor/macaw-ui";
import classNames from "classnames";
import React from "react";

const useStyles = makeStyles(
  theme => ({
    primary: {
      color: theme.palette?.textHighlighted?.active // TODO RA MIGRATION
    },
    root: {
      cursor: "pointer",
      display: "inline"
    },
    secondary: {
      color: theme.palette.primary.main
    },
    underline: {
      textDecoration: "underline"
    },
    disabled: {
      cursor: "default",
      color: theme.palette?.textHighlighted?.inactive // TODO RA MIGRATION
    }
  }),
  { name: "Link" }
);

interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  color?: "primary" | "secondary";
  underline?: boolean;
  typographyProps?: TypographyProps;
  onClick: () => void;
  disabled?: boolean;
}

const Link: React.FC<LinkProps> = props => {
  const {
    className,
    children,
    color = "primary",
    underline = false,
    onClick,
    disabled,
    ...linkProps
  } = props;

  const classes = useStyles(props);

  return (
    <Typography
      component="a"
      className={classNames(className, {
        [classes.root]: true,
        [classes[color]]: true,
        [classes.underline]: underline,
        [classes.disabled]: disabled
      })}
      onClick={event => {
        if (disabled) {
          return;
        }

        event.preventDefault();
        onClick();
      }}
      {...linkProps}
    >
      {children}
    </Typography>
  );
};
Link.displayName = "Link";
export default Link;
