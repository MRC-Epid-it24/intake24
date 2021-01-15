import { Dictionary } from '@common/types';
import Form from '@/helpers/Form';

export interface FetchEntryMixin {
  fetch: () => Promise<void>;
}

export interface HasEntryMixin {
  id: number | string;
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
  form: typeof Form;
  toForm: (data: Dictionary) => void;
  isEdit: boolean;
  isCreate: boolean;
}

export type DetailMixin<E = Dictionary, R = Dictionary> = EntryMixin<E, R>;
