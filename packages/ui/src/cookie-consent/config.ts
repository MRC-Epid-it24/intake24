import type { CookieConsentConfig } from 'vanilla-cookieconsent';

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
  });
}
