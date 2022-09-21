# User profile

## Get profile data

Get logged-in user profile data

### Request

```json
GET /api/admin/user

Authorization: Bearer {accessToken}
Content-Type: application/json
```

### Response

```json
200 OK

{
    "profile": {
        "name": string,
        "email": string,
        "phone": string
    },
    "permissions": string[],
    "roles": string[]
}
```

## Verification email

Request new account verification link

### Request

```json
POST /api/admin/user/verify

Authorization: Bearer {accessToken}
Content-Type: application/json
```

### Response

```json
200 OK
```
