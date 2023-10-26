import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { MongoClient } from "mongodb";
const bcrypt = require("bcrypt");

export const authOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    jwt: true,
    maxAge: 30 * 24 * 60 * 60,
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",

      credentials: {
        email: {
          label: "Email",
          type: "text",
          placeholder: "bryan@wayko.com",
        },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials, req) {
        if (credentials.email == null || credentials.password == null)
          return null;

        const dbUrl = process.env.DATABASE_URL;
        const client = new MongoClient(dbUrl);

        try {
          await client.connect();
          const db = client.db(dbName);
          const collection = db.collection("admins");
          const user = await collection
            .find({
              email: credentials.email,
            })
            .toArray();
          await client.close();

          if (user == null) return null;

          let match = await bcrypt.compare(credentials.password, user.password);

          if (match) {
            return user;
          } else {
            return null;
          }
        } catch (err) {
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, profile }) {
      /*
      let userId = token?.sub;

      const currentTimeInSeconds = Math.floor(Date.now() / 1000);
      if (token.exp && token.exp <= currentTimeInSeconds) {
        throw new Error("Expired token");
      }

      try {
        const foundUser = await prisma.client.findUnique({
          where: {
            id: userId,
          },
        });

        if (!foundUser) {
          throw new Error("User not found");
        }
      } catch (err) {
        throw new Error("Database error: " + err.message);
      }
      */

      return token;
    },
    async session({ session, token, user }) {
      if (token) {
        session.user.id = token.sub;
      }

      const foundUser = await prisma.client.findUnique({
        where: {
          id: session.user.id,
        },
      });

      if (!foundUser) {
        throw new Error("User not found");
      }

      return session;
    },
  },
  pages: {
    signIn: "/",
  },
  debugger: true,
};
export default NextAuth(authOptions);
