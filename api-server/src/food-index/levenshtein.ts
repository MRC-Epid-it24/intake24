import {CaseInsensitiveString} from "@/food-index/strings";

const levenshtein = require('liblevenshtein');

export interface EditDistanceMatch {
  word: CaseInsensitiveString;
  distance: number;
}

export class LevenshteinTransducer {

  private readonly transducer: any;

  constructor(dictionary: Array<CaseInsensitiveString>) {

    const builder = new levenshtein.Builder()
      .dictionary(dictionary.map(w => w.lowerCase), false) // generate spelling candidates from unsorted completion_list
      .algorithm('transposition') // use Levenshtein distance extended with transposition
      .sort_candidates(false)
      .include_distance(true);

    this.transducer = builder.build();
  }

  match(input: CaseInsensitiveString, maxDistance: number): Array<EditDistanceMatch> {
    return this.transducer.transduce(input.lowerCase, maxDistance).map((a: Array<any>) => {
      return {word: new CaseInsensitiveString(a[0]), distance: a[1]}
    });
  }
}
