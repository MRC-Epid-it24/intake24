# Jobs

## Browse jobs

Browse paginated job list

### Request

```json
GET /api/admin/jobs
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

## Get job

Get job entry

### Request

```json
GET /api/admin/jobs/:jobId

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

## Download job file

Download file generated by job (if any and not expired).

### Request

```json
GET /api/admin/jobs/:jobId/download

Authorization: Bearer {accessToken}
Content-Type: application/json
```

### Response

```json
200 OK

Buffer
```

## Delete job

Delete job entry

### Request

```json
DELETE /api/admin/jobs/:jobId

Authorization: Bearer {accessToken}
Content-Type: application/json
```

### Response

```json
204 No Content
```

## Repeat job

Repeat job with same parameters.

### Request

```json
GET /api/admin/jobs/:jobId/repeat

Authorization: Bearer {accessToken}
Content-Type: application/json
```

### Response

```json
200 OK
```