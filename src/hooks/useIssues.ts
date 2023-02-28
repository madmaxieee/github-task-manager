import { useState, useRef, useCallback, useEffect } from "react";
import {
  GET_MORE_ISSUES,
  GET_FIRST_ISSUE,
  type IssueQueryResponseData,
  type FirstIssueQueryVariables,
  type MoreIssueQueryVariables,
} from "@/client/queries";
import client from "@/client";
import { showNotification } from "@mantine/notifications";
import { type RequiredLabels } from "@/utils/labels";

export interface Issue {
  id: string;
  number: number;
  title: string;
  bodyHTML: string;
  closed: boolean;
  isPinned: boolean;
  url: string;
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
    if (!cursor || !owner || !repo) {
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

      const newIssues = data2issues(data).filter((issue) => {
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
  }, [cursor, issues.length, owner, pageSize, repo, totalIssues]);

  useEffect(() => {
    if (!owner || !repo) {
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

      setIssues(data2issues(data));
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
  }, [owner, pageSize, repo]);

  return {
    issues,
    loading,
    fetchMore,
  };
}

function data2issues(data: IssueQueryResponseData): Issue[] {
  return data.repository.issues.edges.map((edge) => ({
    id: edge.node.id,
    number: edge.node.number,
    title: edge.node.title,
    bodyHTML: edge.node.bodyHTML,
    closed: edge.node.closed,
    isPinned: edge.node.isPinned,
    url: edge.node.url,
  }));
}

function getLastCursor(data: IssueQueryResponseData): string | null {
  return data.repository.issues.edges.slice(-1)[0]?.cursor ?? null;
}
