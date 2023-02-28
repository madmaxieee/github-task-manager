import { useState } from "react";
import { type Issue } from "@/hooks/useIssues";
import {
  Checkbox,
  Collapse,
  Paper,
  Skeleton,
  Space,
  Title,
  TypographyStylesProvider,
} from "@mantine/core";
import { sanitize } from "dompurify";
export interface IssueListIemProps {
  issue: Issue;
}

export const IssueListItem = ({ issue }: IssueListIemProps) => {
  const [checked, setChecked] = useState(issue.closed);
  const [open, setOpen] = useState(false);

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(e.currentTarget.checked);
    if (e.currentTarget.checked) setOpen(false);
  };

  return (
    <Paper className="p-4" shadow="lg" withBorder radius="md">
      <div className="flex gap-4">
        <Checkbox
          className="py-1"
          checked={checked}
          onChange={handleCheckboxChange}
          color="gray"
        />
        <button
          className="text-left"
          onClick={() => setOpen((_open) => !_open)}
        >
          <Title order={3} {...(checked ? { color: "gray" } : {})}>
            {issue.title}
          </Title>
        </button>
      </div>
      <Collapse in={open}>
        <div className="px-12">
          <Space h="lg" />
          <TypographyStylesProvider>
            <div
              dangerouslySetInnerHTML={{ __html: sanitize(issue.bodyHTML) }}
            />
          </TypographyStylesProvider>
        </div>
      </Collapse>
    </Paper>
  );
};

export const IssueListItemSkeleton = () => {
  return (
    <Paper className="p-4" shadow="lg" withBorder radius="md">
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
