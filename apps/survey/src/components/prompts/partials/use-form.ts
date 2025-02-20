import type { VForm } from 'vuetify/components';
import { useTemplateRef } from 'vue';

import { useI18n } from '@intake24/i18n';

export type RuleCallback = (value: string | null) => boolean | string;

export function useForm() {
  const { i18n: { t } } = useI18n();

  const form = useTemplateRef<InstanceType<typeof VForm>>('form');

  function inputTooLog(max: number): RuleCallback {
    return (v: string | null) =>
      (v?.length ?? 0) <= max || t('common.validation.tooLong', { max });
  };

  return {
    form,
    inputTooLog,
  };
}
