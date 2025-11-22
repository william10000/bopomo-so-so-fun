import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Minimal Web Speech API mocks for tests
type MockVoice = { name: string; lang: string; localService?: boolean };

const mockVoices: MockVoice[] = [
  { name: 'Meijia', lang: 'zh-TW', localService: true },
  { name: 'Tingting', lang: 'zh-CN', localService: false }
];

Object.defineProperty(window, 'speechSynthesis', {
  writable: true,
  value: {
    getVoices: vi.fn(() => mockVoices),
    speak: vi.fn(),
    cancel: vi.fn(),
    onvoiceschanged: undefined
  }
});

class MockUtterance {
  text: string;
  lang = '';
  rate = 1;
  voice: MockVoice | null = null;
  constructor(text: string) {
    this.text = text;
  }
}

// @ts-expect-error - provide global for tests
globalThis.SpeechSynthesisUtterance = MockUtterance;


