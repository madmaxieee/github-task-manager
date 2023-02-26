import { type NextPage } from "next";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  AppShell,
  Alert,
  Header,
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
import { useEffect } from "react";

const SignIn: NextPage = () => {
  // if signed in, redirect to home
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/");
    }
  });

  if (status === "loading" || status === "authenticated") {
    return (
      <AppShell header={<Header height={60}>header</Header>}>
        <Title align="center">Redirecting...</Title>
        <Center className="pt-12">
          <Loader />
        </Center>
      </AppShell>
    );
  }

  // you need to sign in with github to use this app
  return (
    <AppShell header={<Header height={60}>header</Header>}>
      <Container className="pt-12">
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
        <Stack className="pt-16">
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
                signIn("github").catch((err) => console.log(err));
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
