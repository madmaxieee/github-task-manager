import { type NextPage } from "next";

import { useSession, signIn, signOut } from "next-auth/react";
import { useQuery } from "@apollo/client";
import { TEST_QUERY } from "@/client/queries";

const Home: NextPage = () => {
  const { data: session, status } = useSession();
  const { data, loading, error } = useQuery(TEST_QUERY);
  console.log(data, loading, error);

  if (session === null) {
    return (
      <main className="">
        <h1>home</h1>
        <button
          onClick={() => {
            signIn("github", { redirect: false })
              .then((res) => console.log(res))
              .catch((err) => console.log(err));
          }}
        >
          sign in
        </button>
        <h1>{status}</h1>
      </main>
    );
  }
  return (
    <main className="">
      <h1>home</h1>
      <p>{JSON.stringify(session, null, 2)}</p>
      <button
        onClick={() => {
          signOut()
            .then((res) => console.log(res))
            .catch((err) => console.log(err));
        }}
      >
        sign out
      </button>
    </main>
  );
};

export default Home;
