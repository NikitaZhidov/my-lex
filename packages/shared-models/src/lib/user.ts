import { z } from 'zod';

import { IdEntity } from './id-entity';

export const CreateUserSchema = z
  .object({
    name: z
      .string({ error: 'validation.string.invalid' })
      .nonempty({ error: 'validation.required' }),

    email: z
      .email({ error: 'validation.email.invalid' })
      .nonempty({ error: 'validation.required' }),

    password: z
      .string({ error: 'validation.string.invalid' })
      .min(6, { error: 'validation.password.tooShort' }),

    passwordRepeat: z
      .string({ error: 'validation.string.invalid' })
      .min(6, { error: 'validation.passwordRepeat.tooShort' }),
  })
  .refine(data => data.password === data.passwordRepeat, {
    error: 'validation.password.notMatch',
    path: ['passwordRepeat'],
  });

export type CreateUser = z.infer<typeof CreateUserSchema>;

export const LoginUserSchema = z.object({
  email: z
    .email({ error: 'validation.email.invalid' })
    .nonempty({ error: 'validation.required' }),

  password: z
    .string({ error: 'validation.string.invalid' })
    .min(6, { error: 'validation.password.tooShort' }),
});

export type LoginUser = z.infer<typeof LoginUserSchema>;

export interface UserProfile extends IdEntity<string> {
  name: string;
  email: string;
  picture: string | null;
}
