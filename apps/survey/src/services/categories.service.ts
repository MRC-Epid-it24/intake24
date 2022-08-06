import type { CategoryContents } from '@intake24/common/types/http';

import http from './http.service';

export default {
  browse: async (localeId: string, code: string | undefined): Promise<CategoryContents> => {
    const { data } = await http.get<CategoryContents>(`categories/${localeId}/${code}`);
    return data;
  },
};
