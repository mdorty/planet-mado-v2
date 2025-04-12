import { inferAsyncReturnType } from '@trpc/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/authOptions';
import { prisma } from '@/lib/prisma';
import { FetchCreateContextFnOptions } from '@trpc/server/adapters/fetch';

export async function createContext(opts?: FetchCreateContextFnOptions) {
  const session = opts?.req ? await getServerSession(authOptions) : null;

  return {
    session,
    prisma,
  };
}

export type Context = inferAsyncReturnType<typeof createContext>;
