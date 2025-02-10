import type { CookieConsentConfig } from 'vanilla-cookieconsent';
import type { PluginOptions } from 'vue-gtag';
import { useGtm } from '@gtm-support/vue-gtm';
import { bootstrap, optIn, optOut, setOptions } from 'vue-gtag';

export function gTagConfig(): PluginOptions {
  return {
    appName: import.meta.env.VITE_APP_NAME,
    config: {
      id: import.meta.env.VITE_GOOGLE_ANALYTICS_ID,
    },
  };
}

async function toggleGA(enabled: boolean) {
  if (!enabled) {
    optOut();
    return;
  }

  optIn();
  setOptions(gTagConfig());
  await bootstrap();
}
async function toggleGTM(enabled: boolean) {
  useGtm()?.enable(enabled);
}
export function cookieConsentConfig(translations: CookieConsentConfig['language']['translations'] = {}): CookieConsentConfig {
  return ({
    cookie: {
      name: 'it24_cc_consent',
      expiresAfterDays: 365,
    },
    mode: 'opt-out',
    categories: {
      necessary: {
        enabled: true,
        readOnly: true,
      },
      analytics: {
        enabled: true,
      },
    },
    language: {
      default: 'en',
      translations,
    },
    onChange: ({ cookie }) => {
      toggleGA(cookie.categories.includes('analytics'));
      toggleGTM(cookie.categories.includes('analytics'));
    },
    onFirstConsent: ({ cookie }) => {
      toggleGA(cookie.categories.includes('analytics'));
      toggleGTM(cookie.categories.includes('analytics'));
    },
  });
}
