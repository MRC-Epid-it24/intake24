import type { AxiosError } from 'axios';
import axios from 'axios';

import { useMessages } from '../stores';

export const errorHandler = (err: Error /*, vm: Vue, info: string */) => {
  if (axios.isAxiosError(err)) {
    const { response } = err as AxiosError<any>;
    if (response) {
      if ([401, 404, 422].includes(response.status)) return;

      const { data: { message } = {} } = response;
      useMessages().error(message ?? err.message);
      return;
    }
  }

  useMessages().error(err.message);
  console.error(err);
};

export const warnHandler = (msg: string, vm: Vue, trace: string) => {
  console.warn(msg);
  console.warn(vm);
  console.warn(trace);
};
