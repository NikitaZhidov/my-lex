import { PlayIcon, Settings2Icon, StopCircleIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { KeyboardEvent, useState } from 'react';

import {
  Button,
  InputGroup,
  InputGroupAddon,
  InputGroupTextarea,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@my-lex/ui';

import {
  useTermLookupHandleTerm,
  useTermLookupIsStreaming,
  useTermLookupMarkSettingsAsChecked,
  useTermLookupSettings,
  useTermLookupStopStreaming,
} from '../store';

import { TermLookupSettings } from './TermLookupSettings';
import { TermLookupSettingsCheckedMarker } from './TermLookupSettingsCheckedMarker';

const MAX_LENGTH = 300;

export const TermLookupTextarea = () => {
  const t = useTranslations('terms.lookup');
  const [textareaValue, setTextAreaValue] = useState('');

  const setTerm = useTermLookupHandleTerm();
  const streaming = useTermLookupIsStreaming();
  const markSettingsAsChecked = useTermLookupMarkSettingsAsChecked();
  const settings = useTermLookupSettings();

  const stopStreaming = useTermLookupStopStreaming();

  const enterHandler = (e: KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();

      if (textareaValue && !streaming) {
        sendTerm();
      }
    }
  };

  const sendTerm = () => {
    const clearTextArea = textareaValue.trim();

    if (clearTextArea) {
      setTerm(clearTextArea);
    }

    setTextAreaValue('');
  };

  return (
    <div>
      <InputGroup className='bg-background'>
        <InputGroupTextarea
          maxLength={MAX_LENGTH}
          value={textareaValue}
          onChange={e => setTextAreaValue(e.target.value)}
          placeholder={t('placeholder')}
          onKeyDown={enterHandler}
        ></InputGroupTextarea>

        <InputGroupAddon align='block-end'>
          <div className='flex justify-between w-full'>
            <div className='flex items-end'>
              {textareaValue.length}/{MAX_LENGTH}
            </div>

            <div className='flex gap-1 items-center'>
              {settings.learningLanguage && (
                <div className='h-full flex items-center mt-1.5 mr-1 text-xs font-light'>
                  {settings.learningLanguage}
                </div>
              )}

              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    disabled={streaming}
                    onClick={markSettingsAsChecked}
                    size='icon'
                    type='submit'
                    variant='outline'
                    className='relative'
                  >
                    <Settings2Icon />

                    <TermLookupSettingsCheckedMarker className='absolute -top-0.5 -right-0.5' />
                  </Button>
                </PopoverTrigger>

                <PopoverContent>
                  <TermLookupSettings />
                </PopoverContent>
              </Popover>

              {streaming ? (
                <Button
                  variant='destructive'
                  onClick={stopStreaming}
                  size='icon'
                >
                  <StopCircleIcon />
                </Button>
              ) : (
                <Button
                  type='submit'
                  disabled={!textareaValue}
                  onClick={sendTerm}
                  size='icon'
                >
                  <PlayIcon />
                </Button>
              )}
            </div>
          </div>
        </InputGroupAddon>
      </InputGroup>
    </div>
  );
};
