import { Theme } from "@mui/material/styles";

const themeOverrides: Partial<Theme> = {
  components: {
    MuiTableCell: {
      styleOverrides: {
        body: {
          paddingBottom: 8,
          paddingTop: 8
        },
        root: {
          height: 56,
          padding: "4px 24px"
        }
      }
    }
  }
};
export default themeOverrides;
