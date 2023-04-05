import { useMutation, useQuery } from "@apollo/client";

import {
  CREATE_ISSUE,
  type CreateIssueMutationResponseData,
  type CreateIssueMutationVariables,
} from "@/client/mutations";
import {
  GET_REPO_ID,
  type RepoIDQueryResponseData,
  type RepoIDQueryVariables,
} from "@/client/queries";
import { showNotification } from "@mantine/notifications";
import { useStore } from "zustand";
import store from "@/store";
import { useRouter } from "next/navigation";
import { initializeLabels } from "@/utils/labels";
import { useSession } from "next-auth/react";

export default function useCreateIssue(owner: string, repo: string) {
  const [mutate, { loading: createIssueMutationLoading }] = useMutation<
    CreateIssueMutationResponseData,
    CreateIssueMutationVariables
  >(CREATE_ISSUE);

  const { data, loading: repoIDQueryLoading } = useQuery<
    RepoIDQueryResponseData,
    RepoIDQueryVariables
  >(GET_REPO_ID, {
    variables: {
      name: repo,
      owner,
    },
  });

  const labels = useStore(
    store,
    (store) => store.repoData[owner]?.[repo]?.labels ?? null
  );

  const router = useRouter();

  const { data: session } = useSession({
    required: true,
    onUnauthenticated: () => {
      router.push("/signin");
    },
  });

  const createIssue = async ({
    title,
    body,
  }: {
    title: string;
    body: string;
  }) => {
    if (!data) {
      showNotification({
        title: "Error",
        message: "Repository not found",
      });
      router.push("/");
      return;
    }

    if (!labels) {
      if (!session) {
        showNotification({
          title: "Error",
          message: "Session not found",
        });
        router.push("/");
        return;
      }

      initializeLabels(owner, repo, session.accessToken).catch(console.error);
      return;
    }

    const repositoryID = data.repository?.id;

    await mutate({
      variables: {
        input: {
          repositoryId: repositoryID,
          title,
          body,
          labelIds: [labels.open.id],
        },
      },
    });
  };

  return {
    loading: createIssueMutationLoading || repoIDQueryLoading,
    createIssue,
  };
}
