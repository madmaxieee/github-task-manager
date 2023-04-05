import { gql } from "@apollo/client";

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
          title: string;
          url: string;
          labels: {
            nodes: {
              id: string;
              name: string;
              color: string;
            }[];
          };
        };
      }[];
    };
  };
}

export interface FirstIssueQueryVariables {
  first: number;
  name: string;
  owner: string;
  labelCount: number;
}

export const GET_FIRST_ISSUE = gql`
  query Issues(
    $first: Int!
    $name: String!
    $owner: String!
    $labelCount: Int!
  ) {
    repository(name: $name, owner: $owner) {
      issues(
        first: $first
        orderBy: { field: CREATED_AT, direction: DESC }
        filterBy: { states: OPEN }
      ) {
        edges {
          cursor
          node {
            bodyHTML
            closed
            id
            isPinned
            number
            title
            url
            labels(first: $labelCount) {
              nodes {
                id
                name
                color
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

export interface MoreIssueQueryVariables {
  first: number;
  name: string;
  owner: string;
  after: string;
  labelCount: number;
}

export const GET_MORE_ISSUES = gql`
  query Issues(
    $first: Int!
    $name: String!
    $owner: String!
    $after: String!
    $labelCount: Int!
  ) {
    repository(name: $name, owner: $owner) {
      issues(
        first: $first
        after: $after
        orderBy: { field: CREATED_AT, direction: DESC }
        filterBy: { states: OPEN }
      ) {
        edges {
          cursor
          node {
            bodyHTML
            closed
            id
            isPinned
            number
            title
            url
            labels(first: $labelCount) {
              nodes {
                id
                name
                color
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

export interface SearchIssueQueryVariables {
  query: string;
}

export interface SearchIssueQueryResponseData {
  search: {
    edges: {
      cursor: string;
      node: {
        bodyHTML: string;
        closed: boolean;
        id: string;
        isPinned: boolean;
        number: number;
        title: string;
        url: string;
        labels: {
          nodes: {
            id: string;
            name: string;
            color: string;
          }[];
        };
      };
    }[];
  };
}

export const SearchIssues = gql`
  query SearchIssues($query: String!) {
    search(query: $query, type: ISSUE) {
      edges {
        cursor
        node {
          ... on Issue {
            id
            bodyHTML
            closed
            labels(first: 10) {
              nodes {
                id
                name
                color
              }
            }
            number
            title
            url
            isPinned
          }
        }
      }
    }
  }
`;
