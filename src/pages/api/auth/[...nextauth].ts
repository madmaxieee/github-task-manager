import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";
import type { NextAuthOptions, DefaultSession } from "next-auth";
import type { DefaultJWT } from "next-auth/jwt";

import { env } from "@/env.mjs";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
    } & DefaultSession["user"];
    accessToken: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    id: string;
    accessToken: string;
  }
}

export const authOptions: NextAuthOptions = {
  session: {
    maxAge: 24 * 60 * 60, // 24 hours
  },
  providers: [
    GithubProvider({
      clientId: env.GITHUB_CLIENT_ID,
      clientSecret: env.GITHUB_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    session({ session, token }) {
      session.accessToken = token.accessToken;
      session.user.id = token.id;
      return session;
    },
    jwt({ token, user, account }) {
      if (account?.access_token) {
        token.accessToken = account.access_token;
      }
      if (user?.id) {
        token.id = user.id;
      }
      return token;
    },
  },
};

export default NextAuth(authOptions);
