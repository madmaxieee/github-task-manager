import { useState, useRef, useCallback, useEffect } from "react";
import {
  type IssueQueryResponseData,
  MORE_ISSUE_QUERY,
  FIRST_ISSUE_QUERY,
} from "@/client/queries";
import client from "@/client";
import { showNotification } from "@mantine/notifications";

export interface Issue {
  id: string;
  number: number;
  title: string;
  bodyHTML: string;
  closed: boolean;
  isPinned: boolean;
  url: string;
}

export default function useIssues(owner: string, repo: string, pageSize = 10) {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [totalIssues, setTotalIssues] = useState<number | null>(null);
  const fetchedIssueIDs = useRef<Set<string>>(new Set());

  const fetchMore = useCallback(async () => {
    if (!cursor) return;
    if (totalIssues && issues.length >= totalIssues) {
      return;
    }
    try {
      setLoading(true);
      const { data } = await client.query<IssueQueryResponseData>({
        query: MORE_ISSUE_QUERY,
        variables: {
          owner,
          name: repo,
          first: pageSize,
          after: cursor,
        },
      });
      const newIssues = data.repository.issues.edges
        .map((edge) => ({
          id: edge.node.id,
          number: edge.node.number,
          title: edge.node.title,
          bodyHTML: edge.node.bodyHTML,
          closed: edge.node.closed,
          isPinned: edge.node.isPinned,
          url: edge.node.url,
        }))
        .filter((issue) => {
          if (fetchedIssueIDs.current.has(issue.id)) {
            return false;
          }
          fetchedIssueIDs.current.add(issue.id);
          return true;
        });
      setIssues((currentIssues) => [...currentIssues, ...newIssues]);
      const newCursor = data.repository.issues.edges.slice(-1)[0]?.cursor;
      if (newCursor) {
        setCursor(newCursor);
      }
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
    setLoading(true);
    (async () => {
      const { data } = await client.query<IssueQueryResponseData>({
        query: FIRST_ISSUE_QUERY,
        variables: {
          owner,
          name: repo,
          first: pageSize,
        },
      });

      const newIssues = data.repository.issues.edges.map((edge) => ({
        id: edge.node.id,
        number: edge.node.number,
        title: edge.node.title,
        bodyHTML: edge.node.bodyHTML,
        closed: edge.node.closed,
        isPinned: edge.node.isPinned,
        url: edge.node.url,
      }));

      setIssues(newIssues);
      const newCursor = data.repository.issues.edges.slice(-1)[0]?.cursor;
      if (newCursor) {
        setCursor(newCursor);
      }
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
