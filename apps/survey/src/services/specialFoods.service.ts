import type { CategoryContents, CategorySearch } from '@intake24/common/types/http';

import http from './http.service';

export default {
  contents: async (localeId: string, code: string | undefined) => {
    const { data } = await http.get<CategoryContents>(`categories/${localeId}/${code}/contents`);
    return data;
  },
  search: async (localeId: string, code: string | undefined, params: any) => {
    const { data } = await http.get<CategorySearch>(`categories/${localeId}/${code}`, { params });
    return data;
  },
};
