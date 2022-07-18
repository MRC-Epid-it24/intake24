# Authentication

Admin frontend authentication endpoints.

## Login

Login with email / password

### Request

```json
POST /api/admin/auth/login

Content-Type: application/json

{
    "email": string,
    "password": string
}
```

### Response

Response can differ based on whether multi-factor authentication is enabled or not.

#### Successful login without MFA challenge

```json
200 OK

{
    "accessToken": string
}
```

#### Successful login with MFA challenge

```json
200 OK

{
    "mfaRequestUrl": string;
}
```

## Verify MFA challenge

Verify multi-factor authentication challenge

### Request

```json
POST /api/admin/auth/verify

Content-Type: application/json

{
    "code": string,
    "state": string
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

API server expects `refresh token` sent as cookie. Cookie name can differ based on API server configuration. Default (`it24a_refresh_token`)

### Request

```json
POST /api/admin/auth/refresh

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
POST /api/admin/auth/logout

Content-Type: application/json
```

### Response

```json
200 OK
```
