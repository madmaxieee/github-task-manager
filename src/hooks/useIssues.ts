import { useState, useRef, useCallback, useEffect } from "react";
import { showNotification } from "@mantine/notifications";

import {
  GET_MORE_ISSUES,
  GET_FIRST_ISSUE,
  type IssueQueryResponseData,
  type FirstIssueQueryVariables,
  type MoreIssueQueryVariables,
} from "@/client/queries";
import {
  ADD_LABELS,
  REMOVE_LABELS,
  type AddLabelsMutationVariables,
  type AddLabelsMutationResponseData,
  type RemoveLabelsMutationResponseData,
  type RemoveLabelsMutationVariables,
} from "@/client/mutations";
import client from "@/client";

import {
  type DoneLabel,
  type InProgressLabel,
  type OpenLabel,
  type RequiredLabels,
} from "@/utils/labels";
export interface Issue {
  id: string;
  number: number;
  title: string;
  bodyHTML: string;
  closed: boolean;
  isPinned: boolean;
  url: string;
  label:
    | Omit<OpenLabel, "id">
    | Omit<InProgressLabel, "id">
    | Omit<DoneLabel, "id">;
}

export default function useIssues(
  owner: string | undefined,
  repo: string | undefined,
  labels: RequiredLabels | null,
  pageSize = 10
) {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [totalIssues, setTotalIssues] = useState<number | null>(null);
  const fetchedIssueIDs = useRef<Set<string>>(new Set());

  const fetchMore = useCallback(async () => {
    if (!cursor || !owner || !repo || !labels) {
      return;
    }
    if (totalIssues && issues.length >= totalIssues) {
      return;
    }

    setLoading(true);
    try {
      const { data } = await client.query<
        IssueQueryResponseData,
        MoreIssueQueryVariables
      >({
        query: GET_MORE_ISSUES,
        variables: {
          owner,
          name: repo,
          first: pageSize,
          after: cursor,
          labelCount: 3,
        },
      });

      const newIssues = data2issues(data, labels).filter((issue) => {
        if (fetchedIssueIDs.current.has(issue.id)) {
          return false;
        }
        fetchedIssueIDs.current.add(issue.id);
        return true;
      });
      setIssues((currentIssues) => [...currentIssues, ...newIssues]);
      setCursor(getLastCursor(data));
    } catch (error) {
      console.error(error);
      showNotification({
        title: "Error",
        message: "Failed to fetch more issues",
        color: "red",
      });
    } finally {
      setLoading(false);
    }
  }, [cursor, issues.length, labels, owner, pageSize, repo, totalIssues]);

  useEffect(() => {
    if (!owner || !repo || !labels) {
      return;
    }

    setLoading(true);
    (async () => {
      const { data } = await client.query<
        IssueQueryResponseData,
        FirstIssueQueryVariables
      >({
        query: GET_FIRST_ISSUE,
        variables: {
          owner,
          name: repo,
          first: pageSize,
          labelCount: 3,
        },
      });

      setIssues(data2issues(data, labels));
      setCursor(getLastCursor(data));
      setTotalIssues(data.repository.issues.totalCount);
    })()
      .catch((error) => {
        console.error(error);
        showNotification({
          title: "Error",
          message: "Failed to fetch issues",
          color: "red",
        });
      })
      .finally(() => {
        setLoading(false);
      });
  }, [labels, owner, pageSize, repo]);

  return {
    issues,
    loading,
    fetchMore,
  };
}

function data2issues(
  data: IssueQueryResponseData,
  requiredLabels: RequiredLabels
): Issue[] {
  return data.repository.issues.edges.map((edge) => {
    const labels = edge.node.labels.nodes;

    let label: Issue["label"];
    const toRemove = [];
    if (labels.some((l) => l.name === "done")) {
      if (labels.some((l) => l.name === "in progress")) {
        toRemove.push(requiredLabels.inProgress);
      }
      if (labels.some((l) => l.name === "open")) {
        toRemove.push(requiredLabels.open);
      }

      label = {
        name: "done",
        color: "0E8A16",
      };
    } else if (labels.some((l) => l.name === "in progress")) {
      if (labels.some((l) => l.name === "open")) {
        toRemove.push(requiredLabels.open);
      }
      label = {
        name: "in progress",
        color: "B60205",
      };
    } else {
      if (!labels.some((l) => l.name === "open")) {
        addLabelToIssue(requiredLabels.open, edge.node.id);
      }
      label = {
        name: "open",
        color: "1D76DB",
      };
    }
    if (toRemove.length > 0) removeLabelsFromIssue(toRemove, edge.node.id);

    return {
      id: edge.node.id,
      number: edge.node.number,
      title: edge.node.title,
      bodyHTML: edge.node.bodyHTML,
      closed: edge.node.closed,
      isPinned: edge.node.isPinned,
      url: edge.node.url,
      label,
    };
  });
}

function getLastCursor(data: IssueQueryResponseData): string | null {
  return data.repository.issues.edges.slice(-1)[0]?.cursor ?? null;
}

export function addLabelToIssue(
  label: OpenLabel | InProgressLabel | DoneLabel,
  issueID: string
) {
  client
    .mutate<AddLabelsMutationResponseData, AddLabelsMutationVariables>({
      mutation: ADD_LABELS,
      variables: {
        labelIds: [label.id],
        labelableId: issueID,
      },
    })
    .catch((error) => {
      console.error(error);
      showNotification({
        title: "Error",
        message: "Failed to add label to issue",
        color: "red",
      });
    });
}

export function removeLabelsFromIssue(
  labels: Array<OpenLabel | InProgressLabel | DoneLabel>,
  issueID: string
) {
  client
    .mutate<RemoveLabelsMutationResponseData, RemoveLabelsMutationVariables>({
      mutation: REMOVE_LABELS,
      variables: {
        labelIds: labels.map((label) => label.id),
        labelableId: issueID,
      },
    })
    .catch((error) => {
      console.error(error);
      showNotification({
        title: "Error",
        message: "Failed to remove labels from issue",
        color: "red",
      });
    });
}
