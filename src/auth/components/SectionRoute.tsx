import React from "react";
import useUser from "@saleor/hooks/useUser";

import NotFound from "../../NotFound";
import { PermissionEnum } from "../../types/globalTypes";
import { hasAllPermissions, hasAnyPermissions } from "../misc";

type MatchPermissionType = "all" | "any";

interface SectionRouteProps {
  permissions?: PermissionEnum[];
  matchPermission?: MatchPermissionType;
}

const matchAll = (match: MatchPermissionType) => match === "all";

export const SectionRoute: React.FC<React.PropsWithChildren<SectionRouteProps>> = ({
  permissions,
  matchPermission = "all",
  children,
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

  return hasSectionPermissions() ? <>{children}</> : <NotFound />;
};

export default SectionRoute;
