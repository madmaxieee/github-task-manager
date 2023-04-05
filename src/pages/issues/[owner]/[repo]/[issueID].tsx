import { type NextPage } from "next";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import {
  Anchor,
  AppShell,
  Container,
  Divider,
  Space,
  Title,
} from "@mantine/core";
import { type IssuesPageQuery } from ".";
import Redirecting from "@/components/Redirecting";
import Header from "@/components/Header";
import SignOutButton from "@/components/SignOutButton";
import IssueEditor from "@/components/IssueEditor";
import useUpdateIssue from "@/hooks/useUpdateIssue";
import { showNotification } from "@mantine/notifications";
import Link from "next/link";
import { useStore } from "zustand";
import store from "@/store";

export interface EditIssuePageQuery extends IssuesPageQuery {
  issueID: string;
}

export const EditIssue: NextPage = () => {
  const router = useRouter();
  const { owner, repo, issueID } = router.query as EditIssuePageQuery;
  const { status } = useSession({
    required: true,
    onUnauthenticated: () => {
      router.push("/signin").catch(console.error);
    },
  });
  const { loading, editIssue } = useUpdateIssue(issueID);
  const issue = useStore(store, (state) => state.issues[issueID]);

  if (status !== "authenticated") {
    return <Redirecting />;
  }

  if (!issue) {
    router.push(`/issues/${owner}/${repo}`).catch(console.error);
    return <Redirecting />;
  }

  return (
    <AppShell
      header={
        <Header>
          <SignOutButton />
        </Header>
      }
    >
      <Container className="py-4">
        <Title order={2}>Edit Issue</Title>
        <Title order={3} color="dimmed">
          <Anchor component="span">
            <Link href="/">{owner}</Link>
          </Anchor>
          {" / "}
          <Anchor component="span">
            <Link href={`/issues/${owner}/${repo}`}>{repo}</Link>
          </Anchor>
        </Title>
        <Divider className="my-2" />
        <Space h="xl" />
        <IssueEditor
          handleSubmit={({ title, body }) => {
            editIssue({ title, body }).catch((err) => {
              console.error(err);
              showNotification({
                title: "Error",
                message: "There was an error updating the issue",
                color: "red",
              });
            });
          }}
          variant="edit"
          defaultTitle={issue.title}
          defaultBody={issue.bodyHTML}
          disabled={loading}
        />
      </Container>
    </AppShell>
  );
};

export default EditIssue;
