# Authentication

Current authentication system is based on JWT tokens.

It is designed to work with SPA applications:

* Survey / Feedback frontend
* Admin tool

Login endpoints issue JWT `access tokens` in response body. `Access token` is short-lived JWT and should be included in header to authorize given request.

```http
GET /some/end/point

Authorization: Bearer {accessToken}
Content-Type: application/json
```

Along the response, `http-only` cookie with `refresh token` is issued, which can be used to obtain fresh access token.

## Login with email

Login with email / password

### Request

```http
POST /api/login

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
POST /api/login/alias

Content-Type: application/json

{
    "userName": string,
    "password": string,
    "surveyId": string
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
POST /api/login/token

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

## Verify MFA challenge

Verify multi-factor authentication challenge

### Request

```http
POST /api/login/verify

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

API server expects `refresh token` sent as cookie. Cookie name can differ based on API server configuration. Default (`it24_refresh_token`)

### Request

```http
POST /api/refresh

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
POST /api/logout

Content-Type: application/json
```

### Response

```json
200 OK
```
