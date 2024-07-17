import type { LocaleTranslation } from '../../common';

export interface AssociatedFood {
  foodCode?: string;
  categoryCode?: string;
  promptText: LocaleTranslation;
  linkAsMain: boolean;
  genericName: LocaleTranslation;
  allowMultiple: boolean;
}
