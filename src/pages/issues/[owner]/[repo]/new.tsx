import {
  Anchor,
  AppShell,
  Container,
  Divider,
  Space,
  Title,
} from "@mantine/core";

import Header from "@/components/Header";
import SignOutButton from "@/components/SignOutButton";
import IssueEditor from "@/components/IssueEditor";
import { useRouter } from "next/router";
import { type IssuesPageQuery } from ".";
import { useSession } from "next-auth/react";
import Redirecting from "@/components/Redirecting";
import useCreateIssue from "@/hooks/useCreateIssue";
import { showNotification } from "@mantine/notifications";
import Link from "next/link";

export const NewIssue = () => {
  const router = useRouter();
  const { owner, repo } = router.query as IssuesPageQuery;
  const { status } = useSession({
    required: true,
    onUnauthenticated: () => {
      router.push("/signin").catch(console.error);
    },
  });
  const { createIssue, loading } = useCreateIssue(owner, repo);

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
        <Title order={2}>New Issue</Title>
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
            createIssue({ title, body }).catch((err) => {
              console.error(err);
              showNotification({
                title: "Error",
                message: "There was an error creating the issue",
                color: "red",
              });
            });
          }}
          variant="create"
          disabled={loading}
        />
      </Container>
    </AppShell>
  );
};

export default NewIssue;
