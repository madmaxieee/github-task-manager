import { gql } from "@apollo/client";

export interface AddLabelsMutationResponseData {
  addLabelsToLabelable: {
    clientMutationId: string;
  };
}

export interface AddLabelsMutationVariables {
  labelIds: string[];
  labelableId: string;
}

export const ADD_LABELS = gql`
  mutation AddLabel($labelIds: [ID!]!, $labelableId: ID!) {
    addLabelsToLabelable(
      input: { labelableId: $labelableId, labelIds: $labelIds }
    ) {
      clientMutationId
    }
  }
`;

export interface RemoveLabelsMutationResponseData {
  removeLabelsFromLabelable: {
    clientMutationId: string;
  };
}

export interface RemoveLabelsMutationVariables {
  labelIds: string[];
  labelableId: string;
}

export const REMOVE_LABELS = gql`
  mutation RemoveLabel($labelIds: [ID!]!, $labelableId: ID!) {
    removeLabelsFromLabelable(
      input: { labelableId: $labelableId, labelIds: $labelIds }
    ) {
      clientMutationId
    }
  }
`;

export interface UpdateIssueMutationResponseData {
  updateIssue: {
    clientMutationId: string;
  };
}

export interface UpdateIssueMutationVariables {
  input:
    | {
        id: string;
        title: string;
        body: string;
      }
    | {
        id: string;
        state: "OPEN" | "CLOSED";
      };
}

export const UPDATE_ISSUE = gql`
  mutation UpdateIssue($input: UpdateIssueInput!) {
    updateIssue(input: $input) {
      clientMutationId
    }
  }
`;
