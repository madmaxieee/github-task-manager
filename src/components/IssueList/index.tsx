import { type LegacyRef } from "react";
import useIssues from "@/hooks/useIssues";

import IssueListItem, { IssueListItemSkeletons } from "./IssueListItem";
import { Button } from "@mantine/core";

export interface IssueListProps {
  owner: string;
  repo: string;
}

export const IssueList = ({ owner, repo }: IssueListProps) => {
  const { issues, loading, fetchMore } = useIssues(owner, repo, 2);
  const bottomRef: LegacyRef<HTMLDivElement> = (element) => {
    if (element) {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry?.isIntersecting && !loading) {
            // fetchMore().catch(console.error);
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
        {issues.map((issue) => (
          <IssueListItem key={issue.id} issue={issue} />
        ))}
        {loading && <IssueListItemSkeletons count={10} />}
      </div>
      <div ref={bottomRef} />
    </>
  );
};

export default IssueList;
