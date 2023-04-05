import { gql } from "@apollo/client";

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
      totalCount?: number;
    };
    id: string;
  };
}

export interface FirstRepoQueryVariables {
  loginName: string;
  first: number;
}

export const GET_FIRST_REPO = gql`
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
        totalCount
      }
      id
    }
  }
`;

export interface MoreRepoQueryVariables {
  loginName: string;
  first: number;
  after: string;
}

export const GET_MORE_REPOS = gql`
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

export interface RepoIDQueryVariables {
  name: string;
  owner: string;
}

export interface RepoIDQueryResponseData {
  repository: {
    id: string;
  };
}

export const GET_REPO_ID = gql`
  query Repo($name: String!, $owner: String!) {
    repository(name: $name, owner: $owner) {
      id
    }
  }
`;
