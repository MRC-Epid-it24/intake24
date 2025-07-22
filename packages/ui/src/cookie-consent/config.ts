import type { CookieConsentConfig, Translation } from 'vanilla-cookieconsent';
import type { PluginOptions } from 'vue-gtag';
import { useGtm } from '@gtm-support/vue-gtm';
import Clarity from '@microsoft/clarity';
import get from 'lodash/get';
import { bootstrap, optIn, optOut, setOptions } from 'vue-gtag';
import { defaultMessages } from '@intake24/i18n';

export function gTagConfig(): PluginOptions {
  return {
    appName: import.meta.env.VITE_APP_NAME,
    config: {
      id: import.meta.env.VITE_GOOGLE_ANALYTICS_ID,
    },
  };
}

async function toggleGA(enabled: boolean) {
  console.debug('GA toggled to ', enabled);
  if (!enabled) {
    console.debug('GA opt-out');
    optOut();
    return;
  }

  console.debug('GA opt-in', enabled);
  optIn();
  setOptions(gTagConfig());
  await bootstrap();
}
async function toggleGTM(enabled: boolean) {
  console.debug('GTM toggled to ', enabled);
  useGtm()?.enable(enabled);
}
async function toggleClarity(enabled: boolean) {
  console.debug('Clarity toggled to ', enabled);

  if (!('clarity' in window))
    return;

  Clarity.consent(enabled);
}
export function cookieConsentConfig(translations?: CookieConsentConfig['language']['translations']): CookieConsentConfig {
  if (!translations) {
    translations = {
      en: get(defaultMessages.getMessages('en'), 'legal.cookies.consent') as Translation,
    };
  }

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
      console.debug('Consent changed');
      toggleGA(cookie.categories.includes('analytics'));
      toggleGTM(cookie.categories.includes('analytics'));
      toggleClarity(cookie.categories.includes('analytics'));
    },
    onFirstConsent: ({ cookie }) => {
      console.debug('First consent');
      toggleGA(cookie.categories.includes('analytics'));
      toggleGTM(cookie.categories.includes('analytics'));
      toggleClarity(cookie.categories.includes('analytics'));
    },
  });
}
