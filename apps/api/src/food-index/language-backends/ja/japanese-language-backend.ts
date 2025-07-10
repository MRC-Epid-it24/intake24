import kuromoji from 'kuromoji';
import type { LanguageBackend } from '@intake24/api/food-index/phrase-index';

import JapanesePhoneticEncoder from './japanese-phonetic-encoder';

const sanitiseRegexp = /[。、・.,`/\\\-+)(（）「」『』【】〈〉《》〔〕［］｛｝等]|など/g;

// Global tokenizer instance to avoid reloading dictionary
let tokenizerInstance: kuromoji.Tokenizer<kuromoji.IpadicFeatures> | null = null;
let tokenizerPromise: Promise<kuromoji.Tokenizer<kuromoji.IpadicFeatures>> | null = null;

async function getTokenizer(): Promise<kuromoji.Tokenizer<kuromoji.IpadicFeatures>> {
  if (tokenizerInstance) {
    return tokenizerInstance;
  }

  if (!tokenizerPromise) {
    tokenizerPromise = new Promise((resolve, reject) => {
      kuromoji.builder({ dicPath: 'node_modules/kuromoji/dict' }).build((err, tokenizer) => {
        if (err) {
          reject(err);
        }
        else {
          tokenizerInstance = tokenizer;
          resolve(tokenizer);
        }
      });
    });
  }

  return tokenizerPromise;
}

function segmentJapaneseText(text: string): string[] {
  try {
    if (!tokenizerInstance) {
      // Fallback to basic segmentation if tokenizer not loaded
      return text.split(/\s+/).filter(word => word.length > 0);
    }

    const tokens = tokenizerInstance.tokenize(text);
    return tokens
      .filter((token) => {
        // Filter out particles, auxiliary words, and symbols
        const pos = token.pos;
        return pos !== '助詞' && pos !== '助動詞' && pos !== '記号' && token.surface_form.length > 0;
      })
      .map(token => token.basic_form || token.surface_form);
  }
  catch {
    // Fallback to basic splitting if tokenization fails
    return text.split(/\s+/).filter(word => word.length > 0);
  }
}

export default {
  name: 'Japanese',
  languageCode: 'ja',
  indexIgnore: ['と', 'の', 'に', 'を', 'は', 'が', 'で', 'や', 'も', 'から', 'まで', 'より', 'ため', 'など', 'という', 'として', 'について'],
  phoneticEncoder: new JapanesePhoneticEncoder(),

  splitCompound(word: string): Array<string> {
    // For Japanese, we rely on morphological analysis for compound splitting
    // This is handled in the tokenization process
    return [word];
  },

  stem(word: string): string {
    try {
      if (!tokenizerInstance) {
        return word;
      }

      const tokens = tokenizerInstance.tokenize(word);
      if (tokens.length > 0) {
        // Return the basic form (dictionary form) of the first token
        return tokens[0].basic_form || tokens[0].surface_form;
      }
      return word;
    }
    catch {
      return word;
    }
  },

  sanitiseDescription(description: string): string {
    let sanitised = description.replace(sanitiseRegexp, ' ');

    // For Japanese text, we need to segment words since they often don't use spaces
    if (tokenizerInstance) {
      const segments = segmentJapaneseText(sanitised);
      sanitised = segments.join(' ');
    }

    return sanitised;
  },
} satisfies LanguageBackend;

// Initialize tokenizer on module load
getTokenizer().catch((error) => {
  console.error('Failed to initialize Japanese tokenizer:', error);
});
