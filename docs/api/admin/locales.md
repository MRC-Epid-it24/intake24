# Locales

## Browse locales

Browse paginated locale list

### Request

```json
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

```json
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
    ...
}
```

## Get locale

Get locale entry

### Request

```json
GET /api/admin/locales/:localeId

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

## Update locale

Update locale entry

### Request

```json
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
    ...
}
```

## Delete locale

Delete locale entry

### Request

```json
DELETE /api/admin/locales/:localeId

Authorization: Bearer {accessToken}
Content-Type: application/json
```

### Response

```json
204 No Content
```

## Locale references

Get locale references

### Request

```json
GET /api/admin/locales/refs

Authorization: Bearer {accessToken}
Content-Type: application/json
```

### Response

```json
200 OK

{
    "languages": [
        {
            "id": string,
            "englishName": string,
            "localName": string,
            "countryFlagCode": string
        },
        ...
    ],
    "locales": [
        {
            "id": string,
            "englishName": string,
            "localName": string
        },
        ...
    ]
}
```
