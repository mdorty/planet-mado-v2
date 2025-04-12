import { t } from './trpc';
import { mapsRouter } from './routers/maps';
import { charactersRouter } from './routers/characters';
import { usersRouter } from './routers/users';

export const appRouter = t.router({
  maps: mapsRouter,
  characters: charactersRouter,
  users: usersRouter,
});

export type AppRouter = typeof appRouter;
