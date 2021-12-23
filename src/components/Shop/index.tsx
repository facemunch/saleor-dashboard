import appleTouchIcon from "@assets/favicons/apple-touch-icon.png";
import favicon16 from "@assets/favicons/favicon-16x16.png";
import favicon32 from "@assets/favicons/favicon-32x32.png";
import safariPinnedTab from "@assets/favicons/safari-pinned-tab.svg";
import { useAuth } from "@saleor/auth/AuthProvider";
import React from "react";
import Helmet from "react-helmet";

import { TypedShopInfoQuery } from "./query";
import { ShopInfo_shop } from "./types/ShopInfo";

type ShopContext = ShopInfo_shop;

export const ShopContext = React.createContext<ShopContext>(undefined);

export const ShopProvider: React.FC = ({ children }) => {
  const { isAuthenticated } = useAuth();

  return (
    <TypedShopInfoQuery skip={!isAuthenticated}>
      {({ data }) => (
        <>
          <Helmet></Helmet>
          <ShopContext.Provider value={data ? data.shop : undefined}>
            {children}
          </ShopContext.Provider>
        </>
      )}
    </TypedShopInfoQuery>
  );
};

export const Shop = ShopContext.Consumer;
export default Shop;
