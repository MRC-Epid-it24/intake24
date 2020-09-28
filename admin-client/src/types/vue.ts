import { AnyDictionary } from '@common/types/common';
import Form from '@/helpers/Form';

export interface FetchEntryMixin {
  fetch: () => Promise<void>;
}

export interface HasEntryMixin {
  id: number | string;
}

export interface MapEntryMixin<E = AnyDictionary> {
  entry: E;
  entryLoaded: boolean;
}

export interface MapRefsMixin<R = AnyDictionary> {
  refs: R;
  refsLoaded: boolean;
}

export type EntryMixin<E = AnyDictionary, R = AnyDictionary> = FetchEntryMixin &
  HasEntryMixin &
  MapEntryMixin<E> &
  MapRefsMixin<R>;

export interface FormMixin<E = AnyDictionary, R = AnyDictionary> extends EntryMixin<E, R> {
  form: typeof Form;
  toForm: (data: AnyDictionary) => void;
  isEdit: () => boolean;
  isCreate: () => boolean;
}

export type DetailMixin<E = AnyDictionary, R = AnyDictionary> = EntryMixin<E, R>;
