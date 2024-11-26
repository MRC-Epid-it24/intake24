import type { Ref } from 'vue';
import { watchDebounced } from '@vueuse/core';
import { ref, unref, watch } from 'vue';

import { useHttp } from '@intake24/admin/services';
import type { Pagination } from '@intake24/common/types/http';

export function useFetchList<T = any>(url: string, id?: string | Ref<string>) {
  const http = useHttp();

  const dialog = ref(false);
  const loading = ref(false);

  const page = ref<number | undefined>();
  const lastPage = ref<number | undefined>();
  const search = ref<string | null>(null);

  const items = ref<T[]>([]) as Ref<T[]>;

  const fetch = async () => {
    loading.value = true;

    const apiUrl = id ? url.replace(':id', unref(id)) : url;

    try {
      const {
        data: { data, meta },
      } = await http.get<Pagination<T>>(apiUrl, {
        params: { search: search.value, page: page.value, limit: 6 },
      });

      items.value = data;
      lastPage.value = meta.lastPage;
    }
    finally {
      loading.value = false;
    }
  };

  const clear = async () => {
    search.value = null;
    await fetch();
  };

  watch(dialog, async (val) => {
    if (!val || items.value.length)
      return;

    await fetch();
  });

  watch(page, async (val, oldVal) => {
    if (val === oldVal)
      return;

    await fetch();
  });

  watchDebounced(
    search,
    async () => {
      page.value = 1;
      await fetch();
    },
    { debounce: 500, maxWait: 1000 },
  );

  return {
    dialog,
    loading,
    page,
    lastPage,
    search,
    items,
    fetch,
    clear,
  };
}
