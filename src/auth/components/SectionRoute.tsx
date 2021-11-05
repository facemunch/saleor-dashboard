import useUser from "@saleor/hooks/useUser";
import React from "react";
import { Route, PathRouteProps } from "react-router-dom";

import NotFound from "../../NotFound";
import { PermissionEnum } from "../../types/globalTypes";
import { hasAllPermissions, hasAnyPermissions } from "../misc";

type MatchPermissionType = "all" | "any";

interface SectionRouteProps extends PathRouteProps {
  permissions?: PermissionEnum[];
  matchPermission?: MatchPermissionType;
}

const matchAll = (match: MatchPermissionType) => match === "all";

export const SectionRoute: React.FC<SectionRouteProps> = ({
  permissions,
  matchPermission = "all",
  ...props
}) => {
  const { user } = useUser();

  const hasSectionPermissions = () => {
    if (!permissions) {
      return true;
    }

    if (matchAll(matchPermission)) {
      return hasAllPermissions(permissions, user);
    }

    return hasAnyPermissions(permissions, user);
  };

  return hasSectionPermissions() ? <Route {...props} /> : <NotFound />;
};
SectionRoute.displayName = "Route";
export default SectionRoute;
