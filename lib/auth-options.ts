// lib/auth-options.ts
import type { NextAuthOptions } from 'next-auth';
import GitHubProvider from 'next-auth/providers/github';

export const authOptions: NextAuthOptions = {
  providers: [
    GitHubProvider({
      clientId: process.env.AUTH_GITHUB_ID!,
      clientSecret: process.env.AUTH_GITHUB_SECRET!
    }),
  ],
  secret: process.env.AUTH_SECRET,
  pages: {
    signIn: '/login', // optional: redirect to custom login page
  },
  callbacks: {
    async session({ session, token }) {
      // Optionally attach more user info to session
      return session;
    },
    async jwt({ token }) {
      return token;
    }
  }
};
