import type { WordInterpretation } from '@intake24/api/food-index/interpreted-word';
import {
  AltSpelling,
  ExactMatch,
  InterpretedWord,
  Synonym,
} from '@intake24/api/food-index/interpreted-word';
import { LevenshteinTransducer } from '@intake24/api/food-index/levenshtein';

export type MatchStrategy = 'match-fewer' | 'match-more';

export type DictionaryType = 'foods' | 'recipes' | 'categories';

export interface PhoneticEncoder {
  encode: (input: string) => Array<string>;
}

export class RichDictionary {
  private readonly words: Set<string>;

  private readonly phoneticMap: Map<string, Set<string>> | undefined;

  private readonly synonymMap: Map<string, Set<string>>;

  private readonly phoneticEncoder: PhoneticEncoder | undefined;

  private readonly transducer: LevenshteinTransducer;

  constructor(
    words: Set<string>,
    phoneticEncoder: PhoneticEncoder | undefined,
    synSets: Array<Set<string>>,
  ) {
    this.words = new Set<string>();

    for (const word of words) this.words.add(word.toLocaleLowerCase());
    if (synSets.length > 0) {
      synSets.forEach((synSet) => {
        for (const synWord of synSet) this.words.add(synWord.toLocaleLowerCase());
      });
    }

    this.phoneticEncoder = phoneticEncoder;

    if (phoneticEncoder) {
      this.phoneticMap = new Map<string, Set<string>>();

      for (const word of this.words) {
        const encodedVariants = phoneticEncoder.encode(word);

        for (const encoded of encodedVariants) {
          let set = this.phoneticMap.get(encoded);

          if (!set)
            set = new Set<string>();

          set.add(word);

          this.phoneticMap.set(encoded, set);
        }
      }
    }

    this.transducer = new LevenshteinTransducer(words);

    this.synonymMap = new Map<string, Set<string>>();

    for (const synSet of synSets) {
      for (const word of synSet) {
        const lowerCaseWord = word.toLocaleLowerCase();

        let synList = this.synonymMap.get(lowerCaseWord);

        if (!synList)
          synList = new Set<string>();

        for (const word2 of synSet) {
          const lowerCaseWord2 = word2.toLocaleLowerCase();
          if (lowerCaseWord !== lowerCaseWord2)
            synList.add(lowerCaseWord2);
        }

        this.synonymMap.set(lowerCaseWord, synList);
      }
    }
  }

  exactMatch(lowerCaseWord: string): boolean {
    return this.words.has(lowerCaseWord);
  }

  synonyms(lowerCaseWord: string): Array<string> {
    const result = this.synonymMap.get(lowerCaseWord);
    if (!result)
      return new Array<string>();
    return [...result];
  }

  phoneticMatch(word: string): Array<string> {
    const result = new Array<string>();

    if (this.phoneticEncoder && this.phoneticMap) {
      for (const phoneticEncoding of this.phoneticEncoder.encode(word)) {
        const matchedWords = this.phoneticMap.get(phoneticEncoding);

        if (matchedWords)
          for (const matched of matchedWords) result.push(matched);
      }
    }

    return result;
  }

  fewerSpellingInterpretations(
    lowerCaseWord: string,
    maxInterpretations: number,
  ): Array<AltSpelling> {
    const phoneticMatches = this.phoneticMatch(lowerCaseWord);
    if (phoneticMatches.length > 0) {
      return phoneticMatches
        .slice(0, maxInterpretations)
        .map(w => new AltSpelling(w, 'phonetic'));
    }
    const lev1matches = this.transducer.match(lowerCaseWord, 1);
    if (lev1matches.length > 0) {
      return lev1matches
        .slice(0, maxInterpretations)
        .map(match => new AltSpelling(match.word, 'lev1'));
    }
    return this.transducer
      .match(lowerCaseWord, 2)
      .slice(0, maxInterpretations)
      .map(match => new AltSpelling(match.word, 'lev2'));
  }

  moreSpellingInterpretations(
    lowerCaseWord: string,
    maxInterpretations: number,
  ): Array<AltSpelling> {
    const phoneticMatches = this.phoneticMatch(lowerCaseWord).map(
      w => new AltSpelling(w, 'phonetic'),
    );
    const lev2matches = this.transducer
      .match(lowerCaseWord, 2)
      .map(match => new AltSpelling(match.word, 'lev2'));

    return new Array<AltSpelling>(...phoneticMatches, ...lev2matches).slice(0, maxInterpretations);
  }

  interpretWord(
    word: string,
    maxInterpretations: number,
    strategy: MatchStrategy,
  ): InterpretedWord {
    const lowerCaseWord = word.toLocaleLowerCase();
    const interpretations = new Array<WordInterpretation>();

    if (this.exactMatch(lowerCaseWord)) {
      interpretations.push(new ExactMatch(lowerCaseWord));
    }
    else {
      let spellingCorrected = new Array<AltSpelling>();

      if (strategy === 'match-fewer')
        spellingCorrected = this.fewerSpellingInterpretations(lowerCaseWord, maxInterpretations);
      else if (strategy === 'match-more')
        spellingCorrected = this.moreSpellingInterpretations(lowerCaseWord, maxInterpretations);

      interpretations.push(...spellingCorrected);
    }

    const synonyms: Array<string> = interpretations.flatMap(sp =>
      this.synonyms(sp.dictionaryWord),
    );

    interpretations.push(
      ...synonyms.slice(0, maxInterpretations - interpretations.length).map(s => new Synonym(s)),
    );

    return new InterpretedWord(word, interpretations);
  }
}
