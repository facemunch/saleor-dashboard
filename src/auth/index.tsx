import { User } from "@saleor/fragments/types/User";
import { parse as parseQs } from "qs";
import React, { MutableRefObject } from "react";
import { Route, Routes } from "react-router-dom";

import Layout from "./components/Layout";
import {
  ExternalLoginInput,
  RequestExternalLoginInput
} from "./hooks/useExternalAuthProvider";
import { ExternalObtainAccessTokens_externalObtainAccessTokens } from "./types/ExternalObtainAccessTokens";
import { TokenAuth_tokenCreate } from "./types/TokenAuth";
import {
  LoginUrlQueryParams,
  newPasswordPath,
  passwordResetPath,
  passwordResetSuccessPath
} from "./urls";
import LoginViewComponent from "./views/Login";
import NewPassword from "./views/NewPassword";
import ResetPassword from "./views/ResetPassword";
import ResetPasswordSuccess from "./views/ResetPasswordSuccess";

const LoginView: React.FC = () => {
  const qs = parseQs(location.search.substr(1));
  const params: LoginUrlQueryParams = qs;

  return <LoginViewComponent params={params} />;
};

interface UserContext {
  login: (username: string, password: string) => Promise<TokenAuth_tokenCreate>;
  loginByExternalPlugin: (
    input: ExternalLoginInput
  ) => Promise<ExternalObtainAccessTokens_externalObtainAccessTokens>;
  loginByToken: (auth: string, csrf: string, user: User) => void;
  logout: () => void;
  requestLoginByExternalPlugin: (
    pluginId: string,
    input: RequestExternalLoginInput
  ) => Promise<void>;
  tokenAuthLoading: boolean;
  tokenRefresh: () => Promise<boolean>;
  tokenVerifyLoading: boolean;
  user?: User;
  autologinPromise?: MutableRefObject<Promise<any>>;
}

export const UserContext = React.createContext<UserContext>({
  login: undefined,
  loginByExternalPlugin: undefined,
  loginByToken: undefined,
  logout: undefined,
  requestLoginByExternalPlugin: undefined,
  tokenAuthLoading: false,
  tokenRefresh: undefined,
  tokenVerifyLoading: false
});

const AuthRouter: React.FC = () => (
  <Layout>
    <Routes>
      <Route path={passwordResetSuccessPath} element={<ResetPasswordSuccess />} />
      <Route path={passwordResetPath} element={<ResetPassword />} />
      {/* <Route path={newPasswordPath} element={<NewPassword />} /> */}
      <Route path="" element={<LoginView />} />
    </Routes>
  </Layout>
);

AuthRouter.displayName = "AuthRouter";
export default AuthRouter;

export * from "./utils";
