import { makeStyles } from "@saleor/macaw-ui";

export const useStyles = makeStyles(
  {
    avatar: {
      "&&:first-of-type": {
        paddingLeft: 0
      },
      width: 72
    },
    checkboxCell: {
      paddingLeft: 0,
      width: 88
    },
    colName: {
      paddingLeft: 0
    }
  },
  { name: "AssignProductDialog" }
);
