# Authentication

## SPA applications

Authentication system for SPA applications is based on JWT tokens, combination of short-lived `access token` and long-lived `refresh token`.

SPA-application-specific auth routes:

- Admin tool [admin endpoints](/api/admin/authentication)
- Survey / Feedback frontend [survey endpoints](/open-api.html){target="blank"}

Login endpoints issue JWT `access tokens` in response body. `Access token` is short-lived JWT and has to be included in `Authorization` header for specific endpoint.

```json
GET /some/end/point

Authorization: Bearer {accessToken}
Content-Type: application/json
```

Response includes cookie with `refresh token`, which can be used to obtain fresh `access token`. By default, cookie is `http-only` (prevents to be read by javascript code) and `secure` (sent over https-only), please refer to [security configuration](/config/api/security#json-web-tokens) for more details.

## Machine-to-machine communication

Combination of short-lived `access token` and long-lived `refresh token` is focused on security and usability within SPA applications. Moreover, account can be protected with multi-factor authentication, which is not suitable for `machine-to-machine` communication.

For integration with other applications, i.e. `machine-to-machine` communication is preferred, personal access tokens can be used.

Personal access tokens are long-lived JWT tokens, which can be used to authenticate requests. Personal access tokens are bound to specific user. Personal access tokens can be created in [admin tool](/admin/user/personal-access-tokens).
