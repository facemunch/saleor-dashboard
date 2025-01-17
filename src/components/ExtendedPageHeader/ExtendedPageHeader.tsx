import { Divider } from "@mui/material";
import { makeStyles } from "@saleor/macaw-ui";
import classNames from "classnames";
import React from "react";

const useStyles = makeStyles(
  theme => ({
    action: {
      flex: "0 0 auto",
      [theme.breakpoints.down("sm")]: {
        marginTop: theme.spacing()
      }
    },
    block: {
      [theme.breakpoints.down("xs")]: {
        "&&": {
          display: "block"
        }
      }
    },
    underline: {
      marginBottom: theme.spacing(4)
    },
    grid: {
      padding: theme.spacing(2)
    },
    menuButton: {
      flex: "0 0 auto",
      marginLeft: theme.spacing(-2),
      marginRight: theme.spacing(3),
      marginTop: theme.spacing(-2)
    },
    root: {
      alignItems: "end",
      display: "flex",
      marginBottom: theme.spacing(3),
      wordBreak: "break-all",
      flexDirection: "column"
    },
    subtitle: {
      alignItems: "center",
      display: "flex",
      marginBottom: theme.spacing(2)
    },
    title: {
      flex: 1,
      paddingBottom: theme.spacing(2)
    }
  }),
  {
    name: "ExtendedPageHeader"
  }
);

interface ExtendedPageHeaderProps {
  children?: React.ReactNode;
  className?: string;
  inline?: boolean;
  underline?: boolean;
  title?: React.ReactNode;
  testId?: string;
}

const ExtendedPageHeader: React.FC<ExtendedPageHeaderProps> = props => {
  const { children, className, inline, underline, title, testId } = props;

  const classes = useStyles(props);

  return (
    <>
      <div
        data-test-id={testId}
        className={classNames(classes.root, className, {
          [classes.block]: !inline,
          [classes.underline]: underline
        })}
      >
        {title}
        <div className={classes.action}>{children}</div>
      </div>
      {underline && (
        <div className={classes.underline}>
          <Divider />
        </div>
      )}
    </>
  );
};
ExtendedPageHeader.displayName = "ExtendedPageHeader";
export default ExtendedPageHeader;
