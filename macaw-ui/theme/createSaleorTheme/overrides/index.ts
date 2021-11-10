import { SaleorThemeColors } from "../types";
import { buttonOverrides } from "./buttons";
import { inputOverrides } from "./inputs";
import { tableOverrides } from "./tables";

export const overrides = (
  colors: SaleorThemeColors,
  fontFamily: string
) => ({
  ...inputOverrides(colors),
  ...tableOverrides(colors, fontFamily),
  ...buttonOverrides(colors),
});
