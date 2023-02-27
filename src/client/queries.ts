import { gql } from "@apollo/client";
export interface LoginNameQueryResponseData {
  viewer: {
    login: string;
  };
}

export const LOGIN_NAME_QUERY = gql`
  query LoginName {
    viewer {
      login
    }
  }
`;

export interface RepoQueryResponseData {
  user: {
    repositories: {
      edges: {
        cursor: string;
        node: {
          id: string;
          name: string;
          owner: {
            login: string;
          };
          description: string;
          stargazerCount: number;
          hasIssuesEnabled: boolean;
          isPrivate: boolean;
          updatedAt: string;
          languages: {
            edges: {
              node: {
                name: string;
                color: string;
              };
            }[];
          };
        };
      }[];
    };
    id: string;
  };
}

export const FIRST_REPO_QUERY = gql`
  query Repos($loginName: String!, $first: Int!) {
    user(login: $loginName) {
      repositories(
        first: $first
        orderBy: { field: UPDATED_AT, direction: DESC }
      ) {
        edges {
          cursor
          node {
            id
            name
            owner {
              login
            }
            description
            stargazerCount
            hasIssuesEnabled
            isPrivate
            updatedAt
            languages(first: 1, orderBy: { field: SIZE, direction: ASC }) {
              edges {
                node {
                  name
                  color
                }
              }
            }
          }
        }
      }
      id
    }
  }
`;

export const MORE_REPO_QUERY = gql`
  query Repos($loginName: String!, $first: Int!, $after: String!) {
    user(login: $loginName) {
      repositories(
        first: $first
        orderBy: { field: UPDATED_AT, direction: DESC }
        after: $after
      ) {
        edges {
          cursor
          node {
            id
            name
            owner {
              login
            }
            description
            stargazerCount
            hasIssuesEnabled
            isPrivate
            updatedAt
            languages(first: 1, orderBy: { field: SIZE, direction: ASC }) {
              edges {
                node {
                  name
                  color
                }
              }
            }
          }
        }
      }
      id
    }
  }
`;

export const ISSUES_QUERY = gql`
  query Issues($name: String!, $owner: String!) {
    repository(name: $name, owner: $owner) {
      issues(first: 5) {
        edges {
          node {
            id
            state
            bodyHTML
            titleHTML
          }
          cursor
        }
      }
    }
  }
`;
