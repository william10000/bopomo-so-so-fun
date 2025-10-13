import React, { useState, useEffect } from 'react';
import { Volume2, Home, Printer, Settings } from 'lucide-react';

type BopomofoType = 'starting' | 'ending';

interface SymbolItem {
  symbol: string;
  pinyin: string;
  sound: string;
  type: BopomofoType;
}

const BopomofoApp = () => {
  const [currentScreen, setCurrentScreen] = useState<'home' | 'symbols' | 'flashcards' | 'worksheet' | 'settings'>('home');
  const [currentSymbolIndex, setCurrentSymbolIndex] = useState<number>(0);
  const [currentFlashcard, setCurrentFlashcard] = useState<number>(0);
  const [symbolFilter, setSymbolFilter] = useState<'all' | 'starting' | 'ending'>('all');
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);

  useEffect(() => {
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      const chineseVoices = voices.filter(voice =>
        voice.lang.startsWith('zh') || voice.lang.includes('Chinese')
      );
      setAvailableVoices(chineseVoices);

      // Set default voice (prefer Taiwan/Traditional Chinese)
      if (chineseVoices.length > 0 && !selectedVoice) {
        const preferredVoice = chineseVoices.find(v => v.lang === 'zh-TW') ?? chineseVoices[0];
        if (preferredVoice) {
          setSelectedVoice(preferredVoice);
        }
      }
    };

    loadVoices();
    // Chrome loads voices asynchronously
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, [selectedVoice]);

  // ---------- UI Primitives ----------
  const cn = (...classes: Array<string | false | null | undefined>) =>
    classes.filter(Boolean).join(' ');

  type ButtonVariant =
    | 'primary'
    | 'neutral'
    | 'outline'
    | 'blue'
    | 'pink'
    | 'purple';

  type ButtonSize = 'lg' | 'md' | 'sm';

  interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
    size?: ButtonSize;
    block?: boolean;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
  }

  const Button: React.FC<ButtonProps> = ({
    variant = 'outline',
    size = 'md',
    block = false,
    leftIcon,
    rightIcon,
    className,
    children,
    ...props
  }) => {
    const sizeStyles =
      size === 'lg'
        ? 'h-16 px-8 text-2xl rounded-2xl'
        : size === 'sm'
        ? 'h-10 px-4 text-base rounded-xl'
        : 'h-12 px-6 text-lg rounded-2xl';

    const variantStyles = {
      primary:
        'bg-emerald-500 hover:bg-emerald-600 text-white shadow-[0_12px_30px_-12px_rgba(16,185,129,0.65)]',
      neutral: 'bg-gray-200 hover:bg-gray-300 text-gray-800',
      outline:
        'bg-white text-gray-900 ring-1 ring-black/10 hover:bg-gray-50',
      blue: 'bg-blue-500 hover:bg-blue-600 text-white shadow-[0_12px_30px_-12px_rgba(59,130,246,0.65)]',
      pink: 'bg-pink-500 hover:bg-pink-600 text-white shadow-[0_12px_30px_-12px_rgba(236,72,153,0.65)]',
      purple: 'bg-purple-600 hover:bg-purple-700 text-white shadow-[0_12px_30px_-12px_rgba(147,51,234,0.65)]'
    }[variant];

    return (
      <button
        className={cn(
          'inline-flex items-center justify-center gap-2 font-bold transition-all select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 focus-visible:ring-offset-2 active:translate-y-px disabled:opacity-50 disabled:pointer-events-none',
          sizeStyles,
          variantStyles,
          block && 'w-full',
          className
        )}
        {...props}
      >
        {leftIcon}
        <span>{children}</span>
        {rightIcon}
      </button>
    );
  };

  interface FilterChipProps {
    active?: boolean;
    onClick?: () => void;
    children?: React.ReactNode;
    className?: string;
  }

  const FilterChip: React.FC<FilterChipProps> = ({ active, onClick, children, className }) => (
    <button
      onClick={onClick}
      className={cn(
        'w-full sm:w-auto whitespace-normal break-words h-auto min-h-[3rem] px-5 py-3 rounded-full text-lg font-bold shadow-sm ring-1 transition-all text-center',
        active
          ? 'bg-purple-600 text-white ring-purple-600 shadow-[0_10px_25px_-12px_rgba(147,51,234,0.6)]'
          : 'bg-white text-purple-700 ring-purple-200 hover:bg-purple-50',
        className
      )}
    >
      {children}
    </button>
  );

  // Starting sounds (Initials/Consonants)
  const startingSounds: SymbolItem[] = [
    { symbol: 'ㄅ', pinyin: 'b', sound: 'bo', type: 'starting' },
    { symbol: 'ㄆ', pinyin: 'p', sound: 'po', type: 'starting' },
    { symbol: 'ㄇ', pinyin: 'm', sound: 'mo', type: 'starting' },
    { symbol: 'ㄈ', pinyin: 'f', sound: 'fo', type: 'starting' },
    { symbol: 'ㄉ', pinyin: 'd', sound: 'de', type: 'starting' },
    { symbol: 'ㄊ', pinyin: 't', sound: 'te', type: 'starting' },
    { symbol: 'ㄋ', pinyin: 'n', sound: 'ne', type: 'starting' },
    { symbol: 'ㄌ', pinyin: 'l', sound: 'le', type: 'starting' },
    { symbol: 'ㄍ', pinyin: 'g', sound: 'ge', type: 'starting' },
    { symbol: 'ㄎ', pinyin: 'k', sound: 'ke', type: 'starting' },
    { symbol: 'ㄏ', pinyin: 'h', sound: 'he', type: 'starting' },
    { symbol: 'ㄐ', pinyin: 'j', sound: 'ji', type: 'starting' },
    { symbol: 'ㄑ', pinyin: 'q', sound: 'qi', type: 'starting' },
    { symbol: 'ㄒ', pinyin: 'x', sound: 'xi', type: 'starting' },
    { symbol: 'ㄓ', pinyin: 'zh', sound: 'zhi', type: 'starting' },
    { symbol: 'ㄔ', pinyin: 'ch', sound: 'chi', type: 'starting' },
    { symbol: 'ㄕ', pinyin: 'sh', sound: 'shi', type: 'starting' },
    { symbol: 'ㄖ', pinyin: 'r', sound: 'ri', type: 'starting' },
    { symbol: 'ㄗ', pinyin: 'z', sound: 'zi', type: 'starting' },
    { symbol: 'ㄘ', pinyin: 'c', sound: 'ci', type: 'starting' },
    { symbol: 'ㄙ', pinyin: 's', sound: 'si', type: 'starting' }
  ];

  // Ending sounds (Finals/Vowels)
  const endingSounds: SymbolItem[] = [
    { symbol: 'ㄚ', pinyin: 'a', sound: 'a', type: 'ending' },
    { symbol: 'ㄛ', pinyin: 'o', sound: 'o', type: 'ending' },
    { symbol: 'ㄜ', pinyin: 'e', sound: 'e', type: 'ending' },
    { symbol: 'ㄝ', pinyin: 'ê', sound: 'eh', type: 'ending' },
    { symbol: 'ㄞ', pinyin: 'ai', sound: 'ai', type: 'ending' },
    { symbol: 'ㄟ', pinyin: 'ei', sound: 'ei', type: 'ending' },
    { symbol: 'ㄠ', pinyin: 'ao', sound: 'ao', type: 'ending' },
    { symbol: 'ㄡ', pinyin: 'ou', sound: 'ou', type: 'ending' },
    { symbol: 'ㄢ', pinyin: 'an', sound: 'an', type: 'ending' },
    { symbol: 'ㄣ', pinyin: 'en', sound: 'en', type: 'ending' },
    { symbol: 'ㄤ', pinyin: 'ang', sound: 'ang', type: 'ending' },
    { symbol: 'ㄥ', pinyin: 'eng', sound: 'eng', type: 'ending' },
    { symbol: 'ㄦ', pinyin: 'er', sound: 'er', type: 'ending' },
    { symbol: 'ㄧ', pinyin: 'i', sound: 'yi', type: 'ending' },
    { symbol: 'ㄨ', pinyin: 'u', sound: 'wu', type: 'ending' },
    { symbol: 'ㄩ', pinyin: 'ü', sound: 'yu', type: 'ending' }
  ];

  const bopomofoSymbols: SymbolItem[] = [...startingSounds, ...endingSounds];

  const getFilteredSymbols = (): SymbolItem[] => {
    if (symbolFilter === 'starting') return startingSounds;
    if (symbolFilter === 'ending') return endingSounds;
    return bopomofoSymbols;
  };

  // Simple everyday words for 4-year-olds
  const flashcards: { word: string; bopomofo: string; pinyin: string; english: string }[] = [
    { word: '媽媽', bopomofo: 'ㄇㄚ ㄇㄚ', pinyin: 'mā ma', english: 'Mom' },
    { word: '爸爸', bopomofo: 'ㄅㄚˋ ㄅㄚ˙', pinyin: 'bà ba', english: 'Dad' },
    { word: '水', bopomofo: 'ㄕㄨㄟˇ', pinyin: 'shuǐ', english: 'Water' },
    { word: '吃', bopomofo: 'ㄔ', pinyin: 'chī', english: 'Eat' },
    { word: '狗', bopomofo: 'ㄍㄡˇ', pinyin: 'gǒu', english: 'Dog' },
    { word: '貓', bopomofo: 'ㄇㄠ', pinyin: 'māo', english: 'Cat' },
    { word: '魚', bopomofo: 'ㄩˊ', pinyin: 'yú', english: 'Fish' },
    { word: '鳥', bopomofo: 'ㄋㄧㄠˇ', pinyin: 'niǎo', english: 'Bird' },
    { word: '手', bopomofo: 'ㄕㄡˇ', pinyin: 'shǒu', english: 'Hand' },
    { word: '腳', bopomofo: 'ㄐㄧㄠˇ', pinyin: 'jiǎo', english: 'Foot' },
    { word: '頭', bopomofo: 'ㄊㄡˊ', pinyin: 'tóu', english: 'Head' },
    { word: '眼', bopomofo: 'ㄧㄢˇ', pinyin: 'yǎn', english: 'Eye' },
    { word: '耳', bopomofo: 'ㄦˇ', pinyin: 'ěr', english: 'Ear' },
    { word: '口', bopomofo: 'ㄎㄡˇ', pinyin: 'kǒu', english: 'Mouth' },
    { word: '書', bopomofo: 'ㄕㄨ', pinyin: 'shū', english: 'Book' },
    { word: '車', bopomofo: 'ㄔㄜ', pinyin: 'chē', english: 'Car' },
    { word: '家', bopomofo: 'ㄐㄧㄚ', pinyin: 'jiā', english: 'Home' },
    { word: '飯', bopomofo: 'ㄈㄢˋ', pinyin: 'fàn', english: 'Rice/Meal' },
    { word: '牛', bopomofo: 'ㄋㄧㄡˊ', pinyin: 'niú', english: 'Cow' },
    { word: '羊', bopomofo: 'ㄧㄤˊ', pinyin: 'yáng', english: 'Sheep' }
  ];

  const speakChinese = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'zh-TW';
      utterance.rate = 0.8;
      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utterance);
    }
  };

  const HomeScreen = () => (
    <div className="min-h-screen bg-gradient-to-br from-amber-100 via-rose-100 to-fuchsia-100 p-6 md:p-10">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-end mb-6">
          <Button onClick={() => setCurrentScreen('settings')} leftIcon={<Settings size={22} />}>
            Voice Settings
          </Button>
        </div>
        
        <h1 className="text-5xl md:text-6xl font-bold text-center mb-2 text-purple-700">
          ㄅㄆㄇ・好好玩
        </h1>
        <p className="text-xl md:text-2xl text-center mb-10 text-purple-600">BoPoMo Super Fun!</p>
        
        <div className="space-y-8">
          <button
            onClick={() => setCurrentScreen('symbols')}
            className="w-full bg-white rounded-3xl p-10 shadow-2xl ring-1 ring-black/5 hover:shadow-[0_20px_50px_-12px_rgba(124,58,237,0.35)] transition-transform hover:-translate-y-0.5"
          >
            <div className="text-6xl mb-4 text-center">📚</div>
            <h2 className="text-3xl font-bold text-purple-700 mb-2 text-center">Learn Symbols</h2>
            <p className="text-lg text-gray-600 text-center">Practice ㄅㄆㄇ sounds</p>
          </button>

          <button
            onClick={() => setCurrentScreen('flashcards')}
            className="w-full bg-white rounded-3xl p-10 shadow-2xl ring-1 ring-black/5 hover:shadow-[0_20px_50px_-12px_rgba(236,72,153,0.35)] transition-transform hover:-translate-y-0.5"
          >
            <div className="text-6xl mb-4 text-center">🎴</div>
            <h2 className="text-3xl font-bold text-pink-700 mb-2 text-center">Flashcards</h2>
            <p className="text-lg text-gray-600 text-center">Learn everyday words</p>
          </button>

          <button
            onClick={() => setCurrentScreen('worksheet')}
            className="w-full bg-white rounded-3xl p-10 shadow-2xl ring-1 ring-black/5 hover:shadow-[0_20px_50px_-12px_rgba(59,130,246,0.35)] transition-transform hover:-translate-y-0.5"
          >
            <div className="text-6xl mb-4 text-center">📝</div>
            <h2 className="text-3xl font-bold text-blue-700 mb-2 text-center">Worksheets</h2>
            <p className="text-lg text-gray-600 text-center">Print practice sheets</p>
          </button>
        </div>
      </div>
    </div>
  );

  const SymbolScreen = () => {
    const filteredSymbols = getFilteredSymbols();
    let currentSymbol: SymbolItem | null = null;
    if (filteredSymbols.length > 0) {
      const clampedIndex = Math.min(Math.max(0, currentSymbolIndex), filteredSymbols.length - 1);
      currentSymbol = filteredSymbols[clampedIndex] ?? null;
    }

    const handleFilterChange = (newFilter: 'all' | 'starting' | 'ending') => {
      setSymbolFilter(newFilter);
      setCurrentSymbolIndex(0);
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-100 via-rose-100 to-fuchsia-100 p-6 md:p-10">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <Button onClick={() => setCurrentScreen('home')} leftIcon={<Home size={22} />}>
              Home
            </Button>
          </div>

          <div className="bg-white rounded-3xl p-8 md:p-14 shadow-2xl ring-1 ring-black/5 text-center">
            <h2 className="text-4xl font-bold text-purple-700 mb-6">Learn Symbols</h2>

            <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3 items-stretch sm:justify-center mb-8 px-2">
              <FilterChip active={symbolFilter === 'all'} onClick={() => handleFilterChange('all')}>
                All Symbols (37)
              </FilterChip>
              <FilterChip
                active={symbolFilter === 'starting'}
                onClick={() => handleFilterChange('starting')}
                className={! (symbolFilter === 'starting') ? 'text-blue-700 ring-blue-200 hover:bg-blue-50' : ''}
              >
                🚀 Starting Sounds (21)
              </FilterChip>
              <FilterChip
                active={symbolFilter === 'ending'}
                onClick={() => handleFilterChange('ending')}
                className={! (symbolFilter === 'ending') ? 'text-pink-600 ring-pink-200 hover:bg-pink-50' : ''}
              >
                🎯 Ending Sounds (16)
              </FilterChip>
            </div>

            {currentSymbol && (
              <div className={`rounded-3xl p-16 mb-8 ${
                currentSymbol.type === 'starting' 
                  ? 'bg-gradient-to-br from-blue-100 to-cyan-100' 
                  : 'bg-gradient-to-br from-pink-100 to-purple-100'
              }`}>
                <div className="text-9xl mb-6 font-bold text-purple-800">{currentSymbol.symbol}</div>
                <div className="text-4xl mb-4 text-gray-700">{currentSymbol.pinyin}</div>
                <div className="text-2xl text-gray-600">
                  {currentSymbol.type === 'starting' ? '🚀 Starting Sound' : '🎯 Ending Sound'}
                </div>
              </div>
            )}

            <div className="max-w-md mx-auto mb-8">
              <Button
                variant="primary"
                size="lg"
                block
                onClick={() => currentSymbol && speakChinese(currentSymbol.sound)}
                leftIcon={<Volume2 size={28} />}
              >
                Play Sound
              </Button>
            </div>

            <div className="grid grid-cols-3 gap-3 items-center max-w-xl mx-auto">
              <Button
                variant="neutral"
                onClick={() => setCurrentSymbolIndex(Math.max(0, currentSymbolIndex - 1))}
                disabled={currentSymbolIndex === 0}
              >
                ← Previous
              </Button>
              <div className="justify-self-center bg-purple-100 text-gray-900 px-5 py-3 rounded-full text-lg font-semibold min-w-[84px] text-center">
                {currentSymbolIndex + 1} / {filteredSymbols.length}
              </div>
              <Button
                variant="blue"
                onClick={() => setCurrentSymbolIndex(Math.min(filteredSymbols.length - 1, currentSymbolIndex + 1))}
                disabled={currentSymbolIndex === filteredSymbols.length - 1}
              >
                Next →
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const FlashcardScreen = () => {
    let card: (typeof flashcards)[number] | null = null;
    if (flashcards.length > 0) {
      const clamped = Math.min(Math.max(0, currentFlashcard), flashcards.length - 1);
      card = flashcards[clamped] ?? null;
    }

    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-100 via-rose-100 to-fuchsia-100 p-6 md:p-10">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <Button onClick={() => setCurrentScreen('home')} leftIcon={<Home size={22} />}>
              Home
            </Button>
          </div>

          <div className="bg-white rounded-3xl p-8 md:p-14 shadow-2xl ring-1 ring-black/5 text-center">
            <h2 className="text-4xl font-bold text-pink-700 mb-8">Flashcards</h2>
            
            {card && (
              <div className="bg-gradient-to-br from-pink-100 to-purple-100 rounded-3xl p-16 mb-8">
                <div className="text-8xl mb-6 font-bold text-gray-800">{card.word}</div>
                <div className="text-3xl mb-4 text-purple-700">{card.bopomofo}</div>
                <div className="text-2xl mb-2 text-gray-600">{card.pinyin}</div>
                <div className="text-3xl text-pink-600 font-bold">{card.english}</div>
              </div>
            )}

            <div className="max-w-md mx-auto mb-8">
              <Button
                variant="primary"
                size="lg"
                block
                onClick={() => card && speakChinese(card.word)}
                leftIcon={<Volume2 size={28} />}
              >
                Play Sound
              </Button>
            </div>

            <div className="grid grid-cols-3 gap-3 items-center max-w-xl mx-auto">
              <Button
                variant="neutral"
                onClick={() => setCurrentFlashcard(Math.max(0, currentFlashcard - 1))}
                disabled={currentFlashcard === 0}
              >
                ← Previous
              </Button>
              <div className="justify-self-center bg-purple-100 text-gray-900 px-5 py-3 rounded-full text-lg font-semibold min-w-[84px] text-center">
                {currentFlashcard + 1} / {flashcards.length}
              </div>
              <Button
                variant="pink"
                onClick={() => setCurrentFlashcard(Math.min(flashcards.length - 1, currentFlashcard + 1))}
                disabled={currentFlashcard === flashcards.length - 1}
              >
                Next →
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const WorksheetScreen = () => {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-100 via-rose-100 to-fuchsia-100 p-6 md:p-10">
        <div className="max-w-6xl mx-auto">
          <div className="flex gap-3 mb-6 print:hidden">
            <Button onClick={() => setCurrentScreen('home')} leftIcon={<Home size={22} />}>Home</Button>
            <Button variant="blue" onClick={() => window.print()} leftIcon={<Printer size={22} />}>Print Worksheet</Button>
          </div>

          <div className="bg-white rounded-3xl p-12 md:p-14 shadow-2xl ring-1 ring-black/5 print:shadow-none print:rounded-none">
            <h1 className="text-5xl font-bold text-center mb-2 text-blue-700">ㄅㄆㄇ・好好玩</h1>
            <p className="text-2xl text-center mb-2 text-purple-600">Practice Worksheet</p>
            <p className="text-center text-xl mb-8 text-gray-600">Name: ___________________  Date: ___________</p>

            <div className="mb-12">
              <h2 className="text-3xl font-bold mb-6 text-blue-700">Part 1A: Starting Sounds (Trace)</h2>
              <div className="grid grid-cols-6 gap-4 mb-8">
                {startingSounds.slice(0, 12).map((sym, idx) => (
                  <div key={idx} className="border-2 border-dashed border-blue-400 rounded-lg p-4 text-center bg-blue-50">
                    <div className="text-5xl text-gray-300 mb-2">{sym.symbol}</div>
                    <div className="text-4xl text-gray-400">____</div>
                  </div>
                ))}
              </div>

              <h2 className="text-3xl font-bold mb-6 text-pink-700">Part 1B: Ending Sounds (Trace)</h2>
              <div className="grid grid-cols-6 gap-4">
                {endingSounds.slice(0, 12).map((sym, idx) => (
                  <div key={idx} className="border-2 border-dashed border-pink-400 rounded-lg p-4 text-center bg-pink-50">
                    <div className="text-5xl text-gray-300 mb-2">{sym.symbol}</div>
                    <div className="text-4xl text-gray-400">____</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-12">
              <h2 className="text-3xl font-bold mb-6 text-pink-700">Part 2: Match the Words</h2>
              <div className="grid grid-cols-2 gap-6">
                {flashcards.slice(0, 8).map((card, idx) => (
                  <div key={idx} className="border-2 border-gray-300 rounded-lg p-6">
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="text-4xl font-bold mb-2">{card.word}</div>
                        <div className="text-xl text-gray-500">{card.bopomofo}</div>
                      </div>
                      <div className="text-2xl text-blue-600">{card.english}</div>
                    </div>
                    <div className="mt-4 border-t-2 border-dashed border-gray-300 pt-4">
                      <div className="text-gray-400">Practice writing: _______________</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-3xl font-bold mb-6 text-green-700">Part 3: Color and Learn</h2>
              <div className="mb-6">
                <h3 className="text-2xl font-bold mb-4 text-blue-600">🚀 Starting Sounds</h3>
                <div className="grid grid-cols-6 gap-4">
                  {startingSounds.slice(0, 6).map((sym, idx) => (
                    <div key={idx} className="border-4 border-blue-300 rounded-lg p-6 text-center bg-blue-50">
                      <div className="text-6xl font-bold text-gray-800 mb-2">{sym.symbol}</div>
                      <div className="text-lg text-gray-600">{sym.pinyin}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-4 text-pink-600">🎯 Ending Sounds</h3>
                <div className="grid grid-cols-6 gap-4">
                  {endingSounds.slice(0, 6).map((sym, idx) => (
                    <div key={idx} className="border-4 border-pink-300 rounded-lg p-6 text-center bg-pink-50">
                      <div className="text-6xl font-bold text-gray-800 mb-2">{sym.symbol}</div>
                      <div className="text-lg text-gray-600">{sym.pinyin}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-12 border-t-2 border-gray-300 pt-6 text-center text-gray-500">
              <p className="text-xl">Great job practicing! 加油！(Jiā yóu - Keep it up!)</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const VoiceSettingsScreen = () => {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-200 via-purple-200 to-pink-200 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <Button onClick={() => setCurrentScreen('home')} leftIcon={<Home size={22} />}>Home</Button>
          </div>

          <div className="bg-white rounded-3xl p-12 shadow-2xl">
            <h2 className="text-4xl font-bold text-purple-700 mb-8 text-center">🎙️ Voice Settings</h2>

            <div className="mb-8">
              <label className="block text-2xl font-bold text-gray-700 mb-4">
                Select Voice:
              </label>
              <select
                value={selectedVoice?.name || ''}
                onChange={(e) => {
                  const voice = availableVoices.find(v => v.name === e.target.value) || null;
                  setSelectedVoice(voice);
                }}
                className="w-full p-4 text-xl border-2 border-purple-300 rounded-xl focus:border-purple-500 focus:outline-none"
              >
                {availableVoices.length === 0 && (
                  <option>Loading voices...</option>
                )}
                {availableVoices.map((voice, index) => (
                  <option key={index} value={voice.name}>
                    {voice.name} ({voice.lang})
                  </option>
                ))}
              </select>
              {availableVoices.length === 0 && (
                <p className="mt-4 text-gray-600 text-lg">
                  No Chinese voices found. Your device may not have Chinese language support installed.
                </p>
              )}
            </div>

            {selectedVoice && (
              <div className="bg-purple-50 rounded-2xl p-8 mb-8">
                <h3 className="text-2xl font-bold text-gray-700 mb-4">Current Voice:</h3>
                <div className="space-y-2 text-lg">
                  <p><strong>Name:</strong> {selectedVoice.name}</p>
                  <p><strong>Language:</strong> {selectedVoice.lang}</p>
                  <p><strong>Quality:</strong> {selectedVoice.localService ? '🎯 High (Local)' : '☁️ Standard (Online)'}</p>
                </div>
              </div>
            )}

            <div className="space-y-4">
              <Button variant="primary" size="lg" block onClick={() => speakChinese('你好')} leftIcon={<Volume2 size={28} />}>
                Test Voice: "你好" (Hello)
              </Button>
              <Button variant="blue" size="lg" block onClick={() => speakChinese('ㄅㄆㄇㄈ')} leftIcon={<Volume2 size={28} />}>
                Test Voice: "ㄅㄆㄇㄈ"
              </Button>
              <Button variant="pink" size="lg" block onClick={() => speakChinese('媽媽爸爸')} leftIcon={<Volume2 size={28} />}>
                Test Voice: "媽媽爸爸"
              </Button>
            </div>

            <div className="mt-8 p-6 bg-yellow-50 rounded-2xl">
              <h4 className="text-xl font-bold text-gray-700 mb-2">💡 Tips for Better Voices:</h4>
              <ul className="space-y-2 text-lg text-gray-700">
                <li>• Look for voices labeled "Enhanced" or "Premium" for better quality</li>
                <li>• "zh-TW" is Traditional Chinese (Taiwan), "zh-CN" is Simplified Chinese</li>
                <li>• Local voices (🎯) work offline and sound more natural</li>
                <li>• On iOS/Mac, try "Meijia" or "Tingting" for Taiwan voices</li>
                <li>• You may need to download voices in your device's language settings</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div>
      {currentScreen === 'home' && <HomeScreen />}
      {currentScreen === 'symbols' && <SymbolScreen />}
      {currentScreen === 'flashcards' && <FlashcardScreen />}
      {currentScreen === 'worksheet' && <WorksheetScreen />}
      {currentScreen === 'settings' && <VoiceSettingsScreen />}
    </div>
  );
};

export default BopomofoApp;


