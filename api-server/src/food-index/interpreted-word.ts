import {CaseInsensitiveString} from "@/food-index/strings";

export type CorrectionMethod = "phonetic" | "lev1" | "lev2";

export class ExactMatch {
  kind: 'exact-match';

  constructor() {
    this.kind = 'exact-match';
  }
}

export class AltSpelling {
  kind: 'alt-spelling';
  readonly dictionaryWord: CaseInsensitiveString;
  readonly method: CorrectionMethod;

  constructor(dictionaryWord: CaseInsensitiveString, method: CorrectionMethod) {
    this.kind = 'alt-spelling';
    this.dictionaryWord = dictionaryWord;
    this.method = method;
  }
}

export class Synonym {
  kind: 'synonym';
  readonly dictionaryWord: CaseInsensitiveString;

  constructor(dictionaryWord: CaseInsensitiveString) {
    this.kind = 'synonym';
    this.dictionaryWord = dictionaryWord;
  }
}

export type WordInterpretation = ExactMatch | AltSpelling | Synonym;

export class InterpretedWord {

  readonly asTyped: string;
  readonly interpretations: Array<WordInterpretation>;

  constructor(asTyped: string, interpretations: Array<WordInterpretation>) {
    this.asTyped = asTyped;
    this.interpretations = interpretations;
  }

  dropInterpretation() {
    // first try dropping some synonym

    const synIndex = this.interpretations.findIndex(i => i.kind === 'synonym');

    if (synIndex > -1) {
      this.interpretations.splice(synIndex, 1);
    } else {
      // no synonyms, try dropping alternative spelling
      const altSpellingIndex = this.interpretations.findIndex(i => i.kind === 'alt-spelling');

      if (altSpellingIndex > -1) {
        this.interpretations.splice(altSpellingIndex, 1);
      }

      if (this.interpretations.length == 0)
        throw new Error('Cannot drop the only remaining word interpretation');
    }
  }
}
