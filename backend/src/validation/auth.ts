import { z } from 'zod';

const EMAIL_MAX = 254;
const PASSWORD_MAX = 256;

export const loginBodySchema = z.object({
  email: z.string().trim().min(1).max(EMAIL_MAX).email(),
  password: z.string().min(1).max(PASSWORD_MAX),
});

export const verifyBodySchema = z
  .object({
    token: z.string().max(16_000).optional(),
  })
  .strict();
