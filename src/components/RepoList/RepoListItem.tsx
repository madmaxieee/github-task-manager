import type { Repo } from "@/hooks/useRepos";
import { Divider, Paper, Space, Text, Title, Skeleton } from "@mantine/core";

import { IconStarFilled } from "@tabler/icons-react";
import Link from "next/link";

export interface RepoListItemProps {
  repo: Repo;
}

export const RepoListItem = ({ repo }: RepoListItemProps) => {
  return (
    <Paper className="p-4" shadow="lg" withBorder radius="md">
      <div className="flex justify-between">
        <Link href={`/issues/${repo.owner}/${repo.name}`}>
          <Title className="hover:underline" order={3} color="blue.5">
            {repo.owner} / {repo.name}
          </Title>
        </Link>
        <div className="flex items-center gap-1">
          <IconStarFilled size={20} />
          <Text>{repo.stargazerCount}</Text>
        </div>
      </div>
      <Divider className="my-2" />
      {repo.description === null ? (
        <Text color="gray.7">No description</Text>
      ) : (
        <Text>{repo.description}</Text>
      )}
      <Space h="md" />
      <div className="flex gap-3">
        {repo.language && (
          <div className="flex items-center gap-1">
            <Paper
              className="h-4 w-4"
              bg={repo.language.color}
              radius="lg"
              withBorder
            />
            <Text color="gray.6" size="sm">
              {repo.language.name}
            </Text>
          </div>
        )}
        <Text color="gray.6" size="sm">
          {"Updated at "}
          {new Date(repo.updatedAt).toLocaleString("en-US", {
            dateStyle: "medium",
          })}
        </Text>
      </div>
    </Paper>
  );
};

export const RepoListItemSkeleton = () => {
  return (
    <Paper className="p-4" shadow="lg" withBorder radius="md">
      <div className="flex justify-between">
        <Title order={3} color="blue.5">
          <Skeleton width={200} height={16} />
        </Title>
        <div className="flex items-center gap-1">
          <IconStarFilled size={20} />
          <Text>
            <Skeleton width={20} height={16} />
          </Text>
        </div>
      </div>
      <Divider className="my-2" />
      <Skeleton width={400} height={12} />
      <Space h="xs" />
      <Skeleton width={400} height={12} />
      <Space h="xs" />
      <div className="flex gap-3">
        <div className="flex items-center gap-1">
          <Skeleton width={150} height={12} />
        </div>
        <Text color="gray.6" size="sm">
          <Skeleton width={200} />
        </Text>
      </div>
    </Paper>
  );
};

export const RepoListItemSkeletons = ({ count = 10 }: { count: number }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <RepoListItemSkeleton key={index} />
      ))}
    </>
  );
};

export default RepoListItem;
