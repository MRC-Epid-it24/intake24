# Password recovery 

Routes to handle user's password recovery.

## Password request

Request a password reset. It sends an email to user with password recovery link.

- route can be protected with [Google reCAPTCHA](https://developers.google.com/recaptcha/intro), see [API Services Config](/config/api/services#google-recaptcha) for more details.
- route is rate-limited, see [API Rate Limiter Config](/config/api/rate-limiter#password).

Field `recaptcha` can be omitted if `Google reCAPTCHA` is disabled.

### Request

```http
POST /api/password

Content-Type: application/json

{
    "email": string,
    "recaptcha"?: string
}
```

### Response

```json
200 OK
```

## Password reset

Reset user's password.

Field `token` value is received with password recovery email. It is valid to limited period of time specified in [API Security Config](/config/api/security#passwords).

### Request

```http
POST /api/password/reset

Content-Type: application/json

{
    "email": string,
    "password": string,
    "passwordConfirm": string,
    "token": string
}
```

### Response

```json
200 OK
```
