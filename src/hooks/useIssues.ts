import { useState, useRef, useCallback, useEffect } from "react";
import { showNotification } from "@mantine/notifications";

import {
  GET_MORE_ISSUES,
  GET_FIRST_ISSUE,
  type IssueQueryResponseData,
  type FirstIssueQueryVariables,
  type MoreIssueQueryVariables,
} from "@/client/queries";
import client from "@/client";

import {
  addLabelsToIssue,
  removeLabelsFromIssue,
  type Label,
  type DoneLabel,
  type InProgressLabel,
  type OpenLabel,
  type RequiredLabels,
} from "@/utils/labels";
import { useStore } from "zustand";
import store from "@/store";
export interface Issue {
  id: string;
  number: number;
  title: string;
  bodyHTML: string;
  closed: boolean;
  isPinned: boolean;
  url: string;
  label: OpenLabel | InProgressLabel | DoneLabel;
}

export default function useIssues(
  owner: string | undefined,
  repo: string | undefined,
  labels: RequiredLabels | null,
  pageSize = 10
) {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [totalIssues, setTotalIssues] = useState<number | null>(null);
  const fetchedIssueIDs = useRef<Set<string>>(new Set());
  const insertManyIssues = useStore(store, (state) => state.insertManyIssues);

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
      insertManyIssues(newIssues);
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
  }, [
    cursor,
    insertManyIssues,
    issues.length,
    labels,
    owner,
    pageSize,
    repo,
    totalIssues,
  ]);

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

      const issues = data2issues(data, labels);
      setIssues(issues);
      insertManyIssues(issues);
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
  }, [insertManyIssues, labels, owner, pageSize, repo]);

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
    const label = cleanUpIssueLabel(edge.node.id, labels, requiredLabels);

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

function cleanUpIssueLabel(
  issueID: string,
  labels: Label[],
  requiredLabels: RequiredLabels
) {
  let label: Issue["label"];
  const toRemove = [];
  if (labels.some((l) => l.name === "done")) {
    if (labels.some((l) => l.name === "in progress")) {
      toRemove.push(requiredLabels.inProgress);
    }
    if (labels.some((l) => l.name === "open")) {
      toRemove.push(requiredLabels.open);
    }

    label = requiredLabels.done;
  } else if (labels.some((l) => l.name === "in progress")) {
    if (labels.some((l) => l.name === "open")) {
      toRemove.push(requiredLabels.open);
    }
    label = requiredLabels.inProgress;
  } else {
    if (!labels.some((l) => l.name === "open")) {
      addLabelsToIssue(issueID, [requiredLabels.open]).catch((err) => {
        console.error(err);
        showNotification({
          title: "Error",
          message: "Failed to add label to issue",
          color: "red",
        });
      });
    }
    label = requiredLabels.open;
  }
  if (toRemove.length > 0) {
    removeLabelsFromIssue(issueID, toRemove).catch((err) => {
      console.error(err);
      showNotification({
        title: "Error",
        message: "Failed to remove labels from issue",
        color: "red",
      });
    });
  }
  return label;
}
