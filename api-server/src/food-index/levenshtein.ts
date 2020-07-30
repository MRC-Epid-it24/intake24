import levenshtein from 'liblevenshtein';

export interface EditDistanceMatch {
  word: string;
  distance: number;
}

export class LevenshteinTransducer {
  private readonly transducer: any;

  constructor(dictionary: Set<string>) {
    const array = new Array<string>();

    for (const word of dictionary) array.push(word);

    const builder = new levenshtein.Builder()
      .dictionary(array, false) // generate spelling candidates from unsorted completion_list
      .algorithm('transposition') // use Levenshtein distance extended with transposition
      .sort_candidates(false)
      .include_distance(true);

    this.transducer = builder.build();
  }

  match(input: string, maxDistance: number): Array<EditDistanceMatch> {
    return this.transducer.transduce(input, maxDistance).map((a: Array<any>) => {
      return { word: a[0], distance: a[1] };
    });
  }
}
