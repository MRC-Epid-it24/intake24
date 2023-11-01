import phonetic from 'talisman/phonetics/french/phonetic';

import type { PhoneticEncoder } from '@intake24/api/food-index/dictionary';

export default class FrenchPhoneticEncoder implements PhoneticEncoder {
  encode(input: string): Array<string> {
    return [phonetic(input)];
  }
}
