import { PlayIcon, Settings2Icon, StopCircleIcon } from 'lucide-react';
import { useState } from 'react';

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
  useMarkSettingsAsChecked,
  useTermLookupIsStreaming,
  useTermLookupSetTerm,
  useTermLookupStopStreaming,
} from '../store';

import { TermLookupSettings } from './TermLookupSettings';
import { TermLookupSettingsCheckedMarker } from './TermLookupSettingsCheckedMarker';

export const TermLookupTextarea = () => {
  const [textareaValue, setTextAreaValue] = useState('');

  const setTerm = useTermLookupSetTerm();
  const streaming = useTermLookupIsStreaming();
  const markSettingsAsChecked = useMarkSettingsAsChecked();

  const stopStreaming = useTermLookupStopStreaming();

  const sendTerm = () => {
    setTerm(textareaValue);
    setTextAreaValue('');
  };

  // HOT TODO: cover with translations!
  // HOT TODO: add input limit

  return (
    <div>
      <InputGroup>
        {/* HOT TODO: add translation */}
        <InputGroupTextarea
          value={textareaValue}
          onChange={e => setTextAreaValue(e.target.value)}
          placeholder='Enter the word you want to learn...'
        ></InputGroupTextarea>

        {/* HOT TODO: add maximum input limit */}
        <InputGroupAddon align='block-end'>
          <div className='flex justify-between w-full'>
            <div className='flex items-end'>{textareaValue.length}/50</div>
            <div className='flex gap-1 items-center'>
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
