import { useI18n } from '@intake24/i18n';

import { useMessages } from '../stores';

export const useClipboard = () => {
  const { i18n } = useI18n();
  const messages = useMessages();

  const defaultMsg = i18n.t('common.clipboard.copied').toString();

  async function toClipboard(data: string, message?: string) {
    await navigator.clipboard.writeText(data);
    messages.info(message ?? defaultMsg);
  }

  return {
    toClipboard,
  };
};
