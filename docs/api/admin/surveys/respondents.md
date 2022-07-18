# Survey respondents

## Browse respondents

Get list of survey respondents.

::: tip List content
List includes users with `{surveyId}/respondent` role.
:::

### Request

```json
GET /api/admin/surveys/:surveyId/respondents
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

## Create respondent

Create new survey respondent

### Request

```json
POST /api/admin/surveys/:surveyId/respondents

Authorization: Bearer {accessToken}
Content-Type: application/json

{
    "username": string,
    "name": string? | null,
    "email": string? | null,
    "phone": string? | null,
    "password": string,
    "passwordConfirm": string,
    "customFields": [
        {
            "name": string,
            "value": string
        }
    ]
}
```

### Response

```json
201 Created

{
    "userId": string,
    "surveyId": string,
    "username": string,
    "urlAuthToken": string,
    "name": string | null,
    "email": string | null,
    "phone": string | null,
    "customFields": [
        {
            "name": string,
            "value": string
        }
    ]
}
```

## Get respondent

Get survey respondent record

### Request

```json
GET /api/admin/surveys/:surveyId/respondents/:userId

Authorization: Bearer {accessToken}
Content-Type: application/json
```

### Response

```json
200 OK

{
    "userId": string,
    "surveyId": string,
    "username": string,
    "urlAuthToken": string,
    "name": string | null,
    "email": string | null,
    "phone": string | null,
    "customFields": [
        {
            "name": string,
            "value": string
        }
    ]
}
```

## Update respondent

Update survey respondent

### Request

```json
PATCH /api/admin/surveys/:surveyId/respondents/:userId

Authorization: Bearer {accessToken}
Content-Type: application/json

{
    "name": string? | null,
    "email": string? | null,
    "phone": string? | null,
    "password": string? | null,
    "passwordConfirm": string? | null
}
```

### Response

```json
200 OK

{
    "userId": string,
    "surveyId": string,
    "username": string,
    "urlAuthToken": string,
    "name": string | null,
    "email": string | null,
    "phone": string | null,
    "customFields": [
        {
            "name": string,
            "value": string
        }
    ]
}
```

## Delete respondent

Delete respondent

### Request

```json
DELETE /api/admin/surveys/:surveyId/respondents/:userId

Authorization: Bearer {accessToken}
Content-Type: application/json
```

### Response

```json
204 No Content
```

## Download feedback

Download feedback as PDF. Returns stream as `application/pdf`.

### Request

```json
GET /api/admin/surveys/:surveyId/respondents/:userId/feedback

Authorization: Bearer {accessToken}
Content-Type: application/json
```

### Response

```json
200 OK
```

## Email feedback

Email feedback as PDF attachment.

### Request

```json
POST /api/admin/surveys/:surveyId/respondents/:userId/feedback

Authorization: Bearer {accessToken}
Content-Type: application/json

{
    "email": string,
    "copy": 'none' | 'cc' | 'bcc'
}
```

### Response

```json
200 OK
```

## Export authentication URLs

Submits a job to generate CSV file with authentication URLs.

### Request

```json
POST /api/admin/surveys/:surveyId/respondents/export-auth-urls

Authorization: Bearer {accessToken}
Content-Type: application/json
```

### Response

Returns job resource entry.

```json
200 OK

{
    ...
}
```

## Upload respondents

Submits a job to import respondent from CSV file.

### Request

```json
POST /api/admin/surveys/:surveyId/respondents/upload

Authorization: Bearer {accessToken}
Content-Type: multipart/form-data

{
    "file": File
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
