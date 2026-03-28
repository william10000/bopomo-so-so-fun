import React, { useState, useEffect } from 'react';
import { Volume2, Home, Printer, Settings } from 'lucide-react';
import { games } from './constants/games';

export type BopomofoType = "starting" | "ending";

export interface SymbolItem {
  symbol: string;
  pinyin: string;
  sound: string;
  type: BopomofoType;
  lessons: number[];
  video: string;
}

// ---------- UI Primitives ----------
export const cn = (...classes: Array<string | false | null | undefined>) =>
  classes.filter(Boolean).join(" ");

export type ButtonVariant =
  | "primary"
  | "neutral"
  | "outline"
  | "blue"
  | "pink"
  | "purple";

export type ButtonSize = "lg" | "md" | "sm";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  block?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = "outline",
  size = "md",
  block = false,
  leftIcon,
  rightIcon,
  className,
  children,
  ...props
}) => {
  const sizeStyles =
    size === "lg"
      ? "h-16 px-8 text-2xl rounded-2xl"
      : size === "sm"
      ? "h-10 px-4 text-base rounded-xl"
      : "h-12 px-6 text-lg rounded-2xl";

  const variantStyles = {
    primary:
      "bg-emerald-500 hover:bg-emerald-600 text-white shadow-[0_12px_30px_-12px_rgba(16,185,129,0.65)]",
    neutral: "bg-gray-200 hover:bg-gray-300 text-gray-800",
    outline: "bg-white text-gray-900 ring-1 ring-black/10 hover:bg-gray-50",
    blue: "bg-blue-500 hover:bg-blue-600 text-white shadow-[0_12px_30px_-12px_rgba(59,130,246,0.65)]",
    pink: "bg-pink-500 hover:bg-pink-600 text-white shadow-[0_12px_30px_-12px_rgba(236,72,153,0.65)]",
    purple:
      "bg-purple-600 hover:bg-purple-700 text-white shadow-[0_12px_30px_-12px_rgba(147,51,234,0.65)]",
  }[variant];

  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 font-bold transition-all select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 focus-visible:ring-offset-2 active:translate-y-px disabled:opacity-50 disabled:pointer-events-none",
        sizeStyles,
        variantStyles,
        block && "w-full",
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

export interface FilterChipProps {
  active?: boolean;
  onClick?: () => void;
  children?: React.ReactNode;
  className?: string;
}

export const FilterChip: React.FC<FilterChipProps> = ({
  active,
  onClick,
  children,
  className,
}) => (
  <button
    onClick={onClick}
    className={cn(
      "w-full sm:w-auto whitespace-normal break-words h-auto min-h-[3rem] px-5 py-3 rounded-full text-lg font-bold shadow-sm ring-1 transition-all text-center",
      active
        ? "bg-purple-600 text-white ring-purple-600 shadow-[0_10px_25px_-12px_rgba(147,51,234,0.6)]"
        : "bg-white text-purple-700 ring-purple-200 hover:bg-purple-50",
      className
    )}
  >
    {children}
  </button>
);

export const ScreenLayout = ({
  children,
  className = "p-2 md:p-4",
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div
    className={`min-h-screen bg-gradient-to-br from-amber-100 via-rose-100 to-fuchsia-100 ${className}`}
  >
    {children}
  </div>
);

export const Card = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div className={`bg-white rounded-3xl shadow-2xl ring-1 ring-black/5 ${className}`}>
    {children}
  </div>
);

const BopomofoApp = () => {
  const [currentScreen, setCurrentScreen] = useState<
    "home" | "symbols" | "flashcards" | "worksheet" | "settings" | "games"
  >("home");
  const [currentSymbolIndex, setCurrentSymbolIndex] = useState<number>(0);
  const [currentFlashcard, setCurrentFlashcard] = useState<number>(0);
  const [symbolFilter, setSymbolFilter] = useState<
    "all" | "starting" | "ending"
  >("all");
  const [availableVoices, setAvailableVoices] = useState<
    SpeechSynthesisVoice[]
  >([]);
  const [selectedVoice, setSelectedVoice] =
    useState<SpeechSynthesisVoice | null>(null);

  useEffect(() => {
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      const chineseVoices = voices.filter(
        (voice) => voice.lang.startsWith("zh") || voice.lang.includes("Chinese")
      );
      setAvailableVoices(chineseVoices);

      // Set default voice (prefer Taiwan/Traditional Chinese)
      if (chineseVoices.length > 0 && !selectedVoice) {
        const preferredVoice =
          chineseVoices.find((v) => v.lang === "zh-TW") ?? chineseVoices[0];
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

  // Starting sounds (Initials/Consonants)
  const startingSounds: SymbolItem[] = [
    {
      symbol: "ㄅ",
      pinyin: "b",
      sound: "bo",
      type: "starting",
      video: "https://youtu.be/VO6jJSFtNHQ?si=Bd604EXZc2-40Jwz",
      lessons: [1],
    },
    {
      symbol: "ㄆ",
      pinyin: "p",
      sound: "po",
      type: "starting",
      video: "https://youtu.be/byFIqPItUkU?si=NeMshH7BubGGlH9d",
      lessons: [3],
    },
    {
      symbol: "ㄇ",
      pinyin: "m",
      sound: "mo",
      type: "starting",
      video: "https://youtu.be/8ufJzeoG4zU?si=MKXm0gvHBN1jg2dX",
      lessons: [1],
    },
    {
      symbol: "ㄈ",
      pinyin: "f",
      sound: "fo",
      type: "starting",
      video: "https://youtu.be/UHi5tT677WU?si=dK1AnOwvl5TFXyzJ",
      lessons: [9],
    },
    {
      symbol: "ㄉ",
      pinyin: "d",
      sound: "de",
      type: "starting",
      video: "https://youtu.be/7BU9GAk8P4U?si=dZ-CvjMtrW7wVMZO",
      lessons: [2],
    },
    {
      symbol: "ㄊ",
      pinyin: "t",
      sound: "te",
      type: "starting",
      video: "https://youtu.be/Wa4VUZbZdec?si=m7uMOGJ5ZZjp1_-7",
      lessons: [6],
    },
    {
      symbol: "ㄋ",
      pinyin: "n",
      sound: "ne",
      type: "starting",
      video: "https://youtu.be/ZVfmPI818os?si=W63DoshsuH18chdp",
      lessons: [8],
    },
    {
      symbol: "ㄌ",
      pinyin: "l",
      sound: "le",
      type: "starting",
      video: "https://youtu.be/s_62vhLhQc4?si=XLcTjau-r6p06FXo",
      lessons: [5],
    },
    {
      symbol: "ㄍ",
      pinyin: "g",
      sound: "ge",
      type: "starting",
      video: "https://youtu.be/2oxlqFmmbnQ?si=cr5EpUayYwVKLcKJ",
      lessons: [2],
    },
    {
      symbol: "ㄎ",
      pinyin: "k",
      sound: "ke",
      type: "starting",
      video: "https://youtu.be/T2fdFFjZFPg?si=4GIgvMxG3qIB9nIG",
      lessons: [8],
    },
    {
      symbol: "ㄏ",
      pinyin: "h",
      sound: "he",
      type: "starting",
      video: "https://youtu.be/bqyuKUO6ceM?si=Rx3EcxM4ordGj-Gj",
      lessons: [5],
    },
    {
      symbol: "ㄐ",
      pinyin: "j",
      sound: "ji",
      type: "starting",
      video: "https://youtu.be/HXvqEWv9aOM?si=R0wciO1FufSzOJDF",
      lessons: [9],
    },
    {
      symbol: "ㄑ",
      pinyin: "q",
      sound: "qi",
      type: "starting",
      video: "https://youtu.be/95IekL0e6Pw?si=ydkKPlw6csHMivRV",
      lessons: [11],
    },
    {
      symbol: "ㄒ",
      pinyin: "x",
      sound: "xi",
      type: "starting",
      video: "https://youtu.be/8sGTQEM8ejY?si=3MdG8yR1bXcQzjhN",
      lessons: [7],
    },
    {
      symbol: "ㄓ",
      pinyin: "zh",
      sound: "zhi",
      type: "starting",
      video: "https://youtu.be/aHfZstYkC80?si=Rs9wvj3n_wG7xNet",
      lessons: [8],
    },
    {
      symbol: "ㄔ",
      pinyin: "ch",
      sound: "chi",
      type: "starting",
      video: "https://youtu.be/Eqeu5en_Sz4?si=XlJlPBDhyEdmfYeq",
      lessons: [11],
    },
    {
      symbol: "ㄕ",
      pinyin: "sh",
      sound: "shi",
      type: "starting",
      video: "https://youtu.be/aHfZstYkC80?si=Rs9wvj3n_wG7xNet",
      lessons: [5, 12],
    },
    {
      symbol: "ㄖ",
      pinyin: "r",
      sound: "ri",
      type: "starting",
      video: "https://youtu.be/aWJ1adFe7Cs?si=bLjVx8lkYD52m8P_",
      lessons: [6],
    },
    {
      symbol: "ㄗ",
      pinyin: "z",
      sound: "zi",
      type: "starting",
      video: "https://youtu.be/Law8VPCRAzo?si=1ozAB9y0Wwsz359x",
      lessons: [12],
    },
    {
      symbol: "ㄘ",
      pinyin: "c",
      sound: "ci",
      type: "starting",
      video: "https://youtu.be/IHaf530_T6Q?si=lZB7TwA48VRHpn_t",
      lessons: [4],
    },
    {
      symbol: "ㄙ",
      pinyin: "s",
      sound: "si",
      type: "starting",
      video: "https://youtu.be/xJUV2NNC5YA?si=yATmRacvdjkzjGrz",
      lessons: [6],
    },
  ];

  // Ending sounds (Finals/Vowels)
  const endingSounds: SymbolItem[] = [
    {
      symbol: "ㄚ",
      pinyin: "a",
      sound: "a",
      type: "ending",
      video: "https://youtu.be/9sNhxaMrGzk?si=AV2rJRmC_swR6T9d",
      lessons: [1],
    },
    {
      symbol: "ㄛ",
      pinyin: "o",
      sound: "o",
      type: "ending",
      video: "https://youtu.be/XalFfF4wMZI?si=gIjY1lNwRZ8Y2uoU",
      lessons: [3],
    },
    {
      symbol: "ㄜ",
      pinyin: "e",
      sound: "e",
      type: "ending",
      video: "https://youtu.be/wyd4bK6acmA?si=fdLJITEQEVg4gkb2",
      lessons: [2],
    },
    {
      symbol: "ㄝ",
      pinyin: "ê",
      sound: "eh",
      type: "ending",
      video: "https://youtu.be/riwQR2LISQI?si=TYoRf8irAcMox1Ed",
      lessons: [7],
    },
    {
      symbol: "ㄞ",
      pinyin: "ai",
      sound: "ai",
      type: "ending",
      video: "https://youtu.be/vRlLz9xkRxQ?si=eQ5k3fccAAzHVWTD",
      lessons: [8],
    },
    {
      symbol: "ㄟ",
      pinyin: "ei",
      sound: "ei",
      type: "ending",
      video: "https://youtu.be/Dhp7gkfwuPQ?si=XHrQNpVV7nmJPoFN",
      lessons: [7],
    },
    {
      symbol: "ㄠ",
      pinyin: "ao",
      sound: "ao",
      type: "ending",
      video: "https://youtu.be/IeYQetOewao?si=9JTIoaVH54ih7WJU",
      lessons: [4],
    },
    {
      symbol: "ㄡ",
      pinyin: "ou",
      sound: "ou",
      type: "ending",
      video: "https://youtu.be/U7JKNbHSIXM?si=pXhyn2VQID9CIyec",
      lessons: [3],
    },
    {
      symbol: "ㄢ",
      pinyin: "an",
      sound: "an",
      type: "ending",
      video: "https://youtu.be/eUX6Kjwh_ws?si=xs6jwuGiEQt_8Kjt",
      lessons: [5],
    },
    {
      symbol: "ㄣ",
      pinyin: "en",
      sound: "en",
      type: "ending",
      video: "https://youtu.be/QKZ8fm19j_k?si=EXMnHmhHpvNohMn1",
      lessons: [6],
    },
    {
      symbol: "ㄤ",
      pinyin: "ang",
      sound: "ang",
      type: "ending",
      video: "https://youtu.be/XdtFwqcRQzg?si=ykwaBjoZqZkIinzw",
      lessons: [9],
    },
    {
      symbol: "ㄥ",
      pinyin: "eng",
      sound: "eng",
      type: "ending",
      video: "https://youtu.be/pj-dFkzxIB4?si=9mhMzj4uX-Jcx-xf",
      lessons: [10],
    },
    {
      symbol: "ㄦ",
      pinyin: "er",
      sound: "er",
      type: "ending",
      video: "https://youtu.be/BaZXKrqtM58?si=6t8iM-gbPqc2VM4S",
      lessons: [4],
    },
    {
      symbol: "ㄧ",
      pinyin: "i",
      sound: "yi",
      type: "ending",
      video: "https://youtu.be/rS689qaig0U?si=oZ7C3xwEN3oJdbFu",
      lessons: [2],
    },
    {
      symbol: "ㄨ",
      pinyin: "u",
      sound: "wu",
      type: "ending",
      video: "https://youtu.be/dWA4Wv0bVOw?si=rM0akgqxvSX_NBWO",
      lessons: [3],
    },
    {
      symbol: "ㄩ",
      pinyin: "ü",
      sound: "yu",
      type: "ending",
      video: "https://youtu.be/TALGD7nXThc?si=S5v72joHAICM79rn",
      lessons: [4, 13],
    },
  ];

  const bopomofoSymbols: SymbolItem[] = [...startingSounds, ...endingSounds];

  const getFilteredSymbols = (): SymbolItem[] => {
    if (symbolFilter === "starting") return startingSounds;
    if (symbolFilter === "ending") return endingSounds;
    return bopomofoSymbols;
  };

  // Simple everyday words for 4-year-olds
  const flashcards: {
    word: string;
    bopomofo: string;
    pinyin: string;
    english: string;
  }[] = [
    // Numbers 1-10
    { word: "一", bopomofo: "ㄧ", pinyin: "yī", english: "One" },
    { word: "二", bopomofo: "ㄦˋ", pinyin: "èr", english: "Two" },
    { word: "三", bopomofo: "ㄙㄢ", pinyin: "sān", english: "Three" },
    { word: "四", bopomofo: "ㄙˋ", pinyin: "sì", english: "Four" },
    { word: "五", bopomofo: "ㄨˇ", pinyin: "wǔ", english: "Five" },
    { word: "六", bopomofo: "ㄌㄧㄡˋ", pinyin: "liù", english: "Six" },
    { word: "七", bopomofo: "ㄑㄧ", pinyin: "qī", english: "Seven" },
    { word: "八", bopomofo: "ㄅㄚ", pinyin: "bā", english: "Eight" },
    { word: "九", bopomofo: "ㄐㄧㄡˇ", pinyin: "jiǔ", english: "Nine" },
    { word: "十", bopomofo: "ㄕˊ", pinyin: "shí", english: "Ten" },
    // Basic words
    { word: "小", bopomofo: "ㄒㄧㄠˇ", pinyin: "xiǎo", english: "Small" },
    { word: "大", bopomofo: "ㄉㄚˋ", pinyin: "dà", english: "Big" },
    { word: "人", bopomofo: "ㄖㄣˊ", pinyin: "rén", english: "Person" },
    { word: "月", bopomofo: "ㄩㄝˋ", pinyin: "yuè", english: "Month/Moon" },
    { word: "日", bopomofo: "ㄖˋ", pinyin: "rì", english: "Day/Sun" },
    { word: "木", bopomofo: "ㄇㄨˋ", pinyin: "mù", english: "Wood" },
    { word: "山", bopomofo: "ㄕㄢ", pinyin: "shān", english: "Mountain" },
    { word: "早", bopomofo: "ㄗㄠˇ", pinyin: "zǎo", english: "Morning/Early" },
    { word: "口", bopomofo: "ㄎㄡˇ", pinyin: "kǒu", english: "Mouth" },
    { word: "媽媽", bopomofo: "ㄇㄚ ㄇㄚ", pinyin: "mā ma", english: "Mom" },
    { word: "爸爸", bopomofo: "ㄅㄚˋ ㄅㄚ˙", pinyin: "bà ba", english: "Dad" },
    { word: "水", bopomofo: "ㄕㄨㄟˇ", pinyin: "shuǐ", english: "Water" },
    { word: "吃", bopomofo: "ㄔ", pinyin: "chī", english: "Eat" },
    { word: "狗", bopomofo: "ㄍㄡˇ", pinyin: "gǒu", english: "Dog" },
    { word: "貓", bopomofo: "ㄇㄠ", pinyin: "māo", english: "Cat" },
    { word: "魚", bopomofo: "ㄩˊ", pinyin: "yú", english: "Fish" },
    { word: "鳥", bopomofo: "ㄋㄧㄠˇ", pinyin: "niǎo", english: "Bird" },
    { word: "手", bopomofo: "ㄕㄡˇ", pinyin: "shǒu", english: "Hand" },
    { word: "腳", bopomofo: "ㄐㄧㄠˇ", pinyin: "jiǎo", english: "Foot" },
    { word: "頭", bopomofo: "ㄊㄡˊ", pinyin: "tóu", english: "Head" },
    { word: "眼", bopomofo: "ㄧㄢˇ", pinyin: "yǎn", english: "Eye" },
    { word: "耳", bopomofo: "ㄦˇ", pinyin: "ěr", english: "Ear" },
    { word: "書", bopomofo: "ㄕㄨ", pinyin: "shū", english: "Book" },
    { word: "車", bopomofo: "ㄔㄜ", pinyin: "chē", english: "Car" },
    { word: "家", bopomofo: "ㄐㄧㄚ", pinyin: "jiā", english: "Home" },
    { word: "飯", bopomofo: "ㄈㄢˋ", pinyin: "fàn", english: "Rice/Meal" },
    { word: "牛", bopomofo: "ㄋㄧㄡˊ", pinyin: "niú", english: "Cow" },
    { word: "羊", bopomofo: "ㄧㄤˊ", pinyin: "yáng", english: "Sheep" },
    // --- Added from image samples ---
    {
      word: "斑馬",
      bopomofo: "ㄅㄢ ㄇㄚˇ",
      pinyin: "bān mǎ",
      english: "Zebra",
    },
    {
      word: "螃蟹",
      bopomofo: "ㄆㄤˊ ㄒㄧㄝˋ",
      pinyin: "páng xiè",
      english: "Crab",
    },
    { word: "螞蟻", bopomofo: "ㄇㄚˇ ㄧˇ", pinyin: "mǎ yǐ", english: "Ant" },
    { word: "蜜蜂", bopomofo: "ㄇㄧˋ ㄈㄥ", pinyin: "mì fēng", english: "Bee" },
    {
      word: "袋鼠",
      bopomofo: "ㄉㄞˋ ㄕㄨˇ",
      pinyin: "dài shǔ",
      english: "Kangaroo",
    },
    { word: "兔子", bopomofo: "ㄊㄨˋ ㄗˇ", pinyin: "tù zi", english: "Rabbit" },
    {
      word: "乳牛",
      bopomofo: "ㄖㄨˇ ㄋㄧㄡˊ",
      pinyin: "rǔ niú",
      english: "Dairy Cow",
    },
    {
      word: "哈巴狗",
      bopomofo: "ㄏㄚ ㄅㄚ ㄍㄡˇ",
      pinyin: "hā bā gǒu",
      english: "Pug",
    },
    {
      word: "恐龍",
      bopomofo: "ㄎㄨㄥˇ ㄌㄨㄥˊ",
      pinyin: "kǒng lóng",
      english: "Dinosaur",
    },
    { word: "狐狸", bopomofo: "ㄏㄨˊ ㄌㄧˊ", pinyin: "hú lí", english: "Fox" },
    { word: "烏鴉", bopomofo: "ㄨ ㄧㄚ", pinyin: "wū yā", english: "Crow" },
    {
      word: "蜻蜓",
      bopomofo: "ㄑㄧㄥ ㄊㄧㄥˊ",
      pinyin: "qīng tíng",
      english: "Dragonfly",
    },
    {
      word: "蟋蟀",
      bopomofo: "ㄒㄧ ㄕㄨㄞˋ",
      pinyin: "xī shuài",
      english: "Cricket",
    },
    { word: "蜘蛛", bopomofo: "ㄓ ㄓㄨ", pinyin: "zhī zhū", english: "Spider" },
    {
      word: "長頸鹿",
      bopomofo: "ㄔㄤˊ ㄐㄧㄥˇ ㄌㄨˋ",
      pinyin: "cháng jǐng lù",
      english: "Giraffe",
    },
    {
      word: "老鼠",
      bopomofo: "ㄌㄠˇ ㄕㄨˇ",
      pinyin: "lǎo shǔ",
      english: "Mouse",
    },
    {
      word: "棉花",
      bopomofo: "ㄇㄧㄢˊ ㄏㄨㄚ",
      pinyin: "mián huā",
      english: "Cotton",
    },
    {
      word: "洗澡",
      bopomofo: "ㄒㄧˇ ㄗㄠˇ",
      pinyin: "xǐ zǎo",
      english: "Bathe",
    },
    {
      word: "菜圃",
      bopomofo: "ㄘㄞˋ ㄆㄨˇ",
      pinyin: "cài pǔ",
      english: "Vegetable Patch",
    },
    {
      word: "白鷺鷥",
      bopomofo: "ㄅㄞˊ ㄌㄨˋ ㄙ",
      pinyin: "bái lù sī",
      english: "Egret",
    },
    {
      word: "公雞",
      bopomofo: "ㄍㄨㄥ ㄐㄧ",
      pinyin: "gōng jī",
      english: "Rooster",
    },
    {
      word: "鸚鵡",
      bopomofo: "ㄧㄥ ㄨˇ",
      pinyin: "yīng wǔ",
      english: "Parrot",
    },
    {
      word: "青蛙",
      bopomofo: "ㄑㄧㄥ ㄨㄚ",
      pinyin: "qīng wā",
      english: "Frog",
    },
    {
      word: "蘿蔔",
      bopomofo: "ㄌㄨㄛˊ ㄅㄛ",
      pinyin: "luó bo",
      english: "Radish",
    },
    { word: "鴿子", bopomofo: "ㄍㄜ ㄗˇ", pinyin: "gē zi", english: "Pigeon" },
    {
      word: "蝴蝶",
      bopomofo: "ㄏㄨˊ ㄉㄧㄝˊ",
      pinyin: "hú dié",
      english: "Butterfly",
    },
    {
      word: "排隊",
      bopomofo: "ㄆㄞˊ ㄉㄨㄟˋ",
      pinyin: "pái duì",
      english: "Line Up",
    },
    {
      word: "烏賊",
      bopomofo: "ㄨ ㄗㄟˊ",
      pinyin: "wū zéi",
      english: "Cuttlefish",
    },
    {
      word: "小貓",
      bopomofo: "ㄒㄧㄠˇ ㄇㄠ",
      pinyin: "xiǎo māo",
      english: "Kitten",
    },
    {
      word: "水中游",
      bopomofo: "ㄕㄨㄟˇ ㄓㄨㄥ ㄧㄡˊ",
      pinyin: "shuǐ zhōng yóu",
      english: "Swim",
    },
    {
      word: "山羊",
      bopomofo: "ㄕㄢ ㄧㄤˊ",
      pinyin: "shān yáng",
      english: "Goat",
    },
    {
      word: "蚯蚓",
      bopomofo: "ㄑㄧㄡ ㄧㄣˇ",
      pinyin: "qiū yǐn",
      english: "Earthworm",
    },
    {
      word: "太陽",
      bopomofo: "ㄊㄞˋ ㄧㄤˊ",
      pinyin: "tài yáng",
      english: "Sun",
    },
    {
      word: "螢火蟲",
      bopomofo: "ㄧㄥˊ ㄏㄨㄛˇ ㄔㄨㄥˊ",
      pinyin: "yíng huǒ chóng",
      english: "Firefly",
    },
    { word: "耳朵", bopomofo: "ㄦˇ ㄉㄨㄛ", pinyin: "ěr duo", english: "Ear" },
  ];

  const speakChinese = (text: string) => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "zh-TW";
      utterance.rate = 0.8;
      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utterance);
    }
  };

  const HomeScreen = () => (
    <ScreenLayout className="p-6 md:p-10">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-end mb-6">
          <Button
            onClick={() => setCurrentScreen("settings")}
            leftIcon={<Settings size={22} />}
          >
            Voice Settings
          </Button>
        </div>

        <h1 className="text-5xl md:text-6xl font-bold text-center mb-2 text-purple-700">
          ㄅㄆㄇ・好好玩
        </h1>
        <p className="text-xl md:text-2xl text-center mb-10 text-purple-600">
          BoPoMo Super Fun!
        </p>

        <div className="space-y-8">
          <button
            onClick={() => setCurrentScreen("symbols")}
            className="w-full bg-white rounded-3xl p-10 shadow-2xl ring-1 ring-black/5 hover:shadow-[0_20px_50px_-12px_rgba(124,58,237,0.35)] transition-transform hover:-translate-y-0.5"
          >
            <div className="text-6xl mb-4 text-center">📚</div>
            <h2 className="text-3xl font-bold text-purple-700 mb-2 text-center">
              Learn Symbols
            </h2>
            <p className="text-lg text-gray-600 text-center">
              Practice ㄅㄆㄇ sounds
            </p>
          </button>

          <button
            onClick={() => setCurrentScreen("flashcards")}
            className="w-full bg-white rounded-3xl p-10 shadow-2xl ring-1 ring-black/5 hover:shadow-[0_20px_50px_-12px_rgba(236,72,153,0.35)] transition-transform hover:-translate-y-0.5"
          >
            <div className="text-6xl mb-4 text-center">🎴</div>
            <h2 className="text-3xl font-bold text-pink-700 mb-2 text-center">
              Flashcards
            </h2>
            <p className="text-lg text-gray-600 text-center">
              Learn everyday words
            </p>
          </button>

          <button
            onClick={() => setCurrentScreen("worksheet")}
            className="w-full bg-white rounded-3xl p-10 shadow-2xl ring-1 ring-black/5 hover:shadow-[0_20px_50px_-12px_rgba(59,130,246,0.35)] transition-transform hover:-translate-y-0.5"
          >
            <div className="text-6xl mb-4 text-center">📝</div>
            <h2 className="text-3xl font-bold text-blue-700 mb-2 text-center">
              Worksheets
            </h2>
            <p className="text-lg text-gray-600 text-center">
              Print practice sheets
            </p>
          </button>

          <button
            onClick={() => setCurrentScreen("games")}
            className="w-full bg-white rounded-3xl p-10 shadow-2xl ring-1 ring-black/5 hover:shadow-[0_20px_50px_-12px_rgba(245,158,11,0.35)] transition-transform hover:-translate-y-0.5"
          >
            <div className="text-6xl mb-4 text-center">🎮</div>
            <h2 className="text-3xl font-bold text-amber-600 mb-2 text-center">
              Games
            </h2>
            <p className="text-lg text-gray-600 text-center">Play and learn</p>
          </button>
        </div>
      </div>
    </ScreenLayout>
  );

  const getYoutubeId = (url: string) => {
    if (!url) return null;
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2] && match[2].length === 11 ? match[2] : null;
  };

  const SymbolScreen = () => {
    const filteredSymbols = getFilteredSymbols();
    let currentSymbol: SymbolItem | null = null;
    if (filteredSymbols.length > 0) {
      const clampedIndex = Math.min(
        Math.max(0, currentSymbolIndex),
        filteredSymbols.length - 1
      );
      currentSymbol = filteredSymbols[clampedIndex] ?? null;
    }

    const handleFilterChange = (newFilter: "all" | "starting" | "ending") => {
      setSymbolFilter(newFilter);
      setCurrentSymbolIndex(0);
    };

    return (
      <ScreenLayout>
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <Button
              onClick={() => setCurrentScreen("home")}
              leftIcon={<Home size={22} />}
            >
              Home
            </Button>
          </div>

          <Card className="p-3 md:p-5 text-center">
            <h2 className="text-4xl font-bold text-purple-700 mb-6">
              Learn Symbols
            </h2>

            <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3 items-stretch sm:justify-center mb-8 px-2">
              <FilterChip
                active={symbolFilter === "all"}
                onClick={() => handleFilterChange("all")}
              >
                All Symbols (37)
              </FilterChip>
              <FilterChip
                active={symbolFilter === "starting"}
                onClick={() => handleFilterChange("starting")}
                className={
                  !(symbolFilter === "starting")
                    ? "text-blue-700 ring-blue-200 hover:bg-blue-50"
                    : ""
                }
              >
                🚀 Starting Sounds (21)
              </FilterChip>
              <FilterChip
                active={symbolFilter === "ending"}
                onClick={() => handleFilterChange("ending")}
                className={
                  !(symbolFilter === "ending")
                    ? "text-pink-600 ring-pink-200 hover:bg-pink-50"
                    : ""
                }
              >
                🎯 Ending Sounds (16)
              </FilterChip>
            </div>

            {currentSymbol && (
              <div
                className={`rounded-3xl p-8 md:p-16 mb-8 ${
                  currentSymbol.type === "starting"
                    ? "bg-gradient-to-br from-blue-100 to-cyan-100"
                    : "bg-gradient-to-br from-pink-100 to-purple-100"
                }`}
              >
                <div className="text-9xl mb-6 font-bold text-purple-800">
                  {currentSymbol.symbol}
                </div>
                <div className="text-4xl mb-4 text-gray-700">
                  {currentSymbol.pinyin}
                </div>
                <div className="text-2xl text-gray-600 mb-8">
                  {currentSymbol.type === "starting"
                    ? "🚀 Starting Sound"
                    : "🎯 Ending Sound"}
                </div>

                {currentSymbol.video && getYoutubeId(currentSymbol.video) && (
                  <div className="w-full max-w-2xl mx-auto aspect-video rounded-2xl overflow-hidden shadow-lg border-4 border-white/50">
                    <iframe
                      width="100%"
                      height="100%"
                      src={`https://www.youtube-nocookie.com/embed/${getYoutubeId(
                        currentSymbol.video
                      )}`}
                      title={`Video for ${currentSymbol.symbol}`}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      referrerPolicy="strict-origin-when-cross-origin"
                      allowFullScreen
                    ></iframe>
                  </div>
                )}
              </div>
            )}

            <div className="max-w-md mx-auto mb-8">
              <Button
                variant="primary"
                size="lg"
                block
                onClick={() =>
                  currentSymbol && speakChinese(currentSymbol.sound)
                }
                leftIcon={<Volume2 size={28} />}
              >
                Play Sound
              </Button>
            </div>

            <div className="grid grid-cols-3 gap-3 items-center max-w-xl mx-auto">
              <Button
                variant="neutral"
                onClick={() =>
                  setCurrentSymbolIndex(Math.max(0, currentSymbolIndex - 1))
                }
                disabled={currentSymbolIndex === 0}
              >
                ←
              </Button>
              <div className="justify-self-center bg-purple-100 text-gray-900 px-5 py-3 rounded-full text-lg font-semibold min-w-[84px] text-center">
                {currentSymbolIndex + 1} / {filteredSymbols.length}
              </div>
              <Button
                variant="blue"
                onClick={() =>
                  setCurrentSymbolIndex(
                    Math.min(filteredSymbols.length - 1, currentSymbolIndex + 1)
                  )
                }
                disabled={currentSymbolIndex === filteredSymbols.length - 1}
              >
                →
              </Button>
            </div>
          </Card>
        </div>
      </ScreenLayout>
    );
  };

  const FlashcardScreen = () => {
    let card: (typeof flashcards)[number] | null = null;
    if (flashcards.length > 0) {
      const clamped = Math.min(
        Math.max(0, currentFlashcard),
        flashcards.length - 1
      );
      card = flashcards[clamped] ?? null;
    }

    return (
      <ScreenLayout>
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <Button
              onClick={() => setCurrentScreen("home")}
              leftIcon={<Home size={22} />}
            >
              Home
            </Button>
          </div>

          <Card className="p-3 md:p-5 text-center">
            <h2 className="text-4xl font-bold text-pink-700 mb-8">
              Flashcards
            </h2>

            {card && (
              <div className="bg-gradient-to-br from-pink-100 to-purple-100 rounded-3xl p-4 sm:p-6 md:p-8 mb-6">
                <div className="text-7xl sm:text-8xl lg:text-9xl mb-4 font-bold text-gray-800 font-zhuyin leading-snug">
                  {card.word}
                </div>
                {/* <div className="text-3xl mb-4 text-purple-700">
                  {card.bopomofo}
                </div> */}
                <div className="text-2xl mb-2 text-gray-600">{card.pinyin}</div>
                <div className="text-3xl text-pink-600 font-bold">
                  {card.english}
                </div>
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
                onClick={() =>
                  setCurrentFlashcard(Math.max(0, currentFlashcard - 1))
                }
                disabled={currentFlashcard === 0}
              >
                ←
              </Button>
              <div className="justify-self-center bg-purple-100 text-gray-900 px-5 py-3 rounded-full text-lg font-semibold min-w-[84px] text-center">
                {currentFlashcard + 1} / {flashcards.length}
              </div>
              <Button
                variant="pink"
                onClick={() =>
                  setCurrentFlashcard(
                    Math.min(flashcards.length - 1, currentFlashcard + 1)
                  )
                }
                disabled={currentFlashcard === flashcards.length - 1}
              >
                →
              </Button>
            </div>
          </Card>
        </div>
      </ScreenLayout>
    );
  };

  const WorksheetScreen = () => {
    // Group symbols by lesson
    const lessons = new Map<
      number,
      { starting: SymbolItem[]; ending: SymbolItem[] }
    >();

    const processSymbols = (items: SymbolItem[]) => {
      items.forEach((item) => {
        item.lessons.forEach((lesson) => {
          if (!lessons.has(lesson)) {
            lessons.set(lesson, { starting: [], ending: [] });
          }
          if (item.type === "starting") {
            lessons.get(lesson)?.starting.push(item);
          } else {
            lessons.get(lesson)?.ending.push(item);
          }
        });
      });
    };

    processSymbols(startingSounds);
    processSymbols(endingSounds);

    const sortedLessons = Array.from(lessons.keys()).sort((a, b) => a - b);

    return (
      <ScreenLayout className="p-6 md:p-10">
        <div className="max-w-6xl mx-auto">
          <div className="flex gap-3 mb-6 print:hidden">
            <Button
              onClick={() => setCurrentScreen("home")}
              leftIcon={<Home size={22} />}
            >
              Home
            </Button>
            <Button
              variant="blue"
              onClick={() => window.print()}
              leftIcon={<Printer size={22} />}
            >
              Print Worksheet
            </Button>
          </div>

          <Card className="p-12 md:p-14 print:shadow-none print:rounded-none print:p-8">
            <h1 className="text-5xl font-bold text-center mb-2 text-blue-700">
              ㄅㄆㄇ・好好玩
            </h1>
            <p className="text-2xl text-center mb-2 text-purple-600">
              Practice Worksheet
            </p>
            <p className="text-center text-xl mb-8 text-gray-600">
              Name: ___________________ Date: ___________
            </p>

            <div className="space-y-8">
              {sortedLessons.map((lessonNum) => {
                const lessonData = lessons.get(lessonNum);
                if (!lessonData) return null;

                return (
                  <div
                    key={lessonNum}
                    className="break-inside-avoid border-2 border-purple-100 rounded-xl p-6 bg-purple-50/30"
                  >
                    <h2 className="text-2xl font-bold mb-4 text-purple-700 border-b border-purple-200 pb-2">
                      Lesson {lessonNum}
                    </h2>

                    <div className="flex flex-wrap gap-6 justify-center">
                      {/* Starting Sounds */}
                      {lessonData.starting.map((sym, idx) => (
                        <div
                          key={`s-${idx}`}
                          className="flex flex-col items-center"
                        >
                          <div className="w-32 h-32 md:w-40 md:h-40 border-4 border-dashed border-blue-300 rounded-2xl flex items-center justify-center bg-white mb-2">
                            <span
                              className="text-7xl md:text-8xl font-bold select-none print:text-transparent"
                              style={{
                                WebkitTextStroke: "2px #9ca3af",
                                color: "transparent",
                                WebkitPrintColorAdjust: "exact",
                                printColorAdjust: "exact",
                              }}
                            >
                              {sym.symbol}
                            </span>
                          </div>
                          <div className="text-xl text-gray-400 font-bold">
                            {sym.pinyin}
                          </div>
                        </div>
                      ))}

                      {/* Separator if both exist */}
                      {lessonData.starting.length > 0 &&
                        lessonData.ending.length > 0 && (
                          <div className="w-px bg-purple-200 mx-2 hidden md:block"></div>
                        )}

                      {/* Ending Sounds */}
                      {lessonData.ending.map((sym, idx) => (
                        <div
                          key={`e-${idx}`}
                          className="flex flex-col items-center"
                        >
                          <div className="w-32 h-32 md:w-40 md:h-40 border-4 border-dashed border-pink-300 rounded-2xl flex items-center justify-center bg-white mb-2">
                            <span
                              className="text-7xl md:text-8xl font-bold select-none print:text-transparent"
                              style={{
                                WebkitTextStroke: "2px #9ca3af",
                                color: "transparent",
                                WebkitPrintColorAdjust: "exact",
                                printColorAdjust: "exact",
                              }}
                            >
                              {sym.symbol}
                            </span>
                          </div>
                          <div className="text-xl text-gray-400 font-bold">
                            {sym.pinyin}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-12 border-t-2 border-gray-300 pt-6 text-center text-gray-500 break-before-page">
              <p className="text-xl">
                Great job practicing! 加油！(Jiā yóu - Keep it up!)
              </p>
            </div>
          </Card>
        </div>
      </ScreenLayout>
    );
  };

  const GamesScreen = () => {
    return (
      <ScreenLayout className="p-6 md:p-10">
        <div className="max-w-6xl mx-auto">
          <div className="mb-6">
            <Button
              onClick={() => setCurrentScreen("home")}
              leftIcon={<Home size={22} />}
            >
              Home
            </Button>
          </div>

          <Card className="p-8 md:p-14">
            <h2 className="text-4xl font-bold text-amber-600 mb-8 text-center">
              🎮 Games
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {games.map((game, idx) => (
                <a
                  key={idx}
                  href={game.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block group"
                >
                  <div className="bg-amber-50 rounded-2xl p-8 border-2 border-amber-100 hover:border-amber-300 hover:bg-amber-100 transition-all h-full flex flex-col items-center text-center shadow-sm hover:shadow-md">
                    <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">
                      {game.icon}
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 capitalize group-hover:text-amber-700 transition-colors">
                      {game.name}
                    </h3>
                  </div>
                </a>
              ))}
            </div>
          </Card>
        </div>
      </ScreenLayout>
    );
  };

  const VoiceSettingsScreen = () => {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-200 via-purple-200 to-pink-200 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <Button
              onClick={() => setCurrentScreen("home")}
              leftIcon={<Home size={22} />}
            >
              Home
            </Button>
          </div>

          <div className="bg-white rounded-3xl p-12 shadow-2xl">
            <h2 className="text-4xl font-bold text-purple-700 mb-8 text-center">
              🎙️ Voice Settings
            </h2>

            <div className="mb-8">
              <label className="block text-2xl font-bold text-gray-700 mb-4">
                Select Voice:
              </label>
              <select
                value={selectedVoice?.name || ""}
                onChange={(e) => {
                  const voice =
                    availableVoices.find((v) => v.name === e.target.value) ||
                    null;
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
                  No Chinese voices found. Your device may not have Chinese
                  language support installed.
                </p>
              )}
            </div>

            {selectedVoice && (
              <div className="bg-purple-50 rounded-2xl p-8 mb-8">
                <h3 className="text-2xl font-bold text-gray-700 mb-4">
                  Current Voice:
                </h3>
                <div className="space-y-2 text-lg">
                  <p>
                    <strong>Name:</strong> {selectedVoice.name}
                  </p>
                  <p>
                    <strong>Language:</strong> {selectedVoice.lang}
                  </p>
                  <p>
                    <strong>Quality:</strong>{" "}
                    {selectedVoice.localService
                      ? "🎯 High (Local)"
                      : "☁️ Standard (Online)"}
                  </p>
                </div>
              </div>
            )}

            <div className="space-y-4">
              <Button
                variant="primary"
                size="lg"
                block
                onClick={() => speakChinese("你好")}
                leftIcon={<Volume2 size={28} />}
              >
                Test Voice: "你好" (Hello)
              </Button>
              <Button
                variant="blue"
                size="lg"
                block
                onClick={() => speakChinese("ㄅㄆㄇㄈ")}
                leftIcon={<Volume2 size={28} />}
              >
                Test Voice: "ㄅㄆㄇㄈ"
              </Button>
              <Button
                variant="pink"
                size="lg"
                block
                onClick={() => speakChinese("媽媽爸爸")}
                leftIcon={<Volume2 size={28} />}
              >
                Test Voice: "媽媽爸爸"
              </Button>
            </div>

            <div className="mt-8 p-6 bg-yellow-50 rounded-2xl">
              <h4 className="text-xl font-bold text-gray-700 mb-2">
                💡 Tips for Better Voices:
              </h4>
              <ul className="space-y-2 text-lg text-gray-700">
                <li>
                  • Look for voices labeled "Enhanced" or "Premium" for better
                  quality
                </li>
                <li>
                  • "zh-TW" is Traditional Chinese (Taiwan), "zh-CN" is
                  Simplified Chinese
                </li>
                <li>• Local voices (🎯) work offline and sound more natural</li>
                <li>
                  • On iOS/Mac, try "Meijia" or "Tingting" for Taiwan voices
                </li>
                <li>
                  • You may need to download voices in your device's language
                  settings
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div>
      {currentScreen === "home" && <HomeScreen />}
      {currentScreen === "symbols" && <SymbolScreen />}
      {currentScreen === "flashcards" && <FlashcardScreen />}
      {currentScreen === "worksheet" && <WorksheetScreen />}
      {currentScreen === "games" && <GamesScreen />}
      {currentScreen === "settings" && <VoiceSettingsScreen />}
    </div>
  );
};

export default BopomofoApp;
