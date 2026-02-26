import z from 'zod';

import { AuditEntity } from './id-entity';

export const FlashcardSchema = z.object({
  term: z
    .string({ error: 'validation.shouldBeString' })
    .nonempty({ error: 'validation.required' }),
  definition: z.string({ error: 'validation.shouldBeString' }),
});

export const SaveFlashCardSchema = FlashcardSchema.extend({
  id: z.string().optional(),
});

export type Flashcard = z.infer<typeof FlashcardSchema> & AuditEntity<string>;
