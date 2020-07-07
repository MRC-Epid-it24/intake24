import {PhoneticEncoder} from "@/food-index/dictionary";
import {Metaphone3} from "@/food-index/metaphone3";
import {CaseInsensitiveString} from "@/food-index/strings";

export class Metaphone3Encoder implements PhoneticEncoder {

  private readonly metaphone3: Metaphone3;

  constructor() {
    this.metaphone3 = new Metaphone3();
  }

  encode(input: CaseInsensitiveString): Array<CaseInsensitiveString> {
    this.metaphone3.SetWord(input.lowerCase);
    this.metaphone3.Encode();

    const result = new Array<CaseInsensitiveString>();

    result.push(new CaseInsensitiveString(this.metaphone3.GetMetaph()));

    if (this.metaphone3.GetAlternateMetaph())
      result.push(new CaseInsensitiveString(this.metaphone3.GetAlternateMetaph()));

    return result;
  }
}
