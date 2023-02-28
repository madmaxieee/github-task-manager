import { useEffect } from "react";
import { type NextPage } from "next";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import store from "@/store";

import { Container, AppShell, Title, Space, Divider } from "@mantine/core";
import Header from "@/components/Header";
import RepoList from "@/components/RepoList";
import Redirecting from "@/components/Redirecting";
import SignOutButton from "@/components/SignOutButton";

const Home: NextPage = () => {
  const router = useRouter();
  const { status, data: session } = useSession({
    required: true,
    onUnauthenticated: () => router.push("/signin"),
  });

  useEffect(() => {
    if (session) {
      store.getState().setSession(session);
    }
  }, [session]);

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
        <Title>Your Repos</Title>
        <Divider className="my-2" />
        <Space h="xl" />
        <RepoList />
      </Container>
    </AppShell>
  );
};

export default Home;
