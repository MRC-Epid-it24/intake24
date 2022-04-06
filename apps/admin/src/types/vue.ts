import type { Dictionary, ValidationError } from '@intake24/common/types';
import type { Form } from '@intake24/admin/helpers';
import type { Resource } from './vue-router';

export interface FetchEntryMixin {
  fetch: () => Promise<void>;
}

export interface HasEntryMixin<E = Dictionary> {
  id: string;
  entry: E;
  entryLoaded: boolean;
  resource: Resource;
  isEdit: boolean;
  isCreate: boolean;
}

export interface MapRefsMixin<R = Dictionary> {
  refs: R;
  refsLoaded: boolean;
}

export type EntryMixin<E = Dictionary, R = Dictionary> = FetchEntryMixin &
  HasEntryMixin<E> &
  MapRefsMixin<R>;

export interface FormMixin<E = Dictionary, R = Dictionary> extends EntryMixin<E, R> {
  // data
  form: Form;
  nonInputErrorKeys: string[];
  // originalEntry: Dictionary;
  // routeLeave: RouteLeave;
  // computed
  nonInputErrors: ValidationError[];
  // methods
  setOriginalEntry: (data: Dictionary) => void;
  toForm: (data: Dictionary) => void;
  submit: () => Promise<void>;
  clearError: (event: KeyboardEvent) => void;
}

export type DetailMixin<E = Dictionary, R = Dictionary> = EntryMixin<E, R>;
