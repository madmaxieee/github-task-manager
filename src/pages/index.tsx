import { type NextPage } from "next";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

import { Container } from "@mantine/core";

const Home: NextPage = () => {
  const router = useRouter();
  const { data: session } = useSession({
    required: true,
    onUnauthenticated: () => router.push("/signin"),
  });

  return (
    <Container className="pt-12">
      <h1>home</h1>
      <button
        onClick={() => {
          signOut().catch((err) => console.log(err));
        }}
      >
        sign out
      </button>
    </Container>
  );
};

export default Home;
