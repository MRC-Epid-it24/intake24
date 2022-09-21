# Sign-up

Registrations and account verifications for admin tool.

## Sign up

Create new admin account.

### Request

```json
POST /api/admin/signup

Content-Type: application/json

{
    "name": string | null,
    "phone": string | null,
    "email": string | null,
    "emailConfirm": string | null,
    "password": string | null,
    "passwordConfirm": string | null,
    "terms": boolean,
    "captcha": string | null,
}
```

### Response

```json
200 OK

{
    "accessToken": string
}
```

## Verify account

Verify email account

### Request

```json
POST /api/admin/signup/verify

Content-Type: application/json

{
    "token": string
}
```

### Response

```json
200 OK
```
