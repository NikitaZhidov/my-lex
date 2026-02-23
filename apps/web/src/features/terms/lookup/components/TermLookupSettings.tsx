import {
  BookType,
  GlobeIcon,
  InfoIcon,
  LanguagesIcon,
  MessageCircleQuestion,
  PenLine,
} from 'lucide-react';

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

// HOT TODO: cover it with translations!

export const TermLookupSettings = () => {
  const settings = useTermLookupSettings();
  const updateSettings = useTermLookupUpdateSettings();

  return (
    <div>
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor='learning-language'>
            <GlobeIcon className='size-4' />
            Learning language
          </FieldLabel>

          <InputGroup>
            <InputGroupInput
              value={settings.learningLanguage}
              onChange={e => updateSettings('learningLanguage', e.target.value)}
              id='learning-language'
              placeholder='Language you are learning...'
            />

            <InputGroupAddon align='inline-end'>
              <Tooltip>
                <TooltipTrigger>
                  <InfoIcon />
                </TooltipTrigger>

                <TooltipContent>
                  This will help the AI to provide better definition
                </TooltipContent>
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
            Include explanation
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
            Include translation
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
            Include synonyms
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
            Include examples
          </FieldLabel>
        </Field>
      </FieldGroup>
    </div>
  );
};
