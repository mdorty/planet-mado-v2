import { router } from '../trpc';
import { charactersRouter } from './characters';
import { usersRouter } from './users';

export const appRouter = router({
  characters: charactersRouter,
  users: usersRouter,
});

export type AppRouter = typeof appRouter;
