import { useMutation } from "@apollo/client";
import { UPDATE_ISSUE } from "@/client/mutations";

export default function useCloseIssue() {
  const [mutate, { loading }] = useMutation(UPDATE_ISSUE);

  const closeIssue = async (issueID: string) => {
    await mutate({
      variables: {
        input: {
          id: issueID,
          state: "CLOSED",
        },
      },
    });
  };

  const reopenIssue = async (issueID: string) => {
    await mutate({
      variables: {
        input: {
          id: issueID,
          state: "OPEN",
        },
      },
    });
  };

  return { loading, closeIssue, reopenIssue };
}
