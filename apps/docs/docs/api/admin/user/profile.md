# User profile

## Get profile data

Get logged-in user profile data

### Request

```http
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
