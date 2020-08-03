# Schemes

## List schemes

Get scheme list

### Request

```http
GET /admin/schemes
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

## Create scheme

Create new scheme entry

### Request

```http
POST /admin/schemes

Authorization: Bearer {accessToken}
Content-Type: application/json

{
    "id": string,
    "name": string,
    "type": 'legacy' | 'data-driven',
    "meals": [{...}],
    "questions": {...}
}
```

### Response

```json
201 Created

{
    "data": {...}
}
```

## Get scheme

Get scheme entry

### Request

```http
GET /admin/schemes/:schemeId

Authorization: Bearer {accessToken}
Content-Type: application/json
```

### Response

```json
200 OK

{
    "data": {...},
    "refs": {...}
}
```

## Update scheme

Update existing scheme entry

### Request

```http
PUT /admin/schemes/:schemeId

Authorization: Bearer {accessToken}
Content-Type: application/json

{
    "name": string,
    "type": 'legacy' | 'data-driven',
    "meals": [{...}],
    "questions": {...}
}
```

### Response

```json
200 OK

{
    "data": {...},
    "refs": {...}
}
```

## Delete scheme

Delete existing scheme entry

### Request

```http
DELETE /admin/schemes/:schemeId

Authorization: Bearer {accessToken}
Content-Type: application/json
```

### Response

```json
204 No Content
```
