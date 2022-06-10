import makeQuery from "@saleor/hooks/makeQuery";
import gql from "graphql-tag";

export const userDataFragment = gql`
  query Me{
    me {
      id
    email
    firstName
    lastName
    isStaff
    userPermissions {
      code
      name
    }
    avatar {
      url
    }
    }
  }
`;

export const userDataQuery = makeQuery(userDataFragment);
