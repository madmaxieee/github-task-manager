import { type NextPage } from "next";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";

import { AppShell, Container } from "@mantine/core";
import Redirecting from "@/components/Redirecting";
import SignOutButton from "@/components/SignOutButton";
import Header from "@/components/Header";

const Issues: NextPage = () => {
  const router = useRouter();
  const { owner, repo } = router.query;
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
        <h1>
          Issues for {owner}/{repo}
        </h1>
      </Container>
    </AppShell>
  );
};

export default Issues;
