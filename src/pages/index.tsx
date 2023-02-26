import { type NextPage } from "next";

import { useSession, signIn, signOut } from "next-auth/react";

const Home: NextPage = () => {
  const { data: session, status } = useSession();

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
