export type Dictionary<T> = { [key: string]: T };

export type AnyDictionary = Dictionary<any>;

export interface ValidationError {
  [key: string]: {
    location: string;
    msg: string;
    param: string;
    value: string;
  };
}

export interface FormRefs {
  $refs: {
    form: HTMLFormElement;
  };
}
