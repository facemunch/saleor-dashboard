import { Table, Box } from "@mui/material";
import { makeStyles } from "@saleor/macaw-ui";
import React from "react";

const useStyles = makeStyles(
  theme => ({
    root: {
      position: "relative",
      overflowY: "hidden",

      // width: "100%",
      [theme.breakpoints.up("md")]: {
        "&& table": {
          tableLayout: "fixed"
        }
      },
      "& table": {
        tableLayout: "auto"
        // width: "82%"
      },
      "& p": {
        fontSize: "12px"
      },
      "& a": {
        fontSize: "12px"
      }
      // overflowX: "auto"
      // width: "82%"
    }
  }),
  {
    name: "ResponsiveTable"
  }
);

interface ResponsiveTableProps {
  children: React.ReactNode | React.ReactNodeArray;
  className?: string;
  style?: any;
  key?: string;
}

const ResponsiveTable: React.FC<ResponsiveTableProps> = props => {
  const { children, className } = props;

  const classes = useStyles(props);

  return (
    <Box
      sx={{
        // width: "1",
        overflow: "hidden",
        height: "100%",
        position: "relative",

        width: {
          xs: "initial", // theme.breakpoints.up('xs')
          sm: "initial", // theme.breakpoints.up('sm')
          md: "100%", // theme.breakpoints.up('md')
          lg: "100%", // theme.breakpoints.up('lg')
          xl: "100%" // theme.breakpoints.up('xl')
        }
      }}
    >
      <div
        className="scrim"
        style={{
          background:
            "linear-gradient(-90deg, rgb(34 38 43 / 0%) 0%, rgb(34 38 43 / 23%) 31.25%, rgb(34 38 43) 72.92%, #22262b 100%)",
          position: "absolute",
          height: "100%",
          width: "10px",
          zIndex: 1
        }}
      ></div>
      <div
        className="scrim"
        style={{
          background:
            "linear-gradient(90deg, rgb(34 38 43 / 0%) 0%, rgb(34 38 43 / 23%) 31.25%, rgb(34 38 43) 72.92%, #22262b 100%)",
          position: "absolute",
          height: "100%",
          width: "10px",
          right: "0",
          zIndex: 1
        }}
      ></div>
      <div className={classes.root}>
        <Table className={className}>{children}</Table>
        {/* <div
        className="scrim"
        style={{
          background:
            "linear-gradient(-90deg, rgb(34 38 43 / 0%) 0%, rgb(34 38 43 / 23%) 31.25%, rgb(34 38 43) 72.92%, #22262b 100%)",
          position: "fixed",
          height: "100%",
          width: "10px",
          bottom: "17vh",
          // marginTop: "-100vh",
          pointerEvents: "none"
        }}
      ></div>
      <div
        className="scrim"
        style={{
          background:
            "linear-gradient(90deg, rgb(34 38 43 / 0%) 0%, rgb(34 38 43 / 23%) 31.25%, rgb(34 38 43) 72.92%, #22262b 100%)",

          position: "fixed",
          height: "100vh",
          width: "10px",
          // zIndex: 1,
          bottom: "0",
          right: "0",
          marginTop: "-100vh",
          pointerEvents: "none"
        }}
      ></div> */}
      </div>
    </Box>
  );
};

ResponsiveTable.displayName = "ResponsiveTable";
export default ResponsiveTable;
