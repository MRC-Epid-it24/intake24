# Sign-in Logs

## Browse sign-in logs

Browse paginated sign-in logs list

### Request

```http
GET /api/admin/sign-in-logs
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

## Get sign-in log

Get sign-in log entry

### Request

```http
GET /api/admin/sign-in-logs/:signInLogId

Authorization: Bearer {accessToken}
Content-Type: application/json
```

### Response

```json
200 OK

{
    ...
}
```

## Delete sign-in log

Delete sign-in log entry

### Request

```http
DELETE /api/admin/sign-in-logs/:signInLogId

Authorization: Bearer {accessToken}
Content-Type: application/json
```

### Response

```json
204 No Content
```
