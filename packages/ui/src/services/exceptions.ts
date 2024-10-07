import type { ComponentPublicInstance } from 'vue';

import { useErrors } from '../stores';

export function errorHandler(err: unknown, vm: ComponentPublicInstance | null, info: string) {
  useErrors().captureError(err, vm, info);
}

export function warnHandler(msg: string, vm: ComponentPublicInstance | null, trace: string) {
  useErrors().captureWarn(msg, vm, trace);
}
