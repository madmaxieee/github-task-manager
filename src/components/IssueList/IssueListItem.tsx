import { useState } from "react";
import { type Issue } from "@/hooks/useIssues";
import { Paper, Skeleton, Space, Title, SegmentedControl } from "@mantine/core";
import {
  type RequiredLabels,
  type DoneLabel,
  type InProgressLabel,
  type OpenLabel,
} from "@/utils/labels";
import useMutateIssue from "@/hooks/useMutateIssue";
export interface IssueListIemProps {
  issue: Issue;
  labels: RequiredLabels;
}

type LabelName = (OpenLabel | InProgressLabel | DoneLabel)["name"];

export const IssueListItem = ({ issue, labels }: IssueListIemProps) => {
  const [label, setLabel] = useState<LabelName>(issue.label.name);
  const { loading, updateLabel } = useMutateIssue(issue);

  const handleLabelChange = (value: LabelName) => {
    setLabel(value);
    updateLabel(labels[value]).catch(console.error);
  };

  return (
    <Paper className="p-4" shadow="lg" withBorder radius="md">
      <SegmentedControl
        data={
          [
            { label: "Open", value: "open" },
            { label: "In Progress", value: "inProgress" },
            { label: "Done", value: "done" },
          ] satisfies Array<{
            label: string;
            value: LabelName;
          }>
        }
        color={
          label === "open" ? "blue" : label === "inProgress" ? "red" : "green"
        }
        value={label}
        disabled={loading}
        onChange={handleLabelChange}
      />
      <Space h="sm" />
      <div className="pl-8">
        <Title order={3} {...(label === "done" ? { color: "gray" } : {})}>
          {issue.title}
        </Title>
      </div>
    </Paper>
  );
};

export const IssueListItemSkeleton = () => {
  return (
    <Paper className="p-4" shadow="lg" withBorder radius="md">
      <Skeleton className="ml-1" height={32} width={200} radius="sm" />
      <Space h="sm" />
      <Skeleton className="ml-8" height={20} width={400} radius="sm" />
      <Space h="sm" />
      <Skeleton className="ml-8" height={12} width={300} radius="sm" />
    </Paper>
  );
};

export const IssueListItemSkeletons = ({ count = 10 }: { count: number }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <IssueListItemSkeleton key={index} />
      ))}
    </>
  );
};

export default IssueListItem;
