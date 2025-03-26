import NodeCache from 'node-cache';
import type { LanguageBackend } from '@intake24/api/food-index/phrase-index';

// Regex to remove common punctuation and unwanted characters
const sanitiseRegexp = /[.`,/\\\-+)(…।॥;:?!'"]/g;

const CACHE_TTL = 86400;
const CACHE_CHECK_PERIOD = 1800;
const CACHE_MAX_KEYS = 10000;

const stopWords = [
  'ஒரு', // a/an
  'மற்றும்', // and
  'அது', // it
  'இந்த', // this
  'அந்த', // that
  'என்று', // that (as in saying)
  'ஆகிய', // and
  'இருந்து', // from
  'கொண்டு', // with
  'போன்ற', // like
  'வேண்டும்', // need/should
  'உள்ள', // having
  'போது', // when
  'வரை', // until
  'மிகவும்', // very
];

function generateNGrams(token: string, minGram = 2, maxGram = 3): string[] {
  const ngrams: string[] = [];
  if (token.length < minGram)
    return ngrams;

  for (let n = minGram; n <= Math.min(maxGram, token.length); n++) {
    for (let i = 0; i <= token.length - n; i++) {
      ngrams.push(token.substring(i, i + n));
    }
  }
  return ngrams;
}

function tokenizeTamil(text: string): string[] {
  return text.split(/\s+/).filter(token => token.length > 0);
}

function stemTamil(word: string): string {
  const suffixes = [
    'கள்', // plural marker
    'இல்', // locative case
    'இன்', // genitive case
    'ஆல்', // instrumental case
    'உடன்', // sociative case
    'க்கு', // dative case
    'ஆக', // adverbial marker
    'ஆன', // adjective marker
    'இருந்து', // ablative case
    'படி', // manner
    'போல', // comparative
  ];

  let stemmed = word;
  for (const suffix of suffixes) {
    if (stemmed.endsWith(suffix) && stemmed.length > suffix.length + 2) {
      stemmed = stemmed.slice(0, -suffix.length);
      break;
    }
  }

  return stemmed;
}

export function processDescriptionForIndexing(description: string): string[] {
  const sanitized = description.replace(sanitiseRegexp, ' ');
  const tokens = tokenizeTamil(sanitized);

  const processedTokens: string[] = [];
  for (const token of tokens) {
    if (token.length > 1 && !stopWords.includes(token)) {
      processedTokens.push(token);

      const stemmed = stemTamil(token);
      if (stemmed !== token) {
        processedTokens.push(stemmed);
      }

      processedTokens.push(...generateNGrams(token));
    }
  }

  return processedTokens;
}

const phoneticCache = new NodeCache({
  stdTTL: CACHE_TTL,
  checkperiod: CACHE_CHECK_PERIOD,
  maxKeys: CACHE_MAX_KEYS,
});

function encodePhonetically(word: string): string[] {
  // Group similar sounding consonants
  const phonetic = word
    // Replace similar sounding consonants with a common representation
    // க/ச/ஜ group (ka/ca/ja)
    .replace(/[கசஜ]/g, 'க')
    // ட/த/ற group (Ta/ta/Ra)
    .replace(/[டதற]/g, 'ட')
    // ப/ஃப group (pa/fa)
    .replace(/[பஃ]/g, 'ப')
    // ண/ந/ன grop (Na/na/na)
    .replace(/[ணநன]/g, 'ந')
    // ல/ள/ழ group (la/La/zha)
    .replace(/[லளழ]/g, 'ல')
    // Replace vowel markers with simple forms
    .replace(/ாிீுூெேைொோௌ/g, '');

  return [phonetic];
}
export default {
  name: 'Tamil',
  languageCode: 'ta',
  indexIgnore: stopWords,
  minWordLength: 1,

  phoneticEncoder: {
    encode: (input: string): Array<string> => {
      const cached = phoneticCache.get<string[]>(input);
      if (cached) {
        return cached;
      }
      const result = encodePhonetically(input);
      phoneticCache.set(input, result);
      return result;
    },
  },

  splitCompound(word: string): Array<string> {
    return [word];
  },

  stem(word: string): string {
    // Remove some common suffixes (case markers, verb endings)
    const suffixes = [
      'கள்', // plural marker
      'இல்', // locative case
      'இன்', // genitive case
      'ஆல்', // instrumental case
      'உடன்', // sociative case
      'க்கு', // dative case
      'ஆக', // adverbial marker
      'ஆன', // adjective marker
      'இருந்து', // ablative case
      'படி', // manner
      'போல', // comparative
    ];

    let stemmed = word;
    for (const suffix of suffixes) {
      if (stemmed.endsWith(suffix) && stemmed.length > suffix.length + 2) {
        stemmed = stemmed.slice(0, -suffix.length);
        break;
      }
    }

    return stemmed;
  },

  sanitiseDescription(description: string): string {
    return description.replace(sanitiseRegexp, ' ');
  },

  processDescriptionForIndexing,
} satisfies LanguageBackend;
