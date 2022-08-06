import { computed } from 'vue';

import type { Dictionary } from '@intake24/common/types';
import { useEntry, useUser } from '@intake24/admin/stores';

export const useStoreEntry = <T = Dictionary, R = Dictionary>(id: string) => {
  const entryStore = useEntry();

  const entry = computed(() => entryStore.data as T);
  const entryLoaded = computed(() => entryStore.dataLoaded);

  const refs = computed(() => entryStore.refs as R);
  const refsLoaded = computed(() => entryStore.refsLoaded);

  const isCreate = computed(() => id === 'create');
  const isEdit = computed(() => !isCreate.value);

  const canHandleEntry = (action: string) => {
    if (isCreate.value) return false;

    const { securables, ownerId } = entryStore.data;

    return useUser().can({ action, securables, ownerId });
  };

  const fetchEntry = async (entryId?: string) => {
    await entryStore.requestEntry({ id: entryId ?? id });
  };

  return { canHandleEntry, entry, entryLoaded, fetchEntry, isCreate, isEdit, refs, refsLoaded };
};
