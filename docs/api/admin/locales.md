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

## Queue task

Submits job to the queue.

Specific jobs can be submitted to the queue. Each job type has its own parameters. See [job types](/admin/system/job-types) for more information.

### Request

```json
POST /api/admin/locales/:localeId/tasks

Authorization: Bearer {accessToken}
Content-Type: application/json | multipart/form-data

{
    "type": string,
    "params": {
        ...
    }
}
```

### Response

Returns job resource entry.

```json
200 OK

{
    ...
}
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

## Get split lists

Get split lists entries

### Request

```json
GET /api/admin/locales/:localeId/split-lists

Authorization: Bearer {accessToken}
Content-Type: application/json
```

### Response

```json
200 OK

[
    {
        "id": string,
        "localeId": string,
        "firstWord": string,
        "words": string,
    },
    ...
]
```

## Set split lists

Set split lists entries

### Request

```json
POST /api/admin/locales/:localeId/split-lists

Authorization: Bearer {accessToken}
Content-Type: application/json

[
    {
        "id": string,
        "localeId": string,
        "firstWord": string,
        "words": string
    },
    ...
]

```

### Response

```json
200 OK

[
    {
        "id": string,
        "localeId": string,
        "firstWord": string,
        "words": string
    },
    ...
]
```

## Get split words

Get split words entries

### Request

```json
GET /api/admin/locales/:localeId/split-words

Authorization: Bearer {accessToken}
Content-Type: application/json
```

### Response

```json
200 OK

[
    {
        "id": string,
        "localeId": string,
        "words": string
    },
    ...
]
```

## Set split words

Set split words entries

### Request

```json
POST /api/admin/locales/:localeId/split-words

Authorization: Bearer {accessToken}
Content-Type: application/json

[
    {
        "id": string,
        "localeId": string,
        "words": string
    },
    ...
]

```

### Response

```json
200 OK

[
    {
        "id": string,
        "localeId": string,
        "words": string
    },
    ...
]
```

## Get synonym sets

Get synonym sets entries

### Request

```json
GET /api/admin/locales/:localeId/synonym-sets

Authorization: Bearer {accessToken}
Content-Type: application/json
```

### Response

```json
200 OK

[
    {
        "id": string,
        "localeId": string,
        "synonyms": string
    },
    ...
]
```

## Set synonym sets

Set synonym sets entries

### Request

```json
POST /api/admin/locales/:localeId/synonym-sets

Authorization: Bearer {accessToken}
Content-Type: application/json

[
    {
        "id": string,
        "localeId": string,
        "synonyms": string
    },
    ...
]

```

### Response

```json
200 OK

[
    {
        "id": string,
        "localeId": string,
        "synonyms": string
    },
    ...
]
```
