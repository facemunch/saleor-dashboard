import { ButtonBase, ButtonBaseProps } from "@mui/material";
import clsx from "clsx";
import React from "react";

import { makeStyles } from "../theme";

const useStyles = makeStyles(
  theme => ({
    root: {
      // "&:hover, &:focus": {
      //   background: "#22262b"
      // },
      // background: theme.palette.background.paper,
      // borderRadius: "50%",
      // color: theme.palette.primary.main,
      // height: 48,
      // transition: theme.transitions.duration.shortest + "ms",
      // width: 48,

      color: "#ffffff",
      width: "38px",
      height: "38px",
      background: "#000",
      transition: "150ms",
      borderRadius: "50%",
      border: "solid 1px #a9a9a973",
      padding: "0px",
      marginTop: "5px"
    }
  }),
  {
    name: "ExpandButton"
  }
);

export const SquareButton: React.FC<ButtonBaseProps> = ({
  className,
  ...rest
}) => {
  const classes = useStyles({});

  return <ButtonBase className={clsx(classes.root, className)} {...rest} />;
};

SquareButton.displayName = "SquareButton";
