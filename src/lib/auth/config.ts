import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";
import { getUserByEmail } from "@/lib/queries/users";
import { verifyPassword } from "@/lib/auth/password";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      role: "super_admin";
    };
  }
  interface User {
    role: "super_admin";
  }
}

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const { handlers, signIn, signOut, auth } = NextAuth({
  trustHost: true,
  pages: {
    signIn: "/admin/login",
    error: "/admin/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60, // 7 days
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id!;
        token.role = (user as any).role;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id as string;
      session.user.role = token.role as "super_admin";
      return session;
    },
  },
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const parsed = credentialsSchema.safeParse(credentials);
        if (!parsed.success) return null;

        const user = await getUserByEmail(parsed.data.email);
        if (!user || !user.password_hash) return null;
        if (user.role !== "super_admin") return null;

        const valid = await verifyPassword(
          parsed.data.password,
          user.password_hash
        );
        if (!valid) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        };
      },
    }),
  ],
});
