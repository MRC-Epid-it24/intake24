import type { LocaleTranslation } from '.';
import type { PortionSizeMethod, AsServedSet } from './models';

export interface BasePromptProps {
  text: LocaleTranslation;
  description: LocaleTranslation;
}

export interface ValidatedPromptProps extends BasePromptProps {
  validation: {
    required: boolean;
    message: LocaleTranslation;
  };
}

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

export type GuideImagePromptProps = ValidatedPromptProps;

export type DrinkScalePromptProps = ValidatedPromptProps;

export type StandardPortionPromptProps = ValidatedPromptProps;

export type CerealPromptProps = ValidatedPromptProps;

export type MilkCerealPromptProps = ValidatedPromptProps;

export type PizzaPromptProps = ValidatedPromptProps;

export type MilkHotDrinkPromptProps = ValidatedPromptProps;

export type DirectWeightPromptProps = ValidatedPromptProps;
