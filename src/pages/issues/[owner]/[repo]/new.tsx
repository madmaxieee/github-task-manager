import { AppShell, Container, Divider, Title } from "@mantine/core";

import Header from "@/components/Header";
import SignOutButton from "@/components/SignOutButton";

export const NewIssue = () => {
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
        <Divider className="my-2" />
      </Container>
    </AppShell>
  );
};

export default NewIssue;
