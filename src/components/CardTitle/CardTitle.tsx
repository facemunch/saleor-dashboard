import { Typography } from "@mui/material";
import { makeStyles } from "@saleor/macaw-ui";
import classNames from "classnames";
import React from "react";

const useStyles = makeStyles(
  theme => ({
    children: {
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2),
      [theme.breakpoints.up('sm')]: {
        paddingLeft: theme.spacing(3),
        paddingRight: theme.spacing(3),
      },
    },
    constantHeight: {
      height: 56
    },
    hr: {
      border: "none",
      borderTop: `1px solid ${theme.palette.divider}`,
      height: 0,
      marginBottom: 0,
      marginTop: 0,
      width: "100%"
    },
    root: {
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2),
      alignItems: "center",
      display: "flex",
      minHeight: 56,
      [theme.breakpoints.up('sm')]: {
        paddingLeft: theme.spacing(3),
        paddingRight: theme.spacing(3),
      },
    },
    title: {
      flex: 1,
      fontWeight: 500,
      lineHeight: 1
    },
    toolbar: {
      marginRight: theme.spacing(-1)
    }
  }),
  { name: "CardTitle" }
);

interface CardTitleProps {
  children?: React.ReactNode;
  className?: string;
  height?: "default" | "const";
  title: string | React.ReactNode;
  toolbar?: React.ReactNode;
  onClick?: (event: React.MouseEvent<any>) => void;
}

const CardTitle: React.FC<CardTitleProps> = props => {
  const {
    className,
    children,
    height,
    title,
    toolbar,
    onClick,
    ...rest
  } = props;

  const classes = useStyles(props);

  return (
    <>
      <div
        className={classNames(classes.root, {
          [className]: !!className,
          [classes.constantHeight]: height === "const"
        })}
        {...rest}
      >
        <Typography
          className={classes.title}
          variant="h5"
          onClick={onClick}
          component="span"
        >
          {title}
        </Typography>
        <div className={classes.toolbar}>{toolbar}</div>
      </div>
      <div className={classes.children}>{children}</div>
      <hr className={classes.hr} />
    </>
  );
};
CardTitle.displayName = "CardTitle";
export default CardTitle;
