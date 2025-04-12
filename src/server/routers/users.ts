import { z } from 'zod';
import { router, adminProcedure } from '../trpc';

export const usersRouter = router({
  search: adminProcedure
    .input(z.object({
      query: z.string().min(2, 'Search query must be at least 2 characters')
    }))
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.user.findMany({
        where: {
          OR: [
            { name: { contains: input.query, mode: 'insensitive' } },
            { email: { contains: input.query, mode: 'insensitive' } },
          ],
        },
        select: {
          id: true,
          name: true,
          email: true,
          isAdmin: true,
          characters: {
            select: {
              id: true,
              name: true
            }
          }
        }
      });
    })
});
