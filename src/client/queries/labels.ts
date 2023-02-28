import { gql } from "@apollo/client";

export interface LabelCountQueryResponseData {
  repository: {
    id: string;
    labels: {
      totalCount: number;
    };
  };
}

export interface LabelCountQueryVariables {
  name: string;
  owner: string;
}

export const GET_LABEL_COUNT = gql`
  query Labels($name: String!, $owner: String!) {
    repository(name: $name, owner: $owner) {
      id
      labels {
        totalCount
      }
    }
  }
`;

export interface LabelQueryResponseData {
  repository: {
    id: string;
    labels: {
      nodes: {
        id: string;
        name: string;
        color: string;
      }[];
    };
  };
}

export interface LabelQueryVariables {
  name: string;
  owner: string;
  labelCount: number;
}

export const GET_ALL_LABELS = gql`
  query Labels($name: String!, $owner: String!, $labelCount: Int!) {
    repository(name: $name, owner: $owner) {
      id
      labels(first: $labelCount) {
        nodes {
          name
          id
          color
        }
      }
    }
  }
`;
