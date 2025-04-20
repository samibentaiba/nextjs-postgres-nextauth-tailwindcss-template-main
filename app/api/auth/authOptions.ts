// authOptions.ts
import { NextAuthOptions } from "next-auth";
import GithubProvider from 'next-auth/providers/github';
export const authOptions: NextAuthOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
    }),
    // You can add more providers here
  ],
  pages: {
    signIn: '/login', // Optional: Custom sign-in page
  },
};

export default authOptions;
