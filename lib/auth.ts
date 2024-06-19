import { DrizzleAdapter } from "@auth/drizzle-adapter";
import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import { db } from "./db";
import type { Provider } from "next-auth/providers";
import { eq } from "drizzle-orm";
import { users } from "./schema";
import { uuidv7 } from "uuidv7";
import { nanoid } from "nanoid";

const providers: Provider[] = [
  GitHub({ checks: ["none"] }),
  Google({ checks: ["none"] }),
];

export const providerMap = providers.map((provider) => {
  if (typeof provider === "function") {
    const providerData = provider();
    return { id: providerData.id, name: providerData.name };
  } else {
    return { id: provider.id, name: provider.name };
  }
});

/**
 * this custom drizzle adapter is needed to create a random username on signup
 * https://github.com/nextauthjs/next-auth/discussions/562#discussioncomment-6589689
 * @param db
 * @returns
 */
// @ts-ignore
function CustomDrizzleAdapter(db) {
  const adapter = DrizzleAdapter(db);
  adapter.createUser = async (data) => {
    const user = await db.query.users.findFirst({
      where: eq(users.email, data.email),
    });

    if (user) {
      return user;
    }

    const randomUsername = "user_" + nanoid(12);

    const newUser = {
      id: uuidv7(),
      email: data.email,
      name: data.name,
      image: data.image,
      emailVerified: data.emailVerified,
      username: randomUsername,
    };

    await db.insert(users).values(newUser);
    return newUser;
  };
  return adapter;
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  // @ts-ignore
  adapter: CustomDrizzleAdapter(db),
  providers,
  pages: {
    signIn: "/signin",
  },
  callbacks: {
    async session({ session, user, token }: any) {
      session.username = user.username;
      return session;
    },
  },
  cookies: {
    pkceCodeVerifier: {
      name: "next-auth.pkce.code_verifier",
      options: {
        httpOnly: true,
        sameSite: "none",
        path: "/",
        secure: true,
      },
    },
  },
  session: {
    strategy: "database",
  },
  trustHost: true,
});
