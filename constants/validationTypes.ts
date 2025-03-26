import { z } from 'zod';

export const updateUserSchema = z.object({
    updates: z.object({
      fullname: z.object({
        firstName: z.string().max(14),
        lastName: z.string().max(14)
      }),
    }),
  });

  