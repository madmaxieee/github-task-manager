import { useState, useEffect } from "react";
import { type NextPage } from "next";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";

import { type RequiredLabels, initializeLabels } from "@/utils/labels";

import { AppShell, Container, Divider, Space, Title } from "@mantine/core";
import Redirecting from "@/components/Redirecting";
import SignOutButton from "@/components/SignOutButton";
import Header from "@/components/Header";
import IssueList from "@/components/IssueList";
import { showNotification } from "@mantine/notifications";

export interface IssuesPageQuery extends Record<string, string> {
  owner: string;
  repo: string;
}

const Issues: NextPage = () => {
  const router = useRouter();
  const { owner, repo } = router.query as IssuesPageQuery;
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated: () => {
      router.push("/signin").catch(console.error);
    },
  });
  const [labels, setLabels] = useState<RequiredLabels | null>(null);

  useEffect(() => {
    if (!owner || !repo || !session) {
      return;
    }
    initializeLabels(owner, repo, session.accessToken)
      .then((labels) => {
        setLabels(labels);
      })
      .catch((err) => {
        console.error(err);
        showNotification({
          title: "Error",
          message: "Failed to initialize labels",
          color: "red",
        });
      });
  }, [owner, repo, session]);

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
        <Title order={2}>
          {owner}/{repo}
        </Title>
        <Divider className="my-2" />
        <Space h="xl" />
        <IssueList owner={owner} repo={repo} labels={labels} />
      </Container>
    </AppShell>
  );
};

export default Issues;
