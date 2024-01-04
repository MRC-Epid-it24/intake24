# Authentication

Survey frontend authentication endpoints.

## Login with email

Login with email / password

### Request

```json
POST /api/auth/login

Content-Type: application/json

{
    "email": string,
    "password": string,
    "survey": string,
    "captcha"?: string
}
```

### Response

```json
200 OK

{
    "accessToken": string
}
```

## Login with survey alias

Login with username / password

### Request

```json
POST /api/auth/login/alias

Content-Type: application/json

{
    "username": string,
    "password": string,
    "survey": string,
    "captcha"?: string
}
```

### Response

```json
200 OK

{
    "accessToken": string
}
```

## Login with token

Login with token

### Request

```json
POST /api/auth/login/token

Content-Type: application/json

{
    "token": string,
    "captcha"?: string
}
```

### Response

```json
200 OK

{
    "accessToken": string
}
```

## Refresh access token

Refresh access token using refresh token

API server expects `refresh token` sent as cookie. Cookie name can differ based on API server configuration. Default (`it24s_refresh_token`)

### Request

```json
POST /api/auth/refresh

Content-Type: application/json

Cookie: {name}={refreshToken}
```

### Response

```json
200 OK

{
    "accessToken": string
}
```

## Logout

Clears `http-only` cookie which stores `refresh token` and revokes `refresh token`.

### Request

```json
POST /api/auth/logout

Content-Type: application/json
```

### Response

```json
200 OK
```
