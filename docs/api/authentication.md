# Authentication

Current authentication system is based on JWT tokens.

It is designed to work with SPA applications:

- Admin tool [admin endpoints](/api/admin/authentication)
- Survey / Feedback frontend [survey endpoints](/api/survey/authentication)

Login endpoints issue JWT `access tokens` in response body. `Access token` is short-lived JWT and should be included in header to authorize given request.

```json
GET /some/end/point

Authorization: Bearer {accessToken}
Content-Type: application/json
```

Response includes cookie with `refresh token`, which can be used to obtain fresh `access token`. By default, cookie is `http-only` (prevents to be read by javascript code) and `secure` (sent over https-only), please refer to [security configuration](/config/api/security#json-web-tokens) for more details.
