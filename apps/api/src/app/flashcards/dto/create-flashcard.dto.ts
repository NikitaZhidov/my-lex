import { createZodDto } from 'nestjs-zod';

import { FlashcardSchema } from '@my-lex/shared-models';

export class CreateFlashcardDto extends createZodDto(FlashcardSchema) {}
