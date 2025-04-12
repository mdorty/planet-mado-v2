import { z } from 'zod';
import { router, adminProcedure } from '../trpc';
import { hash } from 'bcrypt';

const userSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1),
  password: z.string().min(6).optional(),
  isAdmin: z.boolean(),
});

export const usersRouter = router({
  list: adminProcedure
    .query(async ({ ctx }) => {
      return await ctx.prisma.user.findMany({
        select: {
          id: true,
          name: true,
          email: true,
          isAdmin: true,
          createdAt: true,
          updatedAt: true,
        },
        orderBy: {
          name: 'asc'
        }
      });
    }),

  create: adminProcedure
    .input(userSchema)
    .mutation(async ({ ctx, input }) => {
      if (!input.password) {
        throw new Error('Password is required when creating a user');
      }

      const hashedPassword = await hash(input.password, 10);
      
      return await ctx.prisma.user.create({
        data: {
          email: input.email,
          name: input.name,
          password: hashedPassword,
          isAdmin: input.isAdmin,
        },
      });
    }),

  update: adminProcedure
    .input(z.object({
      id: z.string(),
      ...userSchema.shape
    }))
    .mutation(async ({ ctx, input }) => {
      const data: any = {
        email: input.email,
        name: input.name,
        isAdmin: input.isAdmin,
      };

      if (input.password) {
        data.password = await hash(input.password, 10);
      }

      return await ctx.prisma.user.update({
        where: { id: input.id },
        data,
      });
    }),

  delete: adminProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.user.delete({
        where: { id: input },
      });
    }),

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
