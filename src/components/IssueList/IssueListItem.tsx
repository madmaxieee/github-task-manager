import { useState } from "react";
import { sanitize } from "dompurify";
import { useRouter } from "next/router";

import { type Issue } from "@/hooks/useIssues";
import {
  Paper,
  Skeleton,
  Space,
  Title,
  SegmentedControl,
  TypographyStylesProvider,
  Divider,
  Collapse,
  UnstyledButton,
  ActionIcon,
} from "@mantine/core";
import {
  type RequiredLabels,
  type DoneLabel,
  type InProgressLabel,
  type OpenLabel,
} from "@/utils/labels";
import { IconEdit, IconTrash } from "@tabler/icons-react";
import useUpdateLabel from "@/hooks/useUpdateLabel";
import Link from "next/link";
import useCloseIssue from "@/hooks/useCloseIssue";
import { showNotification } from "@mantine/notifications";
export interface IssueListIemProps {
  issue: Issue;
  labels: RequiredLabels;
}

type LabelName = (OpenLabel | InProgressLabel | DoneLabel)["name"];

export const IssueListItem = ({ issue, labels }: IssueListIemProps) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [label, setLabel] = useState<LabelName>(issue.label.name);
  const { loading: updateLabelLoading, updateLabel } = useUpdateLabel(issue);
  const { closeIssue } = useCloseIssue(issue.id);

  const handleLabelChange = (value: LabelName) => {
    setLabel(value);
    updateLabel(labels[value]).catch(console.error);
  };

  return (
    <Paper className="p-4" shadow="lg" withBorder radius="md">
      <div className="flex w-full justify-between">
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
          disabled={updateLabelLoading}
          onChange={handleLabelChange}
        />
        <div className="flex items-center gap-2">
          <Link href={`${router.asPath}/${issue.id}`}>
            <ActionIcon className="p-1" color="blue" variant="filled">
              <IconEdit />
            </ActionIcon>
          </Link>
          <ActionIcon
            className="p-1"
            color="red"
            variant="filled"
            onClick={() => {
              closeIssue()
                .then(() => {
                  router.reload();
                  showNotification({
                    title: "Issue closed",
                    message: "The issue has been closed successfully.",
                    color: "green",
                  });
                })
                .catch(console.error);
            }}
          >
            <IconTrash />
          </ActionIcon>
        </div>
      </div>
      <Space h="sm" />
      <UnstyledButton onClick={() => setOpen((_open) => !_open)}>
        <Title
          className="pl-8"
          order={3}
          {...(label === "done" ? { color: "gray.6" } : {})}
        >
          {issue.title}
        </Title>
      </UnstyledButton>

      <Collapse in={open}>
        <Divider className="my-4" />
        <TypographyStylesProvider
          style={{
            ...(label === "done"
              ? { color: "var(--mantine-color-gray-6)" }
              : {}),
          }}
        >
          <div
            className="px-8"
            dangerouslySetInnerHTML={{ __html: sanitize(issue.bodyHTML) }}
          />
        </TypographyStylesProvider>
      </Collapse>
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
