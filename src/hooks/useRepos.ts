import { useCallback, useEffect, useRef, useState } from "react";
import client from "@/client";
import {
  FIRST_REPO_QUERY,
  MORE_REPO_QUERY,
  type RepoQueryResponseData,
} from "@/client/queries";
import { showNotification } from "@mantine/notifications";
import useLoginName from "./useLoginName";

export interface Repo {
  id: string;
  name: string;
  owner: string;
  description: string;
  stargazerCount: number;
  hasIssuesEnabled: boolean;
  isPrivate: boolean;
  updatedAt: string;
  language?: {
    name: string;
    color: string;
  };
}

export default function useRepos(pageSize: number) {
  const [repos, setRepos] = useState<Repo[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [ended, setEnded] = useState(false);
  const { loginName } = useLoginName();
  const fetchedRepoIDs = useRef<Set<string>>(new Set());

  const fetchMore = useCallback(async () => {
    if (!loginName || !cursor) return;
    try {
      // don't fetch if we already fetched all repos
      setLoading(true);
      if (ended) {
        return;
      }
      const { data } = await client.query<RepoQueryResponseData>({
        query: MORE_REPO_QUERY,
        variables: {
          loginName,
          first: pageSize,
          after: cursor,
        },
      });
      const newRepos = data.user.repositories.edges
        .map((edge) => ({
          id: edge.node.id,
          name: edge.node.name,
          owner: edge.node.owner.login,
          description: edge.node.description,
          stargazerCount: edge.node.stargazerCount,
          hasIssuesEnabled: edge.node.hasIssuesEnabled,
          isPrivate: edge.node.isPrivate,
          updatedAt: edge.node.updatedAt,
          language: edge.node.languages.edges[0]?.node,
        }))
        .filter((repo) => {
          if (fetchedRepoIDs.current.has(repo.id)) {
            return false;
          }
          if (!repo.hasIssuesEnabled) {
            return false;
          }
          fetchedRepoIDs.current.add(repo.id);
          return true;
        });
      setRepos((prevRepos) => [...prevRepos, ...newRepos]);
      const newCursor = data.user.repositories.edges.slice(-1)[0]?.cursor;
      if (newCursor) {
        setCursor(newCursor);
      } else {
        setEnded(true);
      }
    } catch (error) {
      console.error(error);
      showNotification({
        title: "Error",
        message: "Failed to fetch repositories",
        color: "red",
      });
    } finally {
      setLoading(false);
    }
  }, [ended, loginName, pageSize, cursor]);

  useEffect(() => {
    if (!loginName) {
      return;
    }
    (async () => {
      const { data } = await client.query<RepoQueryResponseData>({
        query: FIRST_REPO_QUERY,
        variables: {
          loginName,
          first: pageSize,
        },
      });

      const newRepos = data.user.repositories.edges.map((edge) => ({
        id: edge.node.id,
        name: edge.node.name,
        owner: edge.node.owner.login,
        description: edge.node.description,
        stargazerCount: edge.node.stargazerCount,
        hasIssuesEnabled: edge.node.hasIssuesEnabled,
        isPrivate: edge.node.isPrivate,
        updatedAt: edge.node.updatedAt,
        language: edge.node.languages.edges[0]?.node,
      }));

      if (newRepos.length < pageSize) {
        setEnded(true);
      }

      const newCursor = data.user.repositories.edges.slice(-1)[0]?.cursor;
      if (newCursor) {
        setCursor(newCursor);
      }

      setRepos(newRepos);
    })().catch(console.error);
  }, [loginName, pageSize]);

  return {
    repos,
    loading,
    fetchMore,
    ended,
  };
}
