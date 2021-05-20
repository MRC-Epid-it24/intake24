# Schemes

## Browse schemes

Browse paginated scheme list

### Request

```http
GET /api/admin/schemes
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
POST /api/admin/schemes

Authorization: Bearer {accessToken}
Content-Type: application/json

{
    "id": string,
    "name": string,
    "type": 'legacy' | 'data-driven',
    "meals": [{...}],
    "questions": {...},
    "export": [{...}]
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
GET /api/admin/schemes/:schemeId

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

Update scheme entry

### Request

```http
PUT /api/admin/schemes/:schemeId

Authorization: Bearer {accessToken}
Content-Type: application/json

{
    "name": string,
    "type": 'legacy' | 'data-driven',
    "meals": [{...}],
    "questions": {...},
    "export": [{...}]
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

Delete scheme entry

### Request

```http
DELETE /api/admin/schemes/:schemeId

Authorization: Bearer {accessToken}
Content-Type: application/json
```

### Response

```json
204 No Content
```


## Question templates

Browse available question templates for scheme

### Request

```http
GET /api/admin/schemes/:schemeId/templates
    ?search={searchText}
    &limit={limit}

Authorization: Bearer {accessToken}
Content-Type: application/json
```

### Response

```json
200 OK

{
    "data": [{...}],
}
```
