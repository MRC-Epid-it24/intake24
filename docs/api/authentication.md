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

Along the response, `http-only` cookie with `refresh token` is issued, which can be used to obtain fresh access token.
