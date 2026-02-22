import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import bcrypt from 'bcrypt';
import { prisma } from './db';
import { z } from 'zod';

const SignInSchema = z.object({
  email: z.string({ invalid_type_error: 'Email must be a string.' }).email(),
  password: z.string({ invalid_type_error: 'Password must be a string.' }).min(6),
});

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = SignInSchema.safeParse(credentials);

        if (!parsedCredentials.success) {
          return null;
        }

        const { email, password } = parsedCredentials.data;

        const user = await prisma.user.findUnique({
          where: { email },
        });

        console.log(`[AUTH] Login attempt for: ${email}. Found user: ${!!user}`);

        if (!user) {
          console.warn(`[AUTH] User not found: ${email}`);
          throw new Error('UserNotFound');
        }

        const passwordsMatch = await bcrypt.compare(password, user.password);
        console.log(`[AUTH] Password match for ${email}: ${passwordsMatch}`);

        if (passwordsMatch) {
          return {
            id: user.id,
            email: user.email,
            name: user.name,
          };
        }

        throw new Error('WrongPassword');
      },
    }),
  ],
  pages: {
    signIn: '/login',
  },
  session: {
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
});
