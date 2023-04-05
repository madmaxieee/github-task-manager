import { type NextPage } from "next";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { AppShell, Container, Divider, Space, Title } from "@mantine/core";
import { type IssuesPageQuery } from ".";
import Redirecting from "@/components/Redirecting";
import Header from "@/components/Header";
import SignOutButton from "@/components/SignOutButton";
import IssueEditor from "@/components/IssueEditor";
import useUpdateIssue from "@/hooks/useUpdateIssue";
import { showNotification } from "@mantine/notifications";

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

  if (status !== "authenticated") {
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
          {owner}/{repo}
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
          disabled={loading}
        />
      </Container>
    </AppShell>
  );
};

export default EditIssue;
