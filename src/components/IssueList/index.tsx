import { type LegacyRef } from "react";
import useIssues from "@/hooks/useIssues";

import { Center, Title } from "@mantine/core";
import IssueListItem, { IssueListItemSkeletons } from "./IssueListItem";
import { type RequiredLabels } from "@/utils/labels";

export interface IssueListProps {
  owner?: string;
  repo?: string;
  labels: RequiredLabels | null;
}

export const IssueList = ({ owner, repo, labels }: IssueListProps) => {
  const { issues, loading, fetchMore } = useIssues(owner, repo, labels, 10);
  const bottomRef: LegacyRef<HTMLDivElement> = (element) => {
    if (element) {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry?.isIntersecting && !loading) {
            fetchMore().catch(console.error);
          }
        },
        { threshold: 1 }
      );
      observer.observe(element);
    }
  };

  return (
    <>
      <div className="flex flex-col gap-4">
        {labels &&
          issues.map((issue) => (
            <IssueListItem key={issue.id} issue={issue} labels={labels} />
          ))}
        {!loading && issues.length === 0 && (
          <Center>
            <Title order={2} color="dimmed">
              No issues found.
            </Title>
          </Center>
        )}
        {(!labels || loading) && <IssueListItemSkeletons count={10} />}
      </div>
      <div ref={bottomRef} />
    </>
  );
};

export default IssueList;
