import type { MatchStrategy, PhoneticEncoder } from '@intake24/api/food-index/dictionary';
import type { RecipeFoodsHeader } from '@intake24/common/types';
import { RichDictionary } from '@intake24/api/food-index/dictionary';
import InterpretedPhrase from '@intake24/api/food-index/interpreted-phrase';
import {
  countDistanceViolations,
  countOrderViolations,
} from '@intake24/api/food-index/match-quality-helpers';

const MAX_WORDS_PER_PHRASE = 10;
const MAX_WORD_INTERPRETATIONS = 4;
const MAX_PHRASE_COMBINATIONS = 1000;
const MAX_MATCHES_FOR_MATCH_MORE = 3;
const MAX_PHRASE_MATCHES = 6;
const DISTANCE_COST = 1;
const ORDER_COST = 4;
const UNMATCHED_WORD_COST = 8;

export interface PhraseWithKey<K> {
  phrase: string;
  key: K;
}

export type RecipeFoodTuple = [key: string, entry: RecipeFoodsHeader];

export interface LanguageBackend {
  indexIgnore: string[];

  phoneticEncoder: PhoneticEncoder | undefined;

  sanitiseDescription(description: string): string;
  stem(word: string): string;
  splitCompound(word: string): Array<string>;
}

export interface DictionaryPhrase<K> {
  asTyped: string;
  words: Array<string>;
  key: K;
}

export interface WordMatch {
  word: {
    index: number;
    interpretationIndex: number;
  };
  matched: {
    phraseIndex: number;
    wordIndex: number;
  };
}

interface PhraseMatch {
  phraseIndex: number;
  quality: number;
  matchedWords: Array<WordMatch>;
}

export interface PhraseMatchResult<K> {
  phrase: string;
  key: K;
  quality: number;
}

export class PhraseIndex<K> {
  readonly languageBackend: LanguageBackend;

  readonly dictionary: RichDictionary;

  readonly phraseIndex: Array<DictionaryPhrase<K>>;

  readonly wordIndex: Map<string, Array<[number, number]>>;

  readonly recipeFoodsList: RecipeFoodTuple[];

  getWordList(phrase: string): Array<string> {
    const sanitised = this.languageBackend.sanitiseDescription(phrase.toLocaleLowerCase());

    return (
      sanitised
        .split(/\s+/)
        .filter((s) => s.length > 1)
        // split compound words (e.g. for German and Nordic languages)
        .flatMap((s) => this.languageBackend.splitCompound(s))
        .map((s) => this.languageBackend.stem(s))
    );
  }

  interpretPhrase(phrase: string, strategy: MatchStrategy): InterpretedPhrase {
    const words = this.getWordList(phrase).slice(0, MAX_WORDS_PER_PHRASE);

    // FIXME: Not sure if unmatched words are being completely ignored?
    //        Check that the unmatched word penalty is correctly applied
    const interpretedWords = words
      .map((w) => this.dictionary.interpretWord(w, MAX_WORD_INTERPRETATIONS, strategy))
      .filter((w) => w.interpretations.length > 0);

    return new InterpretedPhrase(phrase, interpretedWords);
  }

  // Avoid matching a single input word with many phrase words at once,
  // but still match the same word multiple times in correct sequence if it is
  // indeed seen several times in the input
  //
  // E.g., for the dictionary phrase "a black dog and a black cat"
  // given the input "black" we should only match "black" once
  // but for input "black black" we need to match both instances of "black"
  // and in the same order as they appear in the dictionary phrase
  //
  // Assumes that values in groupedMatches are sorted by input word index.
  // eslint-disable-next-line class-methods-use-this
  private ensureUniqueMatches(
    groupedMatches: Map<number, Array<WordMatch>>
  ): Map<number, Array<WordMatch>> {
    const result = new Map<number, Array<WordMatch>>();

    for (const key of groupedMatches.keys()) {
      const matches = groupedMatches.get(key)!;
      const uniqueMatches = new Array<WordMatch>();

      const usedInputIndices = new Set<number>();
      const usedDictionaryIndices = new Set<number>();

      for (const match of matches) {
        if (!usedInputIndices.has(match.word.index)) {
          let minDictIndex = -1;

          for (const match2 of matches) {
            if (
              match.word.index === match2.word.index &&
              minDictIndex < match2.matched.wordIndex &&
              !usedDictionaryIndices.has(match2.matched.wordIndex)
            )
              minDictIndex = match2.matched.wordIndex;
          }

          if (minDictIndex !== -1) {
            uniqueMatches.push(match);
            usedInputIndices.add(match.word.index);
            usedDictionaryIndices.add(minDictIndex);
          }
        }
      }

      result.set(key, uniqueMatches);
    }

    return result;
  }

  private evaluateMatchQuality(input: InterpretedPhrase, matchedWords: Array<WordMatch>): number {
    const matchedIndices = matchedWords.map((w) => w.matched.wordIndex);

    const orderViolations = countOrderViolations(matchedIndices);
    const distanceViolations = countDistanceViolations(matchedIndices);

    const dictionaryPhraseLength =
      this.phraseIndex[matchedWords[0].matched.phraseIndex].words.length;

    // In some rare cases words can be matched multiple times, clamp to 0 avoid negative cost values
    const unmatchedWords = Math.max(0, dictionaryPhraseLength - matchedWords.length);

    return (
      orderViolations * ORDER_COST +
      distanceViolations * DISTANCE_COST +
      unmatchedWords * UNMATCHED_WORD_COST
    );
  }

  private matchCombination(
    phrase: InterpretedPhrase,
    combination: Array<number>
  ): Array<PhraseMatch> {
    // First step is to build a flat list of matched words from the word index, where every match is
    // a reference to a specific word in a dictionary phrase in the form of a s
    // (phrase index, word index) pair combined with the index of the word in the input phrase and
    // its interpretation index (given by the current interpretations combination).

    const wordMatches = new Array<WordMatch>();

    for (let wi = 0; wi < phrase.words.length; wi += 1) {
      const interpretationIndex = combination[wi];

      const indexMatches =
        this.wordIndex.get(phrase.words[wi].interpretations[interpretationIndex].dictionaryWord) ||
        [];

      const matchedWords: Array<WordMatch> = indexMatches.map((m) => ({
        word: {
          index: wi,
          interpretationIndex,
        },
        matched: {
          phraseIndex: m[0],
          wordIndex: m[1],
        },
      }));

      wordMatches.push(...matchedWords);
    }

    // Next step is to group the word matches by the phrase index so we can give each potential
    // matched phrase a match quality score

    const groupedMatches = new Map<number, Array<WordMatch>>();

    for (const match of wordMatches) {
      const { phraseIndex } = match.matched;
      const array: Array<WordMatch> = groupedMatches.get(phraseIndex) || [];
      array.push(match);
      groupedMatches.set(phraseIndex, array);
    }

    // Sort the grouped matches by the input word index so we can apply word order violation cost
    // later

    for (const key of groupedMatches.keys()) {
      // cannot be undefined because we're iterating over known keys
      const array = groupedMatches.get(key)!;
      array.sort((m1, m2) => m1.word.index - m2.word.index);
    }

    // Clean up duplicate word matches

    const uniqueGroupedMatches = this.ensureUniqueMatches(groupedMatches);

    const phraseMatches = new Array<PhraseMatch>();

    for (const key of uniqueGroupedMatches.keys()) {
      const matchedWords = uniqueGroupedMatches.get(key)!;

      const quality = this.evaluateMatchQuality(phrase, matchedWords);

      phraseMatches.push({
        phraseIndex: key,
        quality,
        matchedWords,
      });
    }

    return phraseMatches;
  }

  findMatches(
    phrase: InterpretedPhrase,
    maxMatches: number,
    maxCombinations: number
  ): Array<PhraseMatchResult<K>> {
    const matchedPhrases = phrase
      .generateCombinations(maxCombinations)
      .flatMap((c) => this.matchCombination(phrase, c));

    if (matchedPhrases.length === 0) return [];

    let bestMatchWordCount = matchedPhrases[0].matchedWords.length;

    for (let i = 1; i < matchedPhrases.length; i += 1) {
      if (matchedPhrases[i].matchedWords.length > bestMatchWordCount) {
        bestMatchWordCount = matchedPhrases[i].matchedWords.length;
      }
    }

    const bestMatches = matchedPhrases.filter((m) => m.matchedWords.length === bestMatchWordCount);
    bestMatches.sort((m1, m2) => m2.quality - m1.quality);

    // exclude duplicates which could have appeared due to different
    // variants of spelling correction on the same word matching
    // different words in the same phrase
    // e.g. the word "cat" is not in the dictionary and is corrected
    // to "oat" and "eat"
    // then it will match the phrase "eat oats" twice

    const knownPhrases = new Set<number>();
    const uniqueMatches: PhraseMatch[] = [];

    for (const m of bestMatches) {
      if (!knownPhrases.has(m.phraseIndex)) {
        uniqueMatches.push(m);
        knownPhrases.add(m.phraseIndex);
      }
    }

    return uniqueMatches.slice(0, maxMatches).map((m) => ({
      phrase: this.phraseIndex[m.phraseIndex].asTyped,
      key: this.phraseIndex[m.phraseIndex].key,
      quality: m.quality,
    }));
  }

  constructor(
    phrases: Array<PhraseWithKey<K>>,
    wordOps: LanguageBackend,
    synonymSets: Array<Set<string>>,
    recipeFoodsSynonymsSet: Array<Set<string>>,
    recipeFoodsList: RecipeFoodTuple[]
  ) {
    this.languageBackend = wordOps;
    this.phraseIndex = new Array<DictionaryPhrase<K>>(phrases.length);
    this.wordIndex = new Map<string, Array<[number, number]>>();
    this.recipeFoodsList = recipeFoodsList;

    const dictionaryWords = new Set<string>();

    for (let pi = 0; pi < phrases.length; pi += 1) {
      const words = this.getWordList(phrases[pi].phrase);
      this.phraseIndex[pi] = { asTyped: phrases[pi].phrase, words, key: phrases[pi].key };

      for (let wi = 0; wi < words.length; wi += 1) {
        const occurrences = this.wordIndex.get(words[wi]) || new Array<[number, number]>();
        occurrences.push([pi, wi]);
        this.wordIndex.set(words[wi], occurrences);
        dictionaryWords.add(words[wi]);
      }
    }

    // Creatinf a dictionary for Locale Indexing with all the special foods synonyms, synonym sets and dictionary words
    this.dictionary = new RichDictionary(
      dictionaryWords,
      wordOps.phoneticEncoder,
      synonymSets,
      recipeFoodsSynonymsSet
    );
  }
}
