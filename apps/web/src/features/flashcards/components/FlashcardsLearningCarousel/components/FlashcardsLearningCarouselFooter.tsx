import { Check, Settings } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';

import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
  FieldLabel,
  Switch,
} from '@my-lex/ui';

import { useFlashcardsLearningCarouselStore } from '../hooks/useFlashcardsLearningCarouselStore';

import { FlashcardsLearningCarouselNavigationControls } from './FlashcardsLearningCarouselNavigationControls';
import { useDeleteFlashcardMutation } from '@/features/flashcards/hooks';

export const FlashcardsLearningCarouselFooter = () => {
  const t = useTranslations();

  const {
    activeFlashcards: flashcards,
    state,
    dispatch,
  } = useFlashcardsLearningCarouselStore();

  const { deleteCard, isLoading: isDeleting } = useDeleteFlashcardMutation();

  const flashcardId = useMemo(
    () => flashcards[state.activeIndex]?.id,
    [flashcards, state.activeIndex],
  );

  const deleteActiveFlashCard = () => deleteCard(flashcardId);

  const changeTrackProgress = (track: boolean) =>
    dispatch({ type: 'SET_TRACK_PROGRESS', track });

  const restartFlashcards = () => dispatch({ type: 'RESTART' });

  const setTermAsDefaultView = () =>
    dispatch({ type: 'SET_DEFAULT_VIEW', view: 'term' });
  const setDefinitionAsDefaultView = () =>
    dispatch({ type: 'SET_DEFAULT_VIEW', view: 'definition' });

  if (
    !flashcards ||
    flashcards.length === 0 ||
    state.activeIndex < 0 ||
    state.activeIndex >= flashcards.length
  ) {
    return <div className='h-9'></div>;
  }

  return (
    <div className='flex items-center gap-2 w-full justify-between'>
      <div className='w-1/3 pl-2'>
        <div className='flex items-center gap-1'>
          <Switch
            checked={state.trackProgress}
            onCheckedChange={changeTrackProgress}
            id='track-progress'
          />
          <FieldLabel htmlFor='track-progress'>{t('flashcards.learningCarousel.footer.trackProgress')}</FieldLabel>
        </div>
      </div>

      <FlashcardsLearningCarouselNavigationControls />

      <div className='w-1/3 flex justify-end pr-2'>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='outline' size='icon'>
              <Settings />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>{t('flashcards.learningCarousel.footer.defaultView')}</DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent>
                  <DropdownMenuItem onClick={setTermAsDefaultView}>
                    {state.defaultView === 'term' && <Check />}
                    {t('flashcards.learningCarousel.footer.term')}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={setDefinitionAsDefaultView}>
                    {state.defaultView === 'definition' && <Check />}
                    {t('flashcards.learningCarousel.footer.definition')}
                  </DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>

            <DropdownMenuItem onClick={restartFlashcards}>
              {t('flashcards.learningCarousel.footer.restart')}
            </DropdownMenuItem>

            {flashcardId && (
              <DropdownMenuItem
                disabled={isDeleting}
                onClick={deleteActiveFlashCard}
                variant='destructive'
              >
                {t('common.delete')}
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};
