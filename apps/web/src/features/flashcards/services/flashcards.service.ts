import { Flashcard } from '@my-lex/shared-models';

import { api, ApiError } from '@/lib';

class FlashcardsService {
  async save(
    card: Pick<Flashcard, 'term' | 'definition' | 'id'>,
  ): Promise<Flashcard> {
    const cleanTerm = (card.term ?? '').trim();

    if (!cleanTerm) {
      throw new ApiError(400, { message: 'validation.required' });
    }

    return api.post('/flashcards', card);
  }

  async delete(cardId: Flashcard['id']) {
    return api.delete<void>(`/flashcards/${cardId}`);
  }

  async getAll(): Promise<Flashcard[]> {
    return api.get('/flashcards');
  }
}

export const flashcardsService = new FlashcardsService();
