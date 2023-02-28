import { type Issue } from "@/hooks/useIssues";

export interface IssueListIemProps {
  issue: Issue;
}

export const IssueListItem = ({ issue }: IssueListIemProps) => {
  return <div>{JSON.stringify(issue)}</div>;
};

export const IssueListItemSkeletons = ({ count = 10 }: { count: number }) => {
  return <div>IssuesListIemSkeletons</div>;
};

export default IssueListItem;
