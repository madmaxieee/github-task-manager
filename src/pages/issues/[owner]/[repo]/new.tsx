import { AppShell, Container, Divider, Space, Title } from "@mantine/core";

import Header from "@/components/Header";
import SignOutButton from "@/components/SignOutButton";
import IssueEditor from "@/components/IssueEditor";
import { useRouter } from "next/router";
import { type IssuesPageQuery } from ".";
import { useSession } from "next-auth/react";
import Redirecting from "@/components/Redirecting";

export const NewIssue = () => {
  const router = useRouter();
  const { owner, repo } = router.query as IssuesPageQuery;
  const { status } = useSession({
    required: true,
    onUnauthenticated: () => {
      router.push("/signin").catch(console.error);
    },
  });

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
          {owner}/{repo}
        </Title>
        <Divider className="my-2" />
        <Space h="xl" />
        <IssueEditor
          handleSubmit={({ title, body }) => {
            console.log(title, body);
          }}
        />
      </Container>
    </AppShell>
  );
};

export default NewIssue;
