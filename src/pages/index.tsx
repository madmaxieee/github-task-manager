import { type NextPage } from "next";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

import { Container, AppShell, Center, Loader, Button } from "@mantine/core";
import { IconLogout } from "@tabler/icons-react";
import Header from "@/components/Header";
import RepoList from "@/components/RepoList";

const Home: NextPage = () => {
  const router = useRouter();
  const { status } = useSession({
    required: true,
    onUnauthenticated: () => router.push("/signin"),
  });

  if (status !== "authenticated") {
    return (
      <AppShell header={<Header></Header>}>
        <Center className="h-full">
          <Loader />
        </Center>
      </AppShell>
    );
  }

  return (
    <AppShell
      header={
        <Header>
          <Button
            onClick={() => {
              signOut().catch(console.error);
            }}
            variant="outline"
            color="red"
            className="m-4"
            leftIcon={<IconLogout />}
          >
            Sign out
          </Button>
        </Header>
      }
    >
      <Container className="pt-4">
        <RepoList />
      </Container>
    </AppShell>
  );
};

export default Home;
