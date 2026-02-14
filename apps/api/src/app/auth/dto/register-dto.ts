import { createZodDto } from 'nestjs-zod';

import { CreateUserSchema } from '@my-lex/shared-models';

export class RegisterDto extends createZodDto(CreateUserSchema) {}
