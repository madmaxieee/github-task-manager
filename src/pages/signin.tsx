import { useEffect } from "react";
import { type NextPage } from "next";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";

import {
  AppShell,
  Alert,
  Button,
  Container,
  Space,
  Text,
  Center,
  Stack,
  Title,
  Loader,
} from "@mantine/core";
import { IconBrandGithub, IconAlertCircle } from "@tabler/icons-react";
import Header from "@/components/Header";

const SignIn: NextPage = () => {
  // if signed in, redirect to home
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/");
    }
  });

  if (status !== "unauthenticated") {
    return (
      <AppShell header={<Header></Header>}>
        <Center className="h-full">
          <Loader />
        </Center>
      </AppShell>
    );
  }

  // you need to sign in with github to use this app
  return (
    <AppShell header={<Header></Header>}>
      <Container className="pt-4">
        <Alert
          color="blue"
          title="You need to sign in with Github to use this app."
          icon={<IconAlertCircle />}
        >
          <Text>
            This app uses Github OAuth to authenticate users. You can sign in
            with Github by clicking the button below.
          </Text>
        </Alert>
        <Stack className="pt-12">
          <Center>
            <Image
              src="/assets/images/avatar.png"
              alt="avatar of madmaxieee, 莊加旭"
              width={150}
              height={150}
              className="rounded-2xl"
            />
          </Center>
          <Title align="center" order={3}>
            A task manager that tracks Github issues
          </Title>
          <Space h="xl" />
          <Center>
            <Button
              onClick={() => {
                signIn("github").catch(console.error);
              }}
              variant="default"
              size="lg"
              leftIcon={<IconBrandGithub />}
            >
              Sign in with Github
            </Button>
          </Center>
        </Stack>
      </Container>
    </AppShell>
  );
};

export default SignIn;
