# Languages

## Browse languages

Browse paginated language list

### Request

```http
GET /api/admin/languages
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

## Create language

Create new language entry

### Request

```http
POST /api/admin/languages

Authorization: Bearer {accessToken}
Content-Type: application/json

{
    "id": string,
    "englishName": string,
    "localName": string,
    "countryFlagCode": string,
    "textDirection": string,
    "visibility": 'public' | 'restricted'
}
```

### Response

```json
201 Created

{
    ...
}
```

## Get language

Get language entry

### Request

```http
GET /api/admin/languages/:languageId

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

## Update language

Update language entry

### Request

```http
PUT /api/admin/languages/:languageId

Authorization: Bearer {accessToken}
Content-Type: application/json

{
    "englishName": string,
    "localName": string,
    "countryFlagCode": string,
    "textDirection": string,
    "visibility": 'public' | 'restricted'
}
```

### Response

```json
200 OK

{
    ...
}
```

## Delete language

Delete language entry

### Request

```http
DELETE /api/admin/languages/:languageId

Authorization: Bearer {accessToken}
Content-Type: application/json
```

### Response

```json
204 No Content
```

## Get language translations

Get language translations

### Request

```http
GET /api/admin/languages/:languageId/translations

Authorization: Bearer {accessToken}
Content-Type: application/json
```

### Response

```json
200 OK

[
    {
        "id": string,
        "languageId": string,
        "application": string,
        "section": string,
        "messages": { ... },
        "createdAt": Date,
        "updatedAt": Date
    },
    ...
]
```

## Update language translations

Update language translations

### Request

```http
POST /api/admin/languages/:languageId/translations

Authorization: Bearer {accessToken}
Content-Type: application/json

[
    {
        "id": string,
        "messages": { ... },
    },
    ...
]
```

### Response

```json
200 OK

```
