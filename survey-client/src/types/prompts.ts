export interface PromptRefs {
  $refs: {
    form: HTMLFormElement;
  };
}

export interface BasePromptProps {
  text: string;
  description: string | null;
}

export interface ValidatedPromptProps extends BasePromptProps {
  validation: {
    required: boolean;
    message: string;
  };
}

export type DatePickerProps = ValidatedPromptProps;

export interface TimePickerProps extends ValidatedPromptProps {
  format: 'ampm' | '24hr';
}

export interface TextareaProps extends ValidatedPromptProps {
  label: string | null;
  hint: string | null;
}

export type ListOption = {
  label: string;
  value: string;
};

export type RadioOrientation = 'column' | 'row';

export interface RadioListProps extends ValidatedPromptProps {
  label: string | null;
  options: ListOption[];
  orientation: RadioOrientation;
  other: boolean;
}

export interface ChechboxListProps extends ValidatedPromptProps {
  label: string | null;
  options: ListOption[];
  other: boolean;
}
