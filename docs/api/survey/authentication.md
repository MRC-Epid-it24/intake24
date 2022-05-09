# Authentication

Survey frontend authentication endpoints.

## Login with email

Login with email / password

### Request

```http
POST /api/auth/login

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

## Login with survey alias

Login with username / password

### Request

```http
POST /api/auth/login/alias

Content-Type: application/json

{
    "username": string,
    "password": string,
    "survey": string
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

```http
POST /api/auth/login/token

Content-Type: application/json

{
    "token": string
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

```http
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

```http
POST /api/auth/logout

Content-Type: application/json
```

### Response

```json
200 OK
```
