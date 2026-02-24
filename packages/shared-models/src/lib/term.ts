import z from 'zod';

export const TermSettingsSchema = z.object({
  includeTranslation: z.boolean().optional(),
  includeExamples: z.boolean().optional(),
  includeExplanation: z.boolean().optional(),
  hideTermInExamples: z.boolean().optional(),
  includeSynonyms: z.boolean().optional(),
  learningLanguage: z.string().optional(),
});

export type TermSettings = z.infer<typeof TermSettingsSchema>;
