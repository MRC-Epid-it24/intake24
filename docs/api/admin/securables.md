# Securables

Section describes subset of routes, which are registered for any resources with implemented `securable` per-record access.

Securable types:

- `feedback-schemes`
- `survey-schemes`
- `surveys`

## Browse users

Browse paginated list of users with any permission for particular record

### Request

```http
GET /api/admin/{securableType}/{securableId}/securables
    ?search={searchText}
    &page={page}
    &limit={limit}

Authorization: Bearer {accessToken}
Content-Type: application/json
```

### Response

```json
200 OK

{
    "data": [{...}],
    "meta": {...}
}
```

## Create user with securables

Create new user with `securable` actions.

### Request

```http
POST /api/admin/{securableType}/{securableId}/securables

Authorization: Bearer {accessToken}
Content-Type: application/json

{
    "email": string,
    "name": string,
    "phone": string,
    "actions": string[]
}
```

### Response

```json
201 Created
```

## Update securable actions

Update existing user with `securable` actions.

### Request

```http
PATCH /api/admin/{securableType}/{securableId}/securables/{userId}

Authorization: Bearer {accessToken}
Content-Type: application/json

{
    "actions": string[]
}
```

### Response

```json
200 OK
```

## Delete securable actions

Delete user's `securable` actions.

:::tip
It does not remove user account.
:::

### Request

```http
DELETE /api/admin/{securableType}/{securableId}/securables/{userId}

Authorization: Bearer {accessToken}
Content-Type: application/json
```

### Response

```json
204 No Content
```

## Search for available users

Search for available users within the system to assign securables.

### Request

```http
GET /api/admin/{securableType}/{securableId}/securables/users
    ?search={searchText}

Authorization: Bearer {accessToken}
Content-Type: application/json
```

### Response

```json
200 OK

[
    {
        "id": string,
        "name": string,
        "email": string
    },
    ...
]
```

## Update ownership

Update `securable` record's ownership.

### Request

```http
POST /api/admin/{securableType}/{securableId}/securables/owner

Authorization: Bearer {accessToken}
Content-Type: application/json

{
    "userId": string | null
}
```

### Response

```json
200 OK
```
