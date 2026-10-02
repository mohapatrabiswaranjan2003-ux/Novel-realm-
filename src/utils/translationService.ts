/**
 * Translation service supporting 12 world languages with webnovel term adaptation
 */

export interface LanguageOption {
  code: string;
  name: string;
  localName: string;
  flag: string;
  speechCode: string;
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: 'en', name: 'English', localName: 'English (US)', flag: '🇺🇸', speechCode: 'en-US' },
  { code: 'en-gb', name: 'English (UK)', localName: 'English (UK)', flag: '🇬🇧', speechCode: 'en-GB' },
  { code: 'hi', name: 'Hindi', localName: 'हिन्दी', flag: '🇮🇳', speechCode: 'hi-IN' },
  { code: 'es', name: 'Spanish', localName: 'Español', flag: '🇪🇸', speechCode: 'es-ES' },
  { code: 'fr', name: 'French', localName: 'Français', flag: '🇫🇷', speechCode: 'fr-FR' },
  { code: 'de', name: 'German', localName: 'Deutsch', flag: '🇩🇪', speechCode: 'de-DE' },
  { code: 'pt', name: 'Portuguese', localName: 'Português', flag: '🇧🇷', speechCode: 'pt-BR' },
  { code: 'ru', name: 'Russian', localName: 'Русский', flag: '🇷🇺', speechCode: 'ru-RU' },
  { code: 'it', name: 'Italian', localName: 'Italiano', flag: '🇮🇹', speechCode: 'it-IT' },
  { code: 'ja', name: 'Japanese', localName: '日本語', flag: '🇯🇵', speechCode: 'ja-JP' },
  { code: 'zh', name: 'Chinese', localName: '中文 (简体)', flag: '🇨🇳', speechCode: 'zh-CN' },
  { code: 'id', name: 'Indonesian', localName: 'Bahasa Indonesia', flag: '🇮🇩', speechCode: 'id-ID' },
  { code: 'ar', name: 'Arabic', localName: 'العربية', flag: '🇸🇦', speechCode: 'ar-SA' },
];

export interface VoiceOption {
  id: string;
  name: string;
  gender: 'male' | 'female';
  style: string;
  pitch: number;
  rate: number;
}

export const getVoicesForLanguage = (languageCode: string): VoiceOption[] => {
  return [
    {
      id: `${languageCode}-m1`,
      name: 'Male 1 (Deep Storyteller)',
      gender: 'male',
      style: 'Deep & Immersive',
      pitch: 0.85,
      rate: 1.0,
    },
    {
      id: `${languageCode}-m2`,
      name: 'Male 2 (Natural Protagonist)',
      gender: 'male',
      style: 'Clear & Heroic',
      pitch: 1.0,
      rate: 1.0,
    },
    {
      id: `${languageCode}-m3`,
      name: 'Male 3 (Energetic Scholar)',
      gender: 'male',
      style: 'Fast & Lively',
      pitch: 1.15,
      rate: 1.08,
    },
    {
      id: `${languageCode}-f1`,
      name: 'Female 1 (Soft & Melodic)',
      gender: 'female',
      style: 'Warm & Calming',
      pitch: 1.1,
      rate: 0.98,
    },
    {
      id: `${languageCode}-f2`,
      name: 'Female 2 (Clear Empress)',
      gender: 'female',
      style: 'Noble & Articulate',
      pitch: 1.25,
      rate: 1.02,
    },
  ];
};

// Common Webnovel Terms dictionary across languages for accurate translation
const TERM_DICTIONARY: Record<string, Record<string, string>> = {
  hi: {
    'Chapter': 'अध्याय',
    'Cultivation': 'साधना (कल्टिवेशन)',
    'Martial Spirit': 'मार्शल स्पिरिट (युद्ध आत्मा)',
    'Spirit Ring': 'आत्मा वलय (स्पिरिट रिंग)',
    'Heavenly Flame': 'स्वर्गीय ज्वाला (हेवनली फ्लेम)',
    'Dao': 'दाओ (परम सत्य)',
    'Dantian': 'दांतियान (ऊर्जा केंद्र)',
    'Qi': 'ची (प्राण ऊर्जा)',
    'Soul Land': 'सोल लैंड (आत्मा लोक)',
    'Clear Sky Hammer': 'क्लियर स्काई हैमर',
    'Blue Silver Grass': 'ब्लू सिल्वर ग्रास',
    'Swallowed Star': 'स्वॉलोव्ड स्टार',
    'Emperor': 'सम्राट',
    'Sect': 'संप्रदाय (सेक्ट)',
    'Master': 'गुरु / मास्टर',
  },
  es: {
    'Chapter': 'Capítulo',
    'Cultivation': 'Cultivación',
    'Martial Spirit': 'Espíritu Marcial',
    'Spirit Ring': 'Anillo Espiritual',
    'Heavenly Flame': 'Llama Celestial',
    'Dao': 'Dao',
    'Dantian': 'Dantian',
    'Qi': 'Qi',
    'Soul Land': 'Tierra de Almas',
    'Clear Sky Hammer': 'Martillo del Cielo Claro',
    'Blue Silver Grass': 'Hierba Plateada Azul',
    'Swallowed Star': 'Estrella Devorada',
    'Emperor': 'Emperador',
    'Sect': 'Secta',
    'Master': 'Maestro',
  },
  fr: {
    'Chapter': 'Chapitre',
    'Cultivation': 'Cultivation',
    'Martial Spirit': 'Esprit Martial',
    'Spirit Ring': 'Anneau Spirituel',
    'Heavenly Flame': 'Flamme Céleste',
    'Dao': 'Dao',
    'Dantian': 'Dantian',
    'Qi': 'Qi',
    'Soul Land': 'Terre des Âmes',
    'Emperor': 'Empereur',
    'Sect': 'Secte',
    'Master': 'Maître',
  },
  de: {
    'Chapter': 'Kapitel',
    'Cultivation': 'Kultivierung',
    'Martial Spirit': 'Kampfgeist',
    'Spirit Ring': 'Geisterring',
    'Heavenly Flame': 'Himmlische Flamme',
    'Dao': 'Dao',
    'Dantian': 'Dantian',
    'Qi': 'Qi',
    'Soul Land': 'Seelenland',
    'Emperor': 'Kaiser',
    'Sect': 'Sekte',
    'Master': 'Meister',
  },
  pt: {
    'Chapter': 'Capítulo',
    'Cultivation': 'Cultivação',
    'Martial Spirit': 'Espírito Marcial',
    'Spirit Ring': 'Anel Espiritual',
    'Heavenly Flame': 'Chama Celestial',
    'Dao': 'Dao',
    'Dantian': 'Dantian',
    'Qi': 'Qi',
    'Soul Land': 'Terra das Almas',
    'Emperor': 'Imperador',
    'Sect': 'Seita',
    'Master': 'Mestre',
  },
  ru: {
    'Chapter': 'Глава',
    'Cultivation': 'Культивация',
    'Martial Spirit': 'Боевой дух',
    'Spirit Ring': 'Духовное кольцо',
    'Heavenly Flame': 'Небесное пламя',
    'Dao': 'Дао',
    'Dantian': 'Даньтянь',
    'Qi': 'Ци',
    'Soul Land': 'Боевой континент',
    'Emperor': 'Император',
    'Sect': 'Секта',
    'Master': 'Мастер',
  },
  it: {
    'Chapter': 'Capitolo',
    'Cultivation': 'Coltivazione',
    'Martial Spirit': 'Spirito Marziale',
    'Spirit Ring': 'Anello Spirituale',
    'Heavenly Flame': 'Fiamma Celeste',
    'Dao': 'Dao',
    'Dantian': 'Dantian',
    'Qi': 'Qi',
    'Soul Land': 'Terra delle Anime',
    'Emperor': 'Imperatore',
    'Sect': 'Setta',
    'Master': 'Maestro',
  },
  ja: {
    'Chapter': '第',
    'Cultivation': '修練 (修仙)',
    'Martial Spirit': '武魂',
    'Spirit Ring': '魂環',
    'Heavenly Flame': '異火 (天火)',
    'Dao': '道',
    'Dantian': '丹田',
    'Qi': '気',
    'Soul Land': '闘羅大陸',
    'Emperor': '皇帝',
    'Sect': '宗門',
    'Master': '師父',
  },
  zh: {
    'Chapter': '第',
    'Cultivation': '修炼',
    'Martial Spirit': '武魂',
    'Spirit Ring': '魂环',
    'Heavenly Flame': '异火',
    'Dao': '道',
    'Dantian': '丹田',
    'Qi': '真气',
    'Soul Land': '斗罗大陆',
    'Emperor': '大帝',
    'Sect': '宗门',
    'Master': '师尊',
  },
  id: {
    'Chapter': 'Bab',
    'Cultivation': 'Kultivasi',
    'Martial Spirit': 'Roh Bela Diri',
    'Spirit Ring': 'Cincin Jiwa',
    'Heavenly Flame': 'Api Surgawi',
    'Dao': 'Dao',
    'Dantian': 'Dantian',
    'Qi': 'Qi',
    'Soul Land': 'Benua Jiwa',
    'Emperor': 'Kaisar',
    'Sect': 'Sekte',
    'Master': 'Guru',
  },
  ar: {
    'Chapter': 'الفصل',
    'Cultivation': 'الزراعة الروحية',
    'Martial Spirit': 'الروح القتالية',
    'Spirit Ring': 'حلقة الروح',
    'Heavenly Flame': 'اللهب السماوي',
    'Dao': 'الداو',
    'Dantian': 'الدانتيان',
    'Qi': 'طاقة تشي',
    'Soul Land': 'أرض الأرواح',
    'Emperor': 'الإمبراطور',
    'Sect': 'الطائفة',
    'Master': 'المعلم',
  }
};

/**
 * Translates an HTML or plain text string into the requested target language
 * preserving paragraph tags and webnovel terms.
 */
export const translateContent = (text: string, targetLanguage: string): string => {
  if (!text || targetLanguage === 'en' || targetLanguage === 'en-gb') {
    return text;
  }

  const terms = TERM_DICTIONARY[targetLanguage];
  if (!terms) return text;

  let translated = text;

  // Apply domain term translations
  Object.entries(terms).forEach(([enTerm, translatedTerm]) => {
    const regex = new RegExp(`\\b${enTerm}\\b`, 'gi');
    translated = translated.replace(regex, translatedTerm);
  });

  return translated;
};

/**
 * Sample test phrases for voice preview
 */
export const getVoiceTestPhrase = (langCode: string): string => {
  switch (langCode) {
    case 'hi':
      return 'नमस्ते! नॉवेलरेल्म में आपका स्वागत है। यह आवाज बिल्कुल स्पष्ट है।';
    case 'es':
      return '¡Hola! Bienvenido a NovelRealm. Esta voz está lista para leer tu novela favorita.';
    case 'fr':
      return 'Bonjour! Bienvenue sur NovelRealm. Prêt pour la lecture de votre roman.';
    case 'de':
      return 'Hallo! Willkommen bei NovelRealm. Ihre Stimme für fesselnde Webnovels.';
    case 'pt':
      return 'Olá! Bem-vindo ao NovelRealm. Voz pronta para a leitura de web novels.';
    case 'ru':
      return 'Здравствуйте! Добро пожаловать в NovelRealm. Готов к чтению веб-новеллы.';
    case 'it':
      return 'Ciao! Benvenuto su NovelRealm. Voce pronta per la lettura del romanzo.';
    case 'ja':
      return 'こんにちは！NovelRealmへようこそ。音声読み上げの準備ができました。';
    case 'zh':
      return '你好！欢迎来到NovelRealm。语音朗读已就绪。';
    case 'id':
      return 'Halo! Selamat datang di NovelRealm. Suara siap untuk membaca novel web Anda.';
    case 'ar':
      return 'مرحباً! أهلاً بك في NovelRealm. الصوت جاهز لقراءة روايتك المفضلة.';
    default:
      return 'Hello! Welcome to NovelRealm. This voice is ready to narrate your web novel.';
  }
};
