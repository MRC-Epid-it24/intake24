import Form from '@/helpers/Form';
import { AnyDictionary } from './common';

export interface FetchEntryMixin {
  fetch: () => Promise<void>;
}

export interface HasEntryMixin {
  id: number | string;
}

export interface MapEntryMixin {
  entry: AnyDictionary;
  entryLoaded: boolean;
}

export interface MapRefsMixin {
  refs: AnyDictionary;
  refsLoaded: boolean;
}

export type EntryMixin = FetchEntryMixin & HasEntryMixin & MapEntryMixin & MapRefsMixin;

export interface FormMixin extends EntryMixin {
  form: typeof Form;
  toForm: (data: AnyDictionary) => void;
  isEdit: () => boolean;
  isCreate: () => boolean;
}

export type DetailMixin = EntryMixin;
