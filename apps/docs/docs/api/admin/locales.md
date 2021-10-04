# Locales

## Browse locales

Browse paginated locale list

### Request

```http
GET /api/admin/locales
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

## Create locale

Create new locale entry

### Request

```http
POST /api/admin/locales

Authorization: Bearer {accessToken}
Content-Type: application/json

{
    "id": string,
    "englishName": string,
    "localName": string,
    "respondentLanguageId": string,
    "adminLanguageId": string,
    "countryFlagCode": string,
    "prototypeLocaleId": string | null,
    "textDirection": string
}
```

### Response

```json
201 Created

{
    "data": {...}
}
```

## Get locale

Get locale entry

### Request

```http
GET /api/admin/locales/:localeId

Authorization: Bearer {accessToken}
Content-Type: application/json
```

### Response

```json
200 OK

{
    "data": {...},
    "refs": {
        "languages": [{...}],
        "locales": [{...}]
    }
}
```

## Update locale

Update locale entry

### Request

```http
PUT /api/admin/locales/:localeId

Authorization: Bearer {accessToken}
Content-Type: application/json

{
    "englishName": string,
    "localName": string,
    "respondentLanguageId": string,
    "adminLanguageId": string,
    "countryFlagCode": string,
    "prototypeLocaleId": string | null,
    "textDirection": string
}
```

### Response

```json
200 OK

{
    "data": {...},
    "refs": {
        "languages": [{...}],
        "locales": [{...}]
    }
}
```

## Delete locale

Delete locale entry

### Request

```http
DELETE /api/admin/locales/:localeId

Authorization: Bearer {accessToken}
Content-Type: application/json
```

### Response

```json
204 No Content
```
