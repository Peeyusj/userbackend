import { db } from "@/db";
import { users } from "@/db/schemas";
import { eq } from "drizzle-orm";
import NextAuth from 'next-auth';
import { DrizzleAdapter } from "@auth/drizzle-adapter"
import CredentialsProvider from 'next-auth/providers/credentials';

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: 'jwt' },
  // @ts-ignore
  adapter: DrizzleAdapter(db),
  providers: [
    CredentialsProvider({
      name: 'Sign in',
      id: 'credentials',
      credentials: {
        email: {
          label: 'Email',
          type: 'email',
          placeholder: 'example@example.com',
        },
        password: { label: 'Password', type: 'password' },
      },
  // @ts-ignore
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          return null;
        }

        const user = await db.query.users.findFirst({
          where:eq(users.email,String(credentials.email))
        });

        if (
          !user ||
          credentials.password==user.password
          // !(await bcrypt.compare(String(credentials.password), user.password!))
        ) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.userName,
          randomKey: 'Hey cool',
        };
      },
    }),
  ],
  pages: {
    signIn: "/", 
  },
});