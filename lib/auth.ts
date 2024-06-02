import { DrizzleAdapter } from "@auth/drizzle-adapter";
import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import { db } from "./db";
import type { Provider } from "next-auth/providers";

const providers: Provider[] = [GitHub];

export const providerMap = providers.map((provider) => {
  if (typeof provider === "function") {
    const providerData = provider();
    return { id: providerData.id, name: providerData.name };
  } else {
    return { id: provider.id, name: provider.name };
  }
});

export const { handlers, signIn, signOut, auth } = NextAuth({
  // @ts-ignore
  adapter: DrizzleAdapter(db),
  providers,
  pages: {
    signIn: "/signin",
  },
  callbacks: {
    async session({ session, user, token }: any) {
      return session;
    },
  },
});
