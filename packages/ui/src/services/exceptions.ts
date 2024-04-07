import { useErrors } from '../stores';

export function errorHandler(err: Error, vm: Vue, info: string) {
  useErrors().captureError(err, vm, info);
}

export function warnHandler(msg: string, vm: Vue, trace: string) {
  useErrors().captureWarn(msg, vm, trace);
}
