import type { PhoneticEncoder } from '@intake24/api/food-index/dictionary';

import { Metaphone3 } from './metaphone3';

export default class Metaphone3Encoder implements PhoneticEncoder {
  private readonly metaphone3: Metaphone3;

  constructor() {
    this.metaphone3 = new Metaphone3();
    this.metaphone3.SetKeyLength(10);
    this.metaphone3.SetEncodeExact(true);
    this.metaphone3.SetEncodeVowels(true);
  }

  encode(input: string): Array<string> {
    this.metaphone3.SetWord(input);
    this.metaphone3.Encode();

    const result = new Array<string>();

    result.push(this.metaphone3.GetMetaph());

    if (this.metaphone3.GetAlternateMetaph())
      result.push(this.metaphone3.GetAlternateMetaph());

    return result;
  }
}
