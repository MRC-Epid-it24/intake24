import { Dictionary, ValidationError } from '@common/types';
import type { Form } from '@/helpers/Form';
import { Resource } from './vue-router';

export interface FetchEntryMixin {
  fetch: () => Promise<void>;
}

export interface HasEntryMixin {
  id: string;
  resource: Resource;
}

export interface MapEntryMixin<E = Dictionary> {
  entry: E;
  entryLoaded: boolean;
}

export interface MapRefsMixin<R = Dictionary> {
  refs: R;
  refsLoaded: boolean;
}

export type EntryMixin<E = Dictionary, R = Dictionary> = FetchEntryMixin &
  HasEntryMixin &
  MapEntryMixin<E> &
  MapRefsMixin<R>;

export interface FormMixin<E = Dictionary, R = Dictionary> extends EntryMixin<E, R> {
  // data
  form: Form;
  nonInputErrorKeys: string[];
  // originalEntry: Dictionary;
  // routeLeave: RouteLeave;
  // computed
  isEdit: boolean;
  isCreate: boolean;
  nonInputErrors: ValidationError[];
  // methods
  setOriginalEntry: (data: Dictionary) => void;
  toForm: (data: Dictionary) => void;
  submit: () => Promise<void>;
  clearError: (event: KeyboardEvent) => void;
}

export type DetailMixin<E = Dictionary, R = Dictionary> = EntryMixin<E, R>;
