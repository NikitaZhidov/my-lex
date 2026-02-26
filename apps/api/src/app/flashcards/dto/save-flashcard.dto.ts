import { createZodDto } from 'nestjs-zod';

import { SaveFlashCardSchema } from '@my-lex/shared-models';

export class SaveFlashcardDto extends createZodDto(SaveFlashCardSchema) {}
