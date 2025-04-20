// types/next-auth.d.ts
import NextAuth, { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      address: string;
    } & DefaultSession['user'];
  }
}
// types/next-auth.d.ts
import { JWT } from 'next-auth/jwt';

declare module 'next-auth/jwt' {
  interface JWT {
    idToken?: string;
  }
}
