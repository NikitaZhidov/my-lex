import { Flashcard } from '@my-lex/shared-models';

import { api } from '@/lib';

class FlashcardsService {
  async save(
    card: Pick<Flashcard, 'term' | 'definition' | 'id'>,
  ): Promise<Flashcard> {
    return api.post('/flashcards', card);
  }

  async getAll(): Promise<Flashcard[]> {
    return api.get('/flashcards');
  }
}

export const flashcardsService = new FlashcardsService();
