import NextAuth, { NextAuthOptions } from "next-auth";
import { db } from "../db/db";
import { players } from "../db/schema";
import { eq } from "drizzle-orm";
import { generateUsername } from "unique-username-generator";

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    {
      id: "worldcoin",
      name: "Worldcoin",
      type: "oauth",
      wellKnown: "https://id.worldcoin.org/.well-known/openid-configuration",
      authorization: { params: { scope: "openid" } },
      clientId: process.env.WLD_CLIENT_ID,
      clientSecret: process.env.WLD_CLIENT_SECRET,
      idToken: true,
      checks: ["state", "nonce", "pkce"],
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.sub,
          verificationLevel:
            profile["https://id.worldcoin.org/v1"].verification_level,
        };
      },
    },
  ],
  callbacks: {
    async signIn({ user }) {
      console.log("signIn", user);
      return true;
    },
    async session({ session }) {
      // if (!session.user?.name) return session;
      // const player = await db.query.players.findFirst({
      //   where: eq(players.externalId, session.user.name),
      // });
      // if (!player) {
      //   const username = generateUsername();
      //   const [newPlayer] = await db
      //     .insert(players)
      //     .values({
      //       externalId: session.user.name,
      //       name: username,
      //     })
      //     .returning();
      //   return {
      //     ...session,
      //     user: {
      //       ...session.user,
      //       id: newPlayer.id,
      //       name: newPlayer.name,
      //     },
      //   };
      // }
      // console.log("session", session);
      return {
        ...session,
      };
    },
  },
  debug: process.env.NODE_ENV === "development",
};

const handler = NextAuth(authOptions);

export { handler };