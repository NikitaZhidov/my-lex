'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import {
  BookType,
  GlobeIcon,
  InfoIcon,
  LanguagesIcon,
  MessageCircleQuestion,
  PenLine,
  PlayIcon,
  SaveIcon,
  Settings2Icon,
  StopCircleIcon,
} from 'lucide-react';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import Markdown from 'react-markdown';

import { TermSettingsSchema } from '@my-lex/shared-models';
import {
  Button,
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
  Field,
  FieldGroup,
  FieldLabel,
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupTextarea,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Spinner,
  Switch,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@my-lex/ui';

import { useStreamDefinition } from '@/features/terms/hooks/useStreamDefinition';
import { useProfile } from '@/features/users/hooks';

// HOT TODO: remove use client later

// HOT TODO: save the user locale in the database and use it in the prompt (or just take it from the cookie)

// HOT TODO: hide the settings button for long texts
// HOT TODO: separate handler for long texts

export default function MainPage() {
  const { profile } = useProfile();

  // HOT TODO: SAVE THE SETTINGS IN THE LOCAL STORAGE
  const form = useForm({
    resolver: zodResolver(TermSettingsSchema),
    defaultValues: {
      includeExamples: true,
      includeExplanation: true,
      includeSynonyms: true,
      includeTranslation: true,
      learningLanguage: '',
    },
  });

  const {
    definition,
    handleTerm,
    stop,
    term: activeTerm,
    streaming,
  } = useStreamDefinition();

  const [textareaValue, setTextareaValue] = useState('');

  const sendTerm = () => {
    handleTerm(textareaValue, form.getValues());
    setTextareaValue('');
  };

  return (
    <div className='flex flex-auto'>
      <div className='max-w-4xl md:w-4xl mx-auto px-4 pt-4'>
        <div>
          {/* HOT TODO: add translation */}
          <div className='text-5xl mt-70 text-center'>
            Hello, {profile?.name?.split(' ')[0]}!
          </div>
          <div className='flex mt-8 w-full'>
            <div className='relative flex-auto'>
              {/* HOT TODO: use input group instead */}
              {/* HOT TODO: add enter handler */}
              <InputGroup>
                {/* HOT TODO: add translation */}
                <InputGroupTextarea
                  value={textareaValue}
                  onChange={e => setTextareaValue(e.target.value)}
                  placeholder='Enter the word you want to learn...'
                ></InputGroupTextarea>

                {/* HOT TODO: add maximum input limit */}
                <InputGroupAddon align='block-end'>
                  <div className='flex justify-between w-full'>
                    <div className='flex items-end'>
                      {textareaValue.length}/50
                    </div>
                    <div className='flex gap-1 items-center'>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            disabled={streaming}
                            size='icon'
                            type='submit'
                            variant='outline'
                          >
                            <Settings2Icon />
                          </Button>
                        </PopoverTrigger>

                        <PopoverContent>
                          <FieldGroup>
                            <Controller
                              control={form.control}
                              name='learningLanguage'
                              render={({ field }) => {
                                return (
                                  <Field>
                                    <FieldLabel htmlFor='learning-language'>
                                      <GlobeIcon className='size-4' />
                                      Learning language
                                    </FieldLabel>

                                    <InputGroup>
                                      <InputGroupInput
                                        {...field}
                                        id='learning-language'
                                        placeholder='Language you are learning...'
                                      />

                                      <InputGroupAddon align='inline-end'>
                                        <Tooltip>
                                          <TooltipTrigger>
                                            <InfoIcon />
                                          </TooltipTrigger>
                                          <TooltipContent>
                                            This will help the AI to provide
                                            better definition
                                          </TooltipContent>
                                        </Tooltip>
                                      </InputGroupAddon>
                                    </InputGroup>
                                  </Field>
                                );
                              }}
                            />

                            <Controller
                              control={form.control}
                              name='includeExplanation'
                              render={({ field }) => {
                                return (
                                  <Field orientation='horizontal'>
                                    <Switch
                                      id='include-explanation'
                                      checked={field.value}
                                      onCheckedChange={field.onChange}
                                    />
                                    <FieldLabel htmlFor='include-explanation'>
                                      <MessageCircleQuestion className='size-5' />
                                      Include explanation
                                    </FieldLabel>
                                  </Field>
                                );
                              }}
                            />

                            <Controller
                              control={form.control}
                              name='includeTranslation'
                              render={({ field }) => {
                                return (
                                  <Field orientation='horizontal'>
                                    <Switch
                                      id='include-translations'
                                      checked={field.value}
                                      onCheckedChange={field.onChange}
                                    />
                                    <FieldLabel htmlFor='include-translations'>
                                      <LanguagesIcon className='size-5' />
                                      Include translation
                                    </FieldLabel>
                                  </Field>
                                );
                              }}
                            />

                            <Controller
                              control={form.control}
                              name='includeSynonyms'
                              render={({ field }) => {
                                return (
                                  <Field orientation='horizontal'>
                                    <Switch
                                      id='include-synonyms'
                                      checked={field.value}
                                      onCheckedChange={field.onChange}
                                    />
                                    <FieldLabel htmlFor='include-synonyms'>
                                      <BookType className='size-5' />
                                      Include synonyms
                                    </FieldLabel>
                                  </Field>
                                );
                              }}
                            />

                            <Controller
                              control={form.control}
                              name='includeExamples'
                              render={({ field }) => {
                                return (
                                  <Field orientation='horizontal'>
                                    <Switch
                                      id='include-examples'
                                      checked={field.value}
                                      onCheckedChange={field.onChange}
                                    />
                                    <FieldLabel htmlFor='include-examples'>
                                      <PenLine className='size-5' />
                                      Include examples
                                    </FieldLabel>
                                  </Field>
                                );
                              }}
                            />
                          </FieldGroup>
                        </PopoverContent>
                      </Popover>
                      {streaming ? (
                        <Button
                          variant='destructive'
                          onClick={stop}
                          size={'icon'}
                        >
                          <StopCircleIcon />
                        </Button>
                      ) : (
                        <Button
                          type='submit'
                          disabled={!textareaValue}
                          onClick={sendTerm}
                          size={'icon'}
                        >
                          <PlayIcon />
                        </Button>
                      )}
                    </div>
                  </div>
                </InputGroupAddon>
              </InputGroup>
            </div>
          </div>

          <div className='mt-6 mb-10'>
            {activeTerm && (
              <Card>
                <CardHeader>
                  <CardTitle className='text-xl font-bold'>
                    {activeTerm}
                  </CardTitle>

                  <CardAction>
                    {streaming ? (
                      <Spinner className='size-8' />
                    ) : (
                      <Button size='icon'>
                        <SaveIcon />
                      </Button>
                    )}
                  </CardAction>
                </CardHeader>

                <CardContent className='prose dark:prose-invert'>
                  <Markdown>{definition}</Markdown>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
