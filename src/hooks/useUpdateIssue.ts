import { useMutation } from "@apollo/client";

import {
  UPDATE_ISSUE,
  type UpdateIssueMutationResponseData,
  type UpdateIssueMutationVariables,
} from "@/client/mutations";

export default function useUpdateIssue(issueID: string) {
  const [mutate, { loading }] = useMutation<
    UpdateIssueMutationResponseData,
    UpdateIssueMutationVariables
  >(UPDATE_ISSUE);

  const editIssue = async ({
    title,
    body,
  }: {
    title: string;
    body: string;
  }) => {
    await mutate({
      variables: {
        input: {
          id: issueID,
          title,
          body,
        },
      },
    });
  };

  const closeIssue = async () => {
    await mutate({
      variables: {
        input: {
          id: issueID,
          state: "CLOSED",
        },
      },
    });
  };

  const openIssue = async () => {
    await mutate({
      variables: {
        input: {
          id: issueID,
          state: "OPEN",
        },
      },
    });
  };

  return { loading, editIssue, closeIssue, openIssue };
}
