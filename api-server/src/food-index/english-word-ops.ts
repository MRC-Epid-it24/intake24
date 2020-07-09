import {WordOps} from "@/food-index/phrase-index";

export class EnglishWordOps implements WordOps {
  splitCompound(word: string): Array<string> {
    return new Array<string>(word);
  }

  stem(word: string): string {
    return word;
  }
}
