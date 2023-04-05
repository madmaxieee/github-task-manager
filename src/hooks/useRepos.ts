import { useCallback, useEffect, useRef, useState } from "react";
import client from "@/client";
import {
  GET_FIRST_REPO,
  GET_MORE_REPOS,
  type RepoQueryResponseData,
  type FirstRepoQueryVariables,
  type MoreRepoQueryVariables,
} from "@/client/queries";
import { showNotification } from "@mantine/notifications";
import useLoginName from "./useLoginName";
import { useStore } from "zustand";
import store from "@/store";

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

export default function useRepos(pageSize = 10) {
  const [repos, setRepos] = useState<Repo[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [totalRepos, setTotalRepos] = useState<number | null>(null);
  const { loginName } = useLoginName();
  const fetchedRepoIDs = useRef<Set<string>>(new Set());
  const updateManyRepoData = useStore(
    store,
    (store) => store.updateManyRepoData
  );

  const fetchMore = useCallback(async () => {
    if (!loginName || !cursor) {
      return;
    }
    if (totalRepos && repos.length >= totalRepos) {
      return;
    }

    setLoading(true);
    try {
      const { data } = await client.query<
        RepoQueryResponseData,
        MoreRepoQueryVariables
      >({
        query: GET_MORE_REPOS,
        variables: {
          loginName,
          first: pageSize,
          after: cursor,
        },
      });

      const newRepos = data2repos(data).filter((repo) => {
        if (fetchedRepoIDs.current.has(repo.id)) {
          return false;
        }
        fetchedRepoIDs.current.add(repo.id);
        return true;
      });
      setRepos((prevRepos) => [...prevRepos, ...newRepos]);
      updateManyRepoData(
        newRepos.map((repo) => ({
          owner: repo.owner,
          name: repo.name,
          data: {
            id: repo.id,
          },
        }))
      );
      setCursor(getLastCursor(data));
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
  }, [
    loginName,
    cursor,
    totalRepos,
    repos.length,
    pageSize,
    updateManyRepoData,
  ]);

  useEffect(() => {
    if (!loginName) {
      return;
    }

    setLoading(true);
    (async () => {
      const { data } = await client.query<
        RepoQueryResponseData,
        FirstRepoQueryVariables
      >({
        query: GET_FIRST_REPO,
        variables: {
          loginName,
          first: pageSize,
        },
      });

      const repos = data2repos(data);
      setRepos(repos);
      updateManyRepoData(
        repos.map((repo) => ({
          owner: repo.owner,
          name: repo.name,
          data: {
            id: repo.id,
          },
        }))
      );
      setCursor(getLastCursor(data));
      setTotalRepos(data.user.repositories.totalCount!);
    })()
      .catch((err) => {
        console.error(err);
        showNotification({
          title: "Error",
          message: "Failed to fetch repositories",
          color: "red",
        });
      })
      .finally(() => {
        setLoading(false);
      });
  }, [loginName, pageSize, updateManyRepoData]);

  return {
    repos,
    loading,
    fetchMore,
  };
}

function data2repos(data: RepoQueryResponseData): Repo[] {
  return data.user.repositories.edges.map((edge) => ({
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
}

function getLastCursor(data: RepoQueryResponseData): string | null {
  return data.user.repositories.edges.slice(-1)[0]?.cursor ?? null;
}
