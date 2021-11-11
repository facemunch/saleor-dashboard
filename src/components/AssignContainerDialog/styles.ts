import { makeStyles } from "@saleor/macaw-ui";

export const useStyles = makeStyles(
  {
    avatar: {
      "&:first-of-type": {
        paddingLeft: 0
      }
    },
    checkboxCell: {
      paddingLeft: 0
    },
    wideCell: {
      width: "100%"
    }
  },
  { name: "AssignContainerDialog" }
);
