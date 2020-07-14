import { WordOps } from '@/food-index/phrase-index';

export default class EnglishWordOps implements WordOps {
  // eslint-disable-next-line class-methods-use-this
  splitCompound(word: string): Array<string> {
    return new Array<string>(word);
  }

  // eslint-disable-next-line class-methods-use-this
  stem(word: string): string {
    return word;
  }
}
