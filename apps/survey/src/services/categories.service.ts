import type { CategoryContents, CategoryHeader, CategorySearch } from '@intake24/common/types/http';

import http from './http.service';

export default {
  contents: async (localeId: string, code?: string) => {
    const { data } = await http.get<CategoryContents>(
      code ? `categories/${localeId}/${code}` : `categories/${localeId}`,
    );
    return data;
  },
  header: async (localeId: string, code: string) => {
    const { data } = await http.get<CategoryHeader>(
      `category-header/${localeId}/${code}`,
    );
    return data;
  },
  search: async (localeId: string, code: string, params: any) => {
    const { data } = await http.get<CategorySearch>(`categories/${localeId}/${code}/search`, {
      params,
    });
    return data;
  },
};
