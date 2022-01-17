# Services

Path: `apps/api/src/config/services.ts`

## Google reCAPTCHA

Password recovery can be protected by [Google reCAPTCHA](https://developers.google.com/recaptcha/intro). V2 (invisible) is currently implemented.

### Enabled

Determines whether the reCAPTCHA is enabled or not.

* object-path: `recaptcha.enabled`
* dotenv var: `RECAPTCHA_ENABLED`
* type: `boolean`
* default: `false`

### Secret key

* object-path: `recaptcha.secret`
* dotenv var: `RECAPTCHA_SECRET`
* type: `string`
* default: `''`

## Web-push

Provides web-push functionality for supported browsers.

To enable the functionality, VAPID keys has to be generated.

```sh
npx web-push generate-vapid-keys
```

### Subject

* object-path: `webPush.subject`
* dotenv var: `WEBPUSH_SUBJECT`
* type: `string`
* default: `''`

### VAPID public key

* object-path: `webPush.publicKey`
* dotenv var: `WEBPUSH_PUBLIC_KEY`
* type: `string`
* default: `''`

### VAPID private key

* object-path: `webPush.privateKey`
* dotenv var: `WEBPUSH_PRIVATE_KEY`
* type: `string`
* default: `''`
