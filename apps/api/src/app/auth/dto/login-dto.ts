import { createZodDto } from 'nestjs-zod';

import { LoginUserSchema } from '@my-lex/shared-models';

export class LoginDto extends createZodDto(LoginUserSchema) {}
