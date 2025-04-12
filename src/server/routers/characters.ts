import { z } from 'zod';
import { router, adminProcedure } from '../trpc';
import { TRPCError } from '@trpc/server';

const createCharacterSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  race: z.string().min(1, 'Race is required'),
  planet: z.string().nullable(),
  basePowerlevel: z.number().min(1, 'Base powerlevel must be at least 1'),
  description: z.string().nullable(),
  userId: z.string().min(1, 'User ID is required'),
});

export const charactersRouter = router({
  create: adminProcedure
    .input(createCharacterSchema)
    .mutation(async ({ ctx, input }) => {
      // For admin, we'll create a user if it doesn't exist
      let user = await ctx.prisma.user.findUnique({
        where: { id: input.userId },
      });

      if (!user) {
        user = await ctx.prisma.user.create({
          data: {
            id: input.userId,
            name: 'Admin User',
            email: 'admin@planetmado.com'
          }
        });
      }

      return ctx.prisma.character.create({
        data: {
          name: input.name,
          race: input.race,
          planet: input.planet,
          basePowerlevel: input.basePowerlevel,
          currentPowerlevel: input.basePowerlevel,
          description: input.description,
          userId: input.userId,
        },
      });
    }),

  list: adminProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(50),
        cursor: z.string().nullish(),
        search: z.string().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const limit = input.limit;
      const cursor = input.cursor;
      const search = input.search;

      const items = await ctx.prisma.character.findMany({
        take: limit + 1,
        where: search ? {
          OR: [
            { name: { contains: search } },
            { race: { contains: search } },
          ],
        } : undefined,
        cursor: cursor ? { id: cursor } : undefined,
        orderBy: { updatedAt: 'desc' },
        include: {
          user: {
            select: {
              name: true,
              email: true,
            },
          },
        },
      });

      let nextCursor: typeof cursor | undefined = undefined;
      if (items.length > limit) {
        const nextItem = items.pop();
        nextCursor = nextItem!.id;
      }

      return {
        items,
        nextCursor,
      };
    }),

  getById: adminProcedure
    .input(z.string().min(1, 'Character ID is required'))
    .query(async ({ ctx, input }) => {
      const character = await ctx.prisma.character.findUnique({
        where: { id: input },
        include: {
          user: {
            select: {
              name: true,
              email: true,
            },
          },
        },
      });

      if (!character) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Character not found',
        });
      }

      return character;
    }),

  update: adminProcedure
    .input(z.object({
      id: z.string().min(1, 'Character ID is required'),
      data: createCharacterSchema.partial(),
    }))
    .mutation(async ({ ctx, input }) => {
      const character = await ctx.prisma.character.findUnique({
        where: { id: input.id },
      });

      if (!character) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Character not found',
        });
      }

      return ctx.prisma.character.update({
        where: { id: input.id },
        data: input.data,
      });
    }),

  delete: adminProcedure
    .input(z.string().min(1, 'Character ID is required'))
    .mutation(async ({ ctx, input }) => {
      const character = await ctx.prisma.character.findUnique({
        where: { id: input },
      });

      if (!character) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Character not found',
        });
      }

      return ctx.prisma.character.delete({
        where: { id: input },
      });
    }),
});
