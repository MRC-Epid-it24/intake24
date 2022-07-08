import type { CaptchaProvider } from '@intake24/common/types';

export const resolveCaptchaScript = (provider: CaptchaProvider) => {
  switch (provider) {
    case 'h-captcha':
      return `<script type="text/javascript" src="https://js.hcaptcha.com/1/api.js" async defer></script>`;
    case 're-captcha':
      return `<script type="text/javascript" src="https://www.google.com/recaptcha/api.js?onload=vueRecaptchaApiLoaded&render=explicit" async defer></script>`;
    default:
      return '';
  }
};
