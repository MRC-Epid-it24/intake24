# Password recovery

Routes to handle user's password recovery.

## Password request

Request a password reset. It sends an email to user with an unique password recovery link.

- route can be protected with captcha, see [API Services Config](/config/api/services#captcha) for more details.
- route is rate-limited, see [API Rate Limiter Config](/config/api/rate-limiter#password).

Field `captcha` can be omitted if `captcha` functionality is disabled.

### Request

```json
POST /api/password

Content-Type: application/json

{
    "email": string,
    "captcha"?: string
}
```

### Response

```json
200 OK
```

## Password reset

Reset user's password.

Field `token` value is received with password recovery email. It is valid for a limited time period specified in [API Security Config](/config/api/security#passwords).

### Request

```json
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
