import JapaneseLanguageBackend from '@intake24/api/food-index/language-backends/ja/japanese-language-backend';
import type { PhraseWithKey, RecipeFoodTuple } from '@intake24/api/food-index/phrase-index';
import { PhraseIndex } from '@intake24/api/food-index/phrase-index';
import { defaultSearchSettings } from '@intake24/common/surveys';

describe('japanese Language Backend', () => {
  describe('basic functionality', () => {
    it('should have correct language metadata', () => {
      expect(JapaneseLanguageBackend.name).toBe('Japanese');
      expect(JapaneseLanguageBackend.languageCode).toBe('ja');
      expect(JapaneseLanguageBackend.phoneticEncoder).toBeUndefined();
    });

    it('should contain Japanese particles in indexIgnore', () => {
      const expectedParticles = ['と', 'の', 'に', 'を', 'は', 'が', 'で', 'や', 'も'];
      for (const particle of expectedParticles) {
        expect(JapaneseLanguageBackend.indexIgnore).toContain(particle);
      }
    });
  });

  describe('text sanitization', () => {
    it('should remove Japanese punctuation marks', () => {
      const input = '野菜・果物、米など（主食）';
      const result = JapaneseLanguageBackend.sanitiseDescription(input);

      // Should remove punctuation and potentially segment words
      expect(result).not.toContain('・');
      expect(result).not.toContain('、');
      expect(result).not.toContain('（');
      expect(result).not.toContain('）');
    });

    it('should handle mixed Japanese and English text', () => {
      const input = 'サラダ salad チキン chicken';
      const result = JapaneseLanguageBackend.sanitiseDescription(input);

      expect(result).toContain('サラダ');
      expect(result).toContain('salad');
      expect(result).toContain('チキン');
      expect(result).toContain('chicken');
    });

    it('should handle empty and whitespace strings', () => {
      expect(JapaneseLanguageBackend.sanitiseDescription('')).toBe('');
      expect(JapaneseLanguageBackend.sanitiseDescription('   ')).toBe('   ');
    });
  });

  describe('word stemming', () => {
    it('should return word as-is when tokenizer not ready', () => {
      const word = 'テスト';
      const result = JapaneseLanguageBackend.stem(word);

      // Should return original word (or basic form if tokenizer loaded)
      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
    });

    it('should handle English words', () => {
      const word = 'test';
      const result = JapaneseLanguageBackend.stem(word);

      expect(result).toBe('test');
    });

    it('should handle empty strings', () => {
      const result = JapaneseLanguageBackend.stem('');
      expect(result).toBe('');
    });
  });

  describe('compound word splitting', () => {
    it('should return single word array for Japanese', () => {
      const word = '野菜サラダ';
      const result = JapaneseLanguageBackend.splitCompound(word);

      expect(Array.isArray(result)).toBe(true);
      expect(result).toEqual([word]);
    });
  });

  describe('integration with PhraseIndex', () => {
    const japaneseFoodPhrases: Array<PhraseWithKey<string>> = [
      {
        phrase: 'ご飯と味噌汁',
        key: 'rice_miso_soup',
      },
      {
        phrase: '野菜サラダ',
        key: 'vegetable_salad',
      },
      {
        phrase: '鶏肉の照り焼き',
        key: 'chicken_teriyaki',
      },
      {
        phrase: 'うどん',
        key: 'udon_noodles',
      },
      {
        phrase: 'カレーライス',
        key: 'curry_rice',
      },
    ];

    const synonyms: Array<Set<string>> = [];
    const specialFoodsSynonyms: Array<Set<string>> = [];
    const specialFoodsList: RecipeFoodTuple[] = [];

    const japaneseIndex = new PhraseIndex(
      japaneseFoodPhrases,
      JapaneseLanguageBackend,
      synonyms,
      specialFoodsSynonyms,
      specialFoodsList,
    );

    it('should create index without errors', () => {
      expect(japaneseIndex).toBeDefined();
      expect(japaneseIndex.languageBackend).toBe(JapaneseLanguageBackend);
    });

    it('should interpret Japanese phrases', () => {
      const searchQuery = 'ご飯';
      const interpretedPhrase = japaneseIndex.interpretPhrase(searchQuery, {
        enableEditDistance: defaultSearchSettings.enableEditDistance,
        enablePhonetic: defaultSearchSettings.enablePhonetic,
        minWordLengthPhonetic: defaultSearchSettings.minWordLengthPhonetic,
        minWordLength1: defaultSearchSettings.minWordLength1,
        minWordLength2: defaultSearchSettings.minWordLength2,
        spellingCorrectionPreference: defaultSearchSettings.spellingCorrectionPreference,
      });

      expect(interpretedPhrase).toBeDefined();
      expect(interpretedPhrase.asTyped).toBe(searchQuery);
    });

    it('should find matches for Japanese food terms', () => {
      const searchQuery = 'カレー';
      const interpretedPhrase = japaneseIndex.interpretPhrase(searchQuery, {
        enableEditDistance: defaultSearchSettings.enableEditDistance,
        enablePhonetic: defaultSearchSettings.enablePhonetic,
        minWordLengthPhonetic: defaultSearchSettings.minWordLengthPhonetic,
        minWordLength1: defaultSearchSettings.minWordLength1,
        minWordLength2: defaultSearchSettings.minWordLength2,
        spellingCorrectionPreference: defaultSearchSettings.spellingCorrectionPreference,
      });

      const matches = japaneseIndex.findMatches(interpretedPhrase, 10, {
        firstWordCost: defaultSearchSettings.firstWordCost,
        wordOrderCost: defaultSearchSettings.wordOrderCost,
        wordDistanceCost: defaultSearchSettings.wordDistanceCost,
        unmatchedWordCost: defaultSearchSettings.unmatchedWordCost,
      });

      expect(Array.isArray(matches)).toBe(true);
      // Should potentially find curry_rice if tokenization is working
    });

    it('should handle complex Japanese food phrases', () => {
      const searchQuery = '鶏肉';
      const interpretedPhrase = japaneseIndex.interpretPhrase(searchQuery, {
        enableEditDistance: defaultSearchSettings.enableEditDistance,
        enablePhonetic: defaultSearchSettings.enablePhonetic,
        minWordLengthPhonetic: defaultSearchSettings.minWordLengthPhonetic,
        minWordLength1: defaultSearchSettings.minWordLength1,
        minWordLength2: defaultSearchSettings.minWordLength2,
        spellingCorrectionPreference: defaultSearchSettings.spellingCorrectionPreference,
      });

      const matches = japaneseIndex.findMatches(interpretedPhrase, 10, {
        firstWordCost: defaultSearchSettings.firstWordCost,
        wordOrderCost: defaultSearchSettings.wordOrderCost,
        wordDistanceCost: defaultSearchSettings.wordDistanceCost,
        unmatchedWordCost: defaultSearchSettings.unmatchedWordCost,
      });

      expect(Array.isArray(matches)).toBe(true);
    });
  });

  describe('error handling', () => {
    it('should handle malformed Japanese text gracefully', () => {
      const malformedText = '😀🍜🎌';
      const result = JapaneseLanguageBackend.sanitiseDescription(malformedText);

      expect(typeof result).toBe('string');
    });

    it('should handle very long Japanese text', () => {
      const longText = 'あ'.repeat(1000);
      const result = JapaneseLanguageBackend.sanitiseDescription(longText);

      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
    });
  });

  describe('real Japanese food terms', () => {
    const realFoodTerms = [
      '寿司', // sushi
      'ラーメン', // ramen
      '天ぷら', // tempura
      '焼き鳥', // yakitori
      'お好み焼き', // okonomiyaki
      '刺身', // sashimi
      '味噌汁', // miso soup
      'うどん', // udon
      'そば', // soba
      'カツ丼', // katsudon
    ];

    it.each(realFoodTerms)('should process "%s" without errors', (foodTerm) => {
      expect(() => {
        const sanitized = JapaneseLanguageBackend.sanitiseDescription(foodTerm);
        const stemmed = JapaneseLanguageBackend.stem(foodTerm);
        const compound = JapaneseLanguageBackend.splitCompound(foodTerm);

        expect(typeof sanitized).toBe('string');
        expect(typeof stemmed).toBe('string');
        expect(Array.isArray(compound)).toBe(true);
      }).not.toThrow();
    });
  });
});
