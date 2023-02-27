import type { AppProps } from "next/app";
import Head from "next/head";
import { SessionProvider } from "next-auth/react";
import { MantineProvider } from "@mantine/core";
import { NotificationsProvider } from "@mantine/notifications";

import "@/styles/globals.css";
import type { Session } from "next-auth";
import { ApolloProvider } from "@apollo/client";
import client from "@/client";

interface MyAppProps extends AppProps {
  pageProps: {
    session: Session;
  };
}

const App = ({
  Component,
  pageProps: { session, ...pageProps },
}: MyAppProps) => {
  return (
    <>
      <Head>
        <title>task manager</title>
        <meta
          name="description"
          content="this is a task manager based on Github issues"
        />
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <SessionProvider session={session}>
        <ApolloProvider client={client}>
          <MantineProvider
            withGlobalStyles
            theme={{
              colorScheme: "dark",
            }}
          >
            <NotificationsProvider>
              <Component {...pageProps} />
            </NotificationsProvider>
          </MantineProvider>
        </ApolloProvider>
      </SessionProvider>
    </>
  );
};

export default App;
