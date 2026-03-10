import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';

import { TermLookupTextarea } from './TermLookupTextarea';

const mockHandleTerm = jest.fn();
const mockStopStreaming = jest.fn();
const mockMarkSettingsAsChecked = jest.fn();

const mockUseIsStreaming = jest.fn();
const mockUseSettings = jest.fn();

jest.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}));

jest.mock('../store', () => ({
  useTermLookupHandleTerm: () => mockHandleTerm,
  useTermLookupIsStreaming: () => mockUseIsStreaming(),
  useTermLookupMarkSettingsAsChecked: () => mockMarkSettingsAsChecked,
  useTermLookupSettings: () => mockUseSettings(),
  useTermLookupStopStreaming: () => mockStopStreaming,
}));

jest.mock('./TermLookupSettings', () => ({
  TermLookupSettings: () => <div>TermLookupSettings</div>,
}));

jest.mock('./TermLookupSettingsCheckedMarker', () => ({
  TermLookupSettingsCheckedMarker: () => <span data-testid='settings-marker' />,
}));

describe('TermLookupTextarea (RTL integration)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseIsStreaming.mockReturnValue(false);
    mockUseSettings.mockReturnValue({ learningLanguage: '' });
  });

  it('submits term on Enter and clears textarea', () => {
    render(<TermLookupTextarea />);

    const textarea = screen.getByPlaceholderText('placeholder');
    fireEvent.change(textarea, { target: { value: '  hello world  ' } });
    fireEvent.keyDown(textarea, { key: 'Enter' });

    expect(mockHandleTerm).toHaveBeenCalledWith('hello world');
    expect(textarea).toHaveValue('');
  });

  it('does not submit on Shift+Enter', () => {
    render(<TermLookupTextarea />);

    const textarea = screen.getByPlaceholderText('placeholder');
    fireEvent.change(textarea, { target: { value: 'hello' } });
    fireEvent.keyDown(textarea, { key: 'Enter', shiftKey: true });

    expect(mockHandleTerm).not.toHaveBeenCalled();
    expect(textarea).toHaveValue('hello');
  });

  it('shows stop button while streaming and stops stream on click', () => {
    mockUseIsStreaming.mockReturnValue(true);
    const { container } = render(<TermLookupTextarea />);

    expect(container.querySelector('button[type="submit"]')).not.toBeInTheDocument();

    const stopButton = container.querySelector('button[data-variant="destructive"]');
    expect(stopButton).toBeInTheDocument();

    fireEvent.click(stopButton as Element);
    expect(mockStopStreaming).toHaveBeenCalledTimes(1);
  });

  it('marks settings as checked on settings click', () => {
    const { container } = render(<TermLookupTextarea />);
    const settingsButton = container.querySelector('button[data-variant="outline"]');

    expect(settingsButton).toBeInTheDocument();

    fireEvent.click(settingsButton as Element);
    expect(mockMarkSettingsAsChecked).toHaveBeenCalledTimes(1);
  });
});
