import { useMutation } from "@apollo/client";
import {
  CLOSE_ISSUE,
  type CloseIssueMutationVariables,
  type CloseIssueMutationResponseData,
} from "@/client/mutations";

export default function useCloseIssue(issueID: string) {
  const [mutate, { loading }] = useMutation<
    CloseIssueMutationResponseData,
    CloseIssueMutationVariables
  >(CLOSE_ISSUE);

  const closeIssue = async () => {
    await mutate({
      variables: {
        issueId: issueID,
      },
    });
  };

  const reopenIssue = async () => {
    await mutate({
      variables: {
        issueId: issueID,
      },
    });
  };

  return { loading, closeIssue, reopenIssue };
}
