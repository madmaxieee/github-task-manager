import { gql } from "@apollo/client";

export const TEST_QUERY = gql`
  query MyQuery {
    repository(name: "LightDance-Editor", owner: "madmaxieee") {
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
