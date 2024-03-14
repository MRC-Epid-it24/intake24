import { computed } from 'vue';

import { useI18n } from '@intake24/i18n';

import { useMessages } from '../stores';

export const useClipboard = () => {
  const { i18n } = useI18n();
  const messages = useMessages();

  const clipboardAvailable = computed(() => !!navigator.clipboard);

  const defaultMsg = i18n.t('common.clipboard.copied').toString();

  async function toClipboard(data: string, message?: string) {
    if (!clipboardAvailable.value) {
      messages.warning(i18n.t('common.clipboard.na').toString());
      return;
    }

    await navigator.clipboard.writeText(data);
    messages.info(message ?? defaultMsg);
  }

  return {
    clipboardAvailable,
    toClipboard,
  };
};
