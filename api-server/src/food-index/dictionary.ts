import {
  AltSpelling,
  ExactMatch,
  InterpretedWord,
  Synonym,
  WordInterpretation
} from "@/food-index/interpreted-word";
import {CaseInsensitiveString} from "@/food-index/strings";
import {LevenshteinTransducer} from "@/food-index/levenshtein";

export type MatchStrategy = 'match-fewer' | 'match-more';

export interface PhoneticEncoder {
  encode(input: CaseInsensitiveString): Array<CaseInsensitiveString>;
}

export class RichDictionary {

  private readonly words: Set<string>;
  private readonly phoneticMap: Map<CaseInsensitiveString, Array<CaseInsensitiveString>> | undefined;
  private readonly synonymMap: Map<CaseInsensitiveString, Set<CaseInsensitiveString>>;
  private readonly phoneticEncoder: PhoneticEncoder | undefined;
  private readonly transducer: LevenshteinTransducer;

  constructor(words: Array<CaseInsensitiveString>, phoneticEncoder: PhoneticEncoder | undefined, synSets: Array<Set<CaseInsensitiveString>>) {
    this.words = new Set<string>(words.map(w => w.lowerCase));
    this.phoneticEncoder = phoneticEncoder;

    if (phoneticEncoder) {
      this.phoneticMap = new Map<CaseInsensitiveString, Array<CaseInsensitiveString>>();

      for (let word of words) {
        const encodedVariants = phoneticEncoder.encode(word);

        for (let encoded of encodedVariants) {
          let array = this.phoneticMap.get(encoded);

          if (!array)
            array = new Array<CaseInsensitiveString>();

          array.push(word);

          this.phoneticMap.set(encoded, array);
        }
      }
    }

    this.transducer = new LevenshteinTransducer(words);

    this.synonymMap = new Map<CaseInsensitiveString, Set<CaseInsensitiveString>>();

    for (let synSet of synSets) {
      for (let word of synSet) {
        let synList = this.synonymMap.get(word);

        if (!synList)
          synList = new Set<CaseInsensitiveString>();

        for (let word2 of synSet) {
          if (word != word2)
            synList.add(word2);
        }
      }
    }
  }

  exactMatch(word: CaseInsensitiveString): boolean {
    return this.words.has(word.lowerCase);
  }

  synonyms(word: CaseInsensitiveString): Array<CaseInsensitiveString> {
    let result = this.synonymMap.get(word);

    if (!result)
      return new Array<CaseInsensitiveString>();
    else
      return new Array(...result);
  }

  phoneticMatch(word: CaseInsensitiveString): Array<CaseInsensitiveString> {
    let result = new Array<CaseInsensitiveString>();

    if (this.phoneticEncoder && this.phoneticMap) {
      for (let phoneticEncoding of this.phoneticEncoder.encode(word)) {
        const matchedWords = this.phoneticMap.get(phoneticEncoding);
        if (matchedWords) {
          result.push(...matchedWords);
        }
      }
    }

    return result;
  }

  fewerSpellingInterpretations(word: CaseInsensitiveString, maxInterpretations: number): Array<AltSpelling> {
    const phoneticMatches = this.phoneticMatch(word);
    if (phoneticMatches.length > 0) {
      return phoneticMatches.slice(0, maxInterpretations).map(w => new AltSpelling(w, 'phonetic'));
    } else {
      const lev1matches = this.transducer.match(word, 1);
      if (lev1matches.length > 0)
        return lev1matches.slice(0, maxInterpretations).map(match => new AltSpelling(match.word, 'lev1'));
      else
        return this.transducer.match(word, 2).slice(0, maxInterpretations).map(match => new AltSpelling(match.word, 'lev2'));
    }
  }

  moreSpellingInterpretations(word: CaseInsensitiveString, maxInterpretations: number): Array<AltSpelling> {
    const phoneticMatches = this.phoneticMatch(word).map(w => new AltSpelling(w, 'phonetic'));
    const lev2matches = this.transducer.match(word, 2).map(match => new AltSpelling(match.word, 'lev2'));

    return new Array<AltSpelling>(...phoneticMatches, ...lev2matches).slice(0, maxInterpretations);
  }

  interpretWord(word: string, maxInterpretations: number, strategy: MatchStrategy): InterpretedWord {

    const caseInsensitive = new CaseInsensitiveString((word));

    if (this.exactMatch(caseInsensitive)) {
      const interpretations = new Array<WordInterpretation>();
      interpretations.push(new ExactMatch());
      interpretations.push(...this.synonyms(caseInsensitive).slice(0, maxInterpretations - 1).map(w => new Synonym(w)));
      return new InterpretedWord(word, interpretations);
    } else {

      let spellingCorrected = new Array<AltSpelling>();

      if (strategy == 'match-fewer') {
        spellingCorrected = this.fewerSpellingInterpretations(caseInsensitive, maxInterpretations);
      } else if (strategy == 'match-more') {
        spellingCorrected = this.moreSpellingInterpretations(caseInsensitive, maxInterpretations);
      }

      const synonyms: Array<CaseInsensitiveString> = spellingCorrected.flatMap(sp => this.synonyms(sp.dictionaryWord));

      let withSynonyms = new Array<WordInterpretation>();

      withSynonyms.push(...spellingCorrected);
      withSynonyms.push(...synonyms.slice(0, maxInterpretations - spellingCorrected.length).map(s => new Synonym(s)));

      return new InterpretedWord(word, withSynonyms);
    }
  }
}
