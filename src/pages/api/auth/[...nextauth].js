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
          const db = client.db("databASE");
          const collection = db.collection("users");

          const usersWithRoles = await collection
            .aggregate([
              {
                $match: {
                  email: credentials.email,
                },
              },
              {
                $lookup: {
                  from: "roles",
                  localField: "role",
                  foreignField: "_id",
                  as: "roleDetails",
                },
              },
              {
                $unwind: "$roleDetails",
              },
            ])
            .toArray();

          await client.close();

          if (usersWithRoles.length === 0) return null;

          const user = usersWithRoles[0];

          await client.close();

          if (user == null) return null;

          let match = await bcrypt.compare(credentials.password, user.password);

          let newUser = {
            name: user.username,
            email: user.email,
            role: user.roleDetails.name,
            image: "",
          };

          if (match) {
            return newUser;
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
      if (user) {
        token.role = user.role;
      }
      return token;
    },

    async session({ session, token, user }) {
      if (token) {
        session.user.role = token.role;
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
