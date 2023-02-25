import { gql } from "@apollo/client";

export const TEST_QUERY = gql`
  query MyQuery {
    repository(name: "LightDance-Editor", owner: "madmaxieee") {
      id
    }
  }
`;
