import { z } from 'zod';
import { t, isAdmin } from '../trpc';

const mapInput = z.object({
  name: z.string(),
  gravityMultiplier: z.number(),
  exits: z.array(z.object({
    exitX: z.number(),
    exitY: z.number(),
    entryX: z.number(),
    entryY: z.number(),
    destinationMap: z.string(),
  })).optional(),
  tiles: z.array(z.object({
    x: z.number(),
    y: z.number(),
    tileType: z.string(),
    description: z.string().optional(),
    image: z.string().optional(),
    isBuilding: z.boolean(),
    buildingId: z.string().optional(),
    interior: z.object({
      x: z.number(),
      y: z.number(),
      tileType: z.string(),
      image: z.string().optional(),
      isExitTile: z.boolean(),
    }).optional(),
    items: z.array(z.object({
      quantity: z.number(),
      condition: z.number(),
      itemId: z.string(),
    })).optional(),
  })).optional(),
});

export const mapsRouter = t.router({
  list: t.procedure
    .use(isAdmin)
    .query(async ({ ctx }) => {
      const maps = await ctx.prisma.map.findMany({
        include: {
          exits: true,
          tiles: {
            include: {
              interior: true,
              items: {
                include: {
                  item: true,
                },
              },
            },
          },
        },
      });
      return maps;
    }),

  byId: t.procedure
    .use(isAdmin)
    .input(z.string())
    .query(async ({ ctx, input }) => {
      const map = await ctx.prisma.map.findUnique({
        where: { id: input },
        include: {
          exits: true,
          tiles: {
            include: {
              interior: true,
              items: {
                include: {
                  item: true,
                },
              },
            },
          },
        },
      });
      return map;
    }),

  create: t.procedure
    .use(isAdmin)
    .input(mapInput)
    .mutation(async ({ ctx, input }) => {
      const map = await ctx.prisma.map.create({
        data: {
          name: input.name,
          gravityMultiplier: input.gravityMultiplier,
          exits: {
            create: input.exits || [],
          },
          tiles: {
            create: input.tiles || [],
          },
        },
        include: {
          exits: true,
          tiles: {
            include: {
              interior: true,
              items: {
                include: {
                  item: true,
                },
              },
            },
          },
        },
      });
      return map;
    }),

  update: t.procedure
    .use(isAdmin)
    .input(z.object({
      id: z.string(),
      data: mapInput,
    }))
    .mutation(async ({ ctx, input }) => {
      const map = await ctx.prisma.map.update({
        where: { id: input.id },
        data: {
          name: input.data.name,
          gravityMultiplier: input.data.gravityMultiplier,
          exits: {
            deleteMany: {},
            create: input.data.exits || [],
          },
          tiles: {
            deleteMany: {},
            create: input.data.tiles || [],
          },
        },
        include: {
          exits: true,
          tiles: {
            include: {
              interior: true,
              items: {
                include: {
                  item: true,
                },
              },
            },
          },
        },
      });
      return map;
    }),

  delete: t.procedure
    .use(isAdmin)
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.map.delete({
        where: { id: input },
      });
      return true;
    }),
});
