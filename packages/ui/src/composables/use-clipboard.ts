import { computed } from 'vue';

import { useI18n } from '@intake24/i18n';

import { useMessages } from '../stores';

export function useClipboard() {
  const { i18n: { t } } = useI18n();
  const messages = useMessages();

  const clipboardAvailable = computed(() => !!navigator.clipboard);

  const defaultMsg = t('common.clipboard.copied');

  async function toClipboard(data: string, message?: string) {
    if (!clipboardAvailable.value) {
      messages.warning(t('common.clipboard.na'));
      return;
    }

    await navigator.clipboard.writeText(data);
    messages.info(message ?? defaultMsg);
  }

  return {
    toClipboard,
    clipboardAvailable,
  };
}
