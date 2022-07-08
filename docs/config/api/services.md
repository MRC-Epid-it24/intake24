# Services

Path: `apps/api/src/config/services.ts`

## CAPTCHA

Password recovery and user generation can be protected by captcha services.

Implemented providers:

- [hCAPTCHA](https://hcaptcha.com)
- [Google reCAPTCHA](https://developers.google.com/recaptcha/intro)

V2 (invisible) version is currently implemented.

### Provider

Captcha provider to use. Captcha will be disabled if left empty.

- object-path: `captcha.provider`
- dotenv var: `CAPTCHA_PROVIDER`
- type: `h-captcha | re-captcha`
- default: `''`

### Secret key

- object-path: `captcha.secret`
- dotenv var: `CAPTCHA_SECRET`
- type: `string`
- default: `''`

## Web-push

Provides web-push functionality for supported browsers.

To enable the functionality, VAPID keys has to be generated.

```sh
npx web-push generate-vapid-keys
```

### Subject

- object-path: `webPush.subject`
- dotenv var: `WEBPUSH_SUBJECT`
- type: `string`
- default: `''`

### VAPID public key

- object-path: `webPush.publicKey`
- dotenv var: `WEBPUSH_PUBLIC_KEY`
- type: `string`
- default: `''`

### VAPID private key

- object-path: `webPush.privateKey`
- dotenv var: `WEBPUSH_PRIVATE_KEY`
- type: `string`
- default: `''`
