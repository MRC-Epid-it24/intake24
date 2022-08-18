import { useErrors } from '../stores';

export const errorHandler = (err: Error, vm: Vue, info: string) => {
  useErrors().captureError(err, vm, info);
};

export const warnHandler = (msg: string, vm: Vue, trace: string) => {
  useErrors().captureWarn(msg, vm, trace);
};
