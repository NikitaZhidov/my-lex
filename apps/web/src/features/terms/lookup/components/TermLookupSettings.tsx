import {
  BookType,
  EyeOff,
  GlobeIcon,
  InfoIcon,
  LanguagesIcon,
  MessageCircleQuestion,
  PenLine,
} from 'lucide-react';
import { useTranslations } from 'next-intl';

import {
  Field,
  FieldGroup,
  FieldLabel,
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  Switch,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@my-lex/ui';

import { useTermLookupSettings, useTermLookupUpdateSettings } from '../store';

export const TermLookupSettings = () => {
  const t = useTranslations('terms.lookup');
  const settings = useTermLookupSettings();
  const updateSettings = useTermLookupUpdateSettings();

  return (
    <div>
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor='learning-language'>
            <GlobeIcon className='size-4' />
            {t('learningLanguage')}
          </FieldLabel>

          <InputGroup>
            <InputGroupInput
              value={settings.learningLanguage}
              onChange={e => updateSettings('learningLanguage', e.target.value)}
              id='learning-language'
              placeholder={t('learningLanguagePlaceholder')}
            />

            <InputGroupAddon align='inline-end'>
              <Tooltip>
                <TooltipTrigger>
                  <InfoIcon />
                </TooltipTrigger>

                <TooltipContent>{t('learningLanguageTooltip')}</TooltipContent>
              </Tooltip>
            </InputGroupAddon>
          </InputGroup>
        </Field>

        <Field orientation='horizontal'>
          <Switch
            id='include-explanation'
            checked={settings.includeExplanation}
            onCheckedChange={e => updateSettings('includeExplanation', e)}
          />
          <FieldLabel htmlFor='include-explanation'>
            <MessageCircleQuestion className='size-5' />
            {t('includeExplanation')}
          </FieldLabel>
        </Field>

        <Field orientation='horizontal'>
          <Switch
            id='include-translations'
            checked={settings.includeTranslation}
            onCheckedChange={e => updateSettings('includeTranslation', e)}
          />
          <FieldLabel htmlFor='include-translations'>
            <LanguagesIcon className='size-5' />
            {t('includeTranslation')}
          </FieldLabel>
        </Field>

        <Field orientation='horizontal'>
          <Switch
            id='include-synonyms'
            checked={settings.includeSynonyms}
            onCheckedChange={e => updateSettings('includeSynonyms', e)}
          />
          <FieldLabel htmlFor='include-synonyms'>
            <BookType className='size-5' />
            {t('includeSynonyms')}
          </FieldLabel>
        </Field>

        <Field orientation='horizontal'>
          <Switch
            id='include-examples'
            checked={settings.includeExamples}
            onCheckedChange={e => updateSettings('includeExamples', e)}
          />
          <FieldLabel htmlFor='include-examples'>
            <PenLine className='size-5' />
            {t('includeExamples')}
          </FieldLabel>
        </Field>

        {settings.includeExamples && (
          <Field orientation='horizontal'>
            <Switch
              id='hide-term-in-examples'
              checked={settings.hideTermInExamples}
              onCheckedChange={e => updateSettings('hideTermInExamples', e)}
            />
            <FieldLabel htmlFor='hide-term-in-examples'>
              <EyeOff className='size-5' />
              {t('hideTermInExamples')}
            </FieldLabel>
          </Field>
        )}
      </FieldGroup>
    </div>
  );
};
