import type { QuantityValues } from '.';
import type { LocaleTranslation } from '../types';
import type { PortionSizeMethod, AsServedSet } from '../types/models';
import type { Condition } from './conditions';

export interface BasePromptProps {
  text: LocaleTranslation;
  description: LocaleTranslation;
  conditions: Condition[];
}

export interface PromptValidationProps {
  validation: {
    required: boolean;
    message: LocaleTranslation;
  };
}

export interface ValidatedPromptProps extends BasePromptProps, PromptValidationProps {}

export type DatePickerPromptProps = ValidatedPromptProps;

export interface TimePickerPromptProps extends ValidatedPromptProps {
  format: 'ampm' | '24hr';
}

export interface TextareaPromptProps extends ValidatedPromptProps {
  label: LocaleTranslation;
  hint: LocaleTranslation;
}

export type ListOption = {
  id?: number;
  label: string;
  value: string;
};

export type LocaleOptionList = { [locale: string]: ListOption[] };

export type RadioOrientation = 'column' | 'row';

export interface RadioListPromptProps extends ValidatedPromptProps {
  label: LocaleTranslation;
  options: LocaleOptionList;
  orientation: RadioOrientation;
  other: boolean;
}

export interface CheckboxListPromptProps extends ValidatedPromptProps {
  label: LocaleTranslation;
  options: LocaleOptionList;
  other: boolean;
}

// TODO Migrate these out
export interface PortionSizeOptionPromptProps extends ValidatedPromptProps {
  // Stores which methods to display
  methods: PortionSizeMethod[];
  localDescription: LocaleTranslation;
}

export interface AsServedPromptProps extends ValidatedPromptProps {
  localDescription: LocaleTranslation;
  selectionImageUrl: string;
  servingImageSet: AsServedSet;
  // images: Object[];
}

export type AsServedLeftoverPromptProps = ValidatedPromptProps;

export type LeftoverQuestionPromptProps = ValidatedPromptProps;

export interface GuideImagePromptProps extends ValidatedPromptProps {
  quantityValue: QuantityValues;
}

export type DrinkScalePromptProps = ValidatedPromptProps;

export interface StandardPortionPromptProps extends ValidatedPromptProps {
  quantityValue: QuantityValues;
}

export type CerealPromptProps = ValidatedPromptProps;

export type MilkCerealPromptProps = ValidatedPromptProps;

export type PizzaPromptProps = ValidatedPromptProps;

export type MilkHotDrinkPromptProps = ValidatedPromptProps;

export type DirectWeightPromptProps = ValidatedPromptProps;
