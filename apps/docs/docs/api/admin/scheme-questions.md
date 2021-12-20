# Scheme questions

Manage scheme question templates

## Browse scheme questions

Browse paginated scheme questions list

### Request

```http
GET /api/admin/scheme-questions
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

## Create scheme question

Create new scheme question entry

### Request

```http
POST /api/admin/scheme-questions

Authorization: Bearer {accessToken}
Content-Type: application/json

{
    "question": {...}
}
```

### Response

```json
201 Created

{
    ...
}
```

## Get scheme question

Get scheme question entry

### Request

```http
GET /api/admin/scheme-questions/:schemeQuestionId

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

## Update scheme question

Update scheme question entry

### Request

```http
PUT /api/admin/scheme-questions/:schemeQuestionId

Authorization: Bearer {accessToken}
Content-Type: application/json

{
    "question": {...}
}
```

### Response

```json
200 OK

{
    ...
}
```

## Delete scheme question

Delete scheme question entry

### Request

```http
DELETE /api/admin/scheme-questions/:schemeQuestionId

Authorization: Bearer {accessToken}
Content-Type: application/json
```

### Response

```json
204 No Content
```

## Scheme question references

Get scheme question references

### Request

```http
GET /api/admin/scheme-questions/refs

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
    "questionIds": string[],
    "schemes": [{...}]
}
```

## Scheme question sync

Synchronize scheme question template with specific question in scheme section

### Request

```http
POST /api/admin/scheme-questions/:schemeQuestionId/sync

Authorization: Bearer {accessToken}
Content-Type: application/json

{
    "schemeId": string,
    "section": string,
    "question": {...}
}
```

### Response

```json
200 OK

{
    "data": [{...}],
}
```
