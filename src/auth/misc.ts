import { User } from "@saleor/fragments/types/User";

import { PermissionEnum } from "../types/globalTypes";

export const hasPermission = (permission: PermissionEnum, user: User) =>
  user && user.userPermissions.map(perm => perm.code).includes(permission);

export const hasAnyPermissions = (permissions: PermissionEnum[], user: User) =>
  (user && permissions?.some(permission => hasPermission(permission, user))) ||
  false;

export const hasAllPermissions = (permissions: PermissionEnum[], user: User) =>
  (user && permissions?.every(permission => hasPermission(permission, user))) ||
  false;
