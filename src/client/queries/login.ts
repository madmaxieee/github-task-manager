import { gql } from "@apollo/client";

export interface LoginNameQueryResponseData {
  viewer: {
    login: string;
  };
}

export const GET_LOGIN_NAME = gql`
  query LoginName {
    viewer {
      login
    }
  }
`;
