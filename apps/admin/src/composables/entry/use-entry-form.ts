import type { Method } from 'axios';
import { deepEqual } from 'fast-equals';
import pick from 'lodash/pick';
import { computed, reactive, ref, toRefs, watch } from 'vue';
import { useRouter } from 'vue-router/composables';

import type { FormConfig } from '@intake24/admin/util';
import {
  type EntryState,
  useEntry as useStoreEntry,
  useMessages,
  useResource,
} from '@intake24/admin/stores';
import { createForm } from '@intake24/admin/util';
import { copy, getObjectNestedKeys } from '@intake24/common/util';
import { useI18n } from '@intake24/i18n';

import type { UseStoreEntryProps } from './use-entry';
import { useEntry } from './use-entry';
import { useEntryWatch } from './use-entry-watch';

type FormMethod = Extract<Method, 'get' | 'post' | 'patch' | 'put'>;

export type UseEntryFormProps<F> = {
  data: F;
  config?: FormConfig;
  editMethod?: FormMethod;
  loadCallback?: (data: any) => any;
  nonInputErrorKeys?: string[];
};

export function useEntryForm<F extends object, E extends object>(props: UseStoreEntryProps, formProps: UseEntryFormProps<F>) {
  const { id: entryId } = toRefs(props);
  const { data, config, editMethod = 'put', loadCallback, nonInputErrorKeys = [] } = formProps;

  const { i18n } = useI18n();
  const resource = useResource();
  const router = useRouter();

  const { entry, isEdit } = useEntry<E>(props);
  const { setEntry } = useStoreEntry();

  const form = reactive(createForm<F>(data, config));

  const originalEntry = ref({});
  const entryChanged = computed(() => {
    const formKeys = config?.extractNestedKeys ? form.allKeys : (form.keys as string[]);
    const entryKeys = config?.extractNestedKeys
      ? getObjectNestedKeys(originalEntry.value)
      : Object.keys(originalEntry.value);
    const commonKeys = entryKeys.filter(key => formKeys.includes(key));

    const original = pick(originalEntry.value, commonKeys);
    const updated = pick(form.getData(true), commonKeys);

    return !deepEqual(original, updated);
  });

  const { setOriginalEntry, routeLeave } = useEntryWatch(originalEntry, entryChanged);

  const nonInputErrors = computed(() => Object.values(pick(form.errors.all(), nonInputErrorKeys)));

  const toForm = (data: any) => {
    const input = loadCallback ? loadCallback(data) : data;
    setOriginalEntry(input);

    form.load(input);
  };

  const submit = async () => {
    let data: any;

    if (isEdit.value) {
      data = await form[editMethod]<EntryState>(`${resource.api}/${entryId.value}`);

      const { id, name } = data;
      useMessages().success(i18n.t('common.msg.updated', { name: name ?? id }).toString());
    }
    else {
      data = await form.post<EntryState>(`${resource.api}`);

      const { id, name } = data;
      await router.push({ name: `${resource.name}-edit`, params: { id } });

      useMessages().success(i18n.t('common.msg.created', { name: name ?? id }).toString());
    }

    setEntry(data);
  };

  const clearError = (event: KeyboardEvent) => {
    const { name } = event.target as HTMLInputElement;

    if (name)
      form.errors.clear(name);
  };

  watch(entry, (val) => {
    if (!Object.keys(val).length)
      return;

    // Creating new record
    // TODO: might be better to load full blank templates directly in store
    if (deepEqual(val, { id: null })) {
      originalEntry.value = copy(form.getData(true));
      return;
    }

    toForm(entry.value);
  });

  return {
    form,
    nonInputErrorKeys,
    nonInputErrors,
    toForm,
    submit,
    clearError,
    originalEntry,
    entryChanged,
    routeLeave,
  };
}
