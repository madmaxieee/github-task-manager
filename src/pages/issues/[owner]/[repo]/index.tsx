import { useEffect } from "react";
import { type NextPage } from "next";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";

import { initializeLabels } from "@/utils/labels";

import {
  AppShell,
  Button,
  Container,
  Divider,
  Space,
  Title,
  Anchor,
} from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import Redirecting from "@/components/Redirecting";
import SignOutButton from "@/components/SignOutButton";
import Header from "@/components/Header";
import IssueList from "@/components/IssueList";
import { showNotification } from "@mantine/notifications";
import Link from "next/link";
import { useStore } from "zustand";
import store from "@/store";

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

  const updateRepoData = useStore(store, (store) => store.updateRepoData);
  const labels = useStore(
    store,
    (state) => state.repoData[owner]?.[repo]?.labels ?? null
  );

  useEffect(() => {
    if (!owner || !repo || !session) {
      return;
    }
    initializeLabels(owner, repo, session.accessToken)
      .then((labels) => {
        // setLabels(labels);
        updateRepoData({ owner, name: repo, data: { labels } });
      })
      .catch((err) => {
        console.error(err);
        showNotification({
          title: "Error",
          message: "Failed to initialize labels",
          color: "red",
        });
      });
  }, [owner, repo, session, updateRepoData]);

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
        <div className="flex justify-between">
          <Title order={2}>
            <Anchor component="span">
              <Link href="/">{owner}</Link>
            </Anchor>
            {" / "}
            {repo}
          </Title>
          <Link href={`/issues/${owner}/${repo}/new`}>
            <Button
              variant="outline"
              color="blue"
              leftIcon={<IconPlus size="1rem" />}
            >
              New Task
            </Button>
          </Link>
        </div>
        <Divider className="my-2" />
        <Space h="xl" />
        <IssueList owner={owner} repo={repo} labels={labels} />
      </Container>
    </AppShell>
  );
};

export default Issues;
