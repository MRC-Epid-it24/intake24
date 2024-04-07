export const captchaProviders = ['h-captcha', 're-captcha'] as const;

export type CaptchaProvider = (typeof captchaProviders)[number];

export function isCaptchaProvider(provider: any): provider is CaptchaProvider {
  return captchaProviders.includes(provider);
}

export function resolveCaptchaScript(provider: CaptchaProvider) {
  switch (provider) {
    case 'h-captcha':
      return `<script type="text/javascript" src="https://js.hcaptcha.com/1/api.js" async defer></script>`;
    case 're-captcha':
      return `<script type="text/javascript" src="https://www.google.com/recaptcha/api.js?onload=vueRecaptchaApiLoaded&render=explicit" async defer></script>`;
    default:
      return '';
  }
}
