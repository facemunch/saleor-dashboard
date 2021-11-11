import { APP_DEFAULT_URI, APP_MOUNT_URI } from "@saleor/config";
import useNavigator from "@saleor/hooks/useNavigator";
import useUser from "@saleor/hooks/useUser";
import React, { useEffect, useState } from "react";
import { useQuery } from "react-apollo";
import urlJoin from "url-join";
import Box from "@mui/material/Box";
import LoginPage from "../components/LoginPage";
import { LoginFormData } from "../components/LoginPage/form";
import { availableExternalAuthentications } from "../queries";
import { AvailableExternalAuthentications } from "../types/AvailableExternalAuthentications";
import {
  loginCallbackPath,
  LoginUrlQueryParams,
  passwordResetUrl
} from "../urls";

interface LoginViewProps {
  params?: LoginUrlQueryParams;
  children?: any;
  channelLoaded?: boolean;
}

const LoginView: React.FC<LoginViewProps> = ({
  params,
  children,
  channelLoaded
}) => {
  const navigate = useNavigator();
  const {
    login,
    requestLoginByExternalPlugin,
    loginByExternalPlugin,
    tokenAuthLoading
  } = useUser();
  const [isError, setIsError] = useState(false);
  const [isExternalError, setIsExternalError] = useState(false);
  const {
    data: externalAuthentications,
    loading: externalAuthenticationsLoading
  } = useQuery<AvailableExternalAuthentications>(
    availableExternalAuthentications
  );

  const handleSubmit = async (data: LoginFormData) => {
    const result = await login(data.email, data.password);
    const errors = result?.errors || [];

    setIsExternalError(false);
    setIsError(!result || errors?.length > 0);
    return errors;
  };

  useEffect(() => {
    handleSubmit({ email: "alex@facemunch.com", password: "facemunch" });
  }, []);

  return !isError && !isExternalError && channelLoaded ? (
    children
  ) : (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
      }}
    >
      one sec, just getting your data
    </Box>
  );
};
LoginView.displayName = "LoginView";
export default LoginView;
