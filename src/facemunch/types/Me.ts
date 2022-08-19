/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { PermissionEnum } from "./../../types/globalTypes";

// ====================================================
// GraphQL query operation: Me
// ====================================================

export interface Me_me_userPermissions {
  __typename: "UserPermission";
  code: PermissionEnum;
  name: string;
}

export interface Me_me_avatar {
  __typename: "Image";
  url: string;
}

export interface Me_me {
  __typename: "User";
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  isStaff: boolean;
  userPermissions: (Me_me_userPermissions | null)[] | null;
  avatar: Me_me_avatar | null;
}

export interface Me {
  me: Me_me | null;
}
