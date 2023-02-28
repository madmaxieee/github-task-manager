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
      totalCount?: number;
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
        totalCount
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

export interface IssueQueryResponseData {
  repository: {
    issues: {
      totalCount: number;
      edges: {
        cursor: string;
        node: {
          bodyHTML: string;
          closed: boolean;
          id: string;
          isPinned: boolean;
          number: number;
          titleHTML: string;
          url: string;
        };
      }[];
    };
  };
}

export const FIRST_ISSUE_QUERY = gql`
  query Issues($first: Int!, $name: String!, $owner: String!) {
    repository(name: $name, owner: $owner) {
      issues(first: $first, orderBy: { field: CREATED_AT, direction: DESC }) {
        edges {
          cursor
          node {
            bodyHTML
            closed
            id
            isPinned
            number
            titleHTML
            url
          }
        }
        totalCount
      }
      id
    }
  }
`;

export const MORE_ISSUE_QUERY = gql`
  query Issues($first: Int!, $name: String!, $owner: String!, $after: String!) {
    repository(name: $name, owner: $owner) {
      issues(
        first: $first
        after: $after
        orderBy: { field: CREATED_AT, direction: DESC }
      ) {
        edges {
          cursor
          node {
            bodyHTML
            closed
            id
            isPinned
            number
            titleHTML
            url
          }
        }
        totalCount
      }
      id
    }
  }
`;
